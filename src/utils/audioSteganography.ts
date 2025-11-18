import CryptoJS from 'crypto-js';

export interface AudioEncodeOptions {
  message: string;
  password?: string;
}

export interface AudioDecodeOptions {
  password?: string;
}

export interface AudioSteganographyResult {
  success: boolean;
  data?: string | ArrayBuffer;
  error?: string;
  capacity?: number;
}

class AudioSteganography {
  private readonly HEADER_SIZE = 32;
  private readonly BITS_PER_SAMPLE = 2; // Use 2 LSB

  /**
   * Calculate capacity of audio file in bytes
   */
  calculateCapacity(audioBuffer: AudioBuffer): number {
    const totalSamples = audioBuffer.length * audioBuffer.numberOfChannels;
    const totalBits = totalSamples * this.BITS_PER_SAMPLE;
    const availableBits = totalBits - this.HEADER_SIZE;
    return Math.floor(availableBits / 8);
  }

  /**
   * Encode message into WAV audio
   */
  async encode(audioBuffer: AudioBuffer, options: AudioEncodeOptions): Promise<AudioSteganographyResult> {
    try {
      let { message, password } = options;

      // Encrypt if password provided
      if (password) {
        message = CryptoJS.AES.encrypt(message, password).toString();
      }

      // Add metadata
      const metadata = {
        encrypted: !!password,
        timestamp: Date.now(),
        content: message
      };
      const dataToHide = JSON.stringify(metadata);

      // Convert to binary
      const binaryMessage = this.stringToBinary(dataToHide);
      const messageLength = binaryMessage.length;

      // Check capacity
      const capacity = this.calculateCapacity(audioBuffer);
      if (messageLength / 8 > capacity) {
        return {
          success: false,
          error: `Message too large. Maximum capacity: ${capacity} bytes`
        };
      }

      // Create a copy of the audio buffer
      const modifiedBuffer = this.copyAudioBuffer(audioBuffer);

      // Encode message length
      const lengthBinary = this.numberToBinary(messageLength, this.HEADER_SIZE);
      const fullBinary = lengthBinary + binaryMessage;

      // Hide in LSB
      let binaryIndex = 0;

      for (let channel = 0; channel < modifiedBuffer.numberOfChannels; channel++) {
        const channelData = modifiedBuffer.getChannelData(channel);

        for (let i = 0; i < channelData.length && binaryIndex < fullBinary.length; i++) {
          const sample = channelData[i];
          // Convert to 16-bit integer
          const intSample = Math.round(sample * 32767);

          // Get bits to hide
          const bits = fullBinary.substr(binaryIndex, this.BITS_PER_SAMPLE);
          if (bits.length > 0) {
            // Clear LSBs and set new ones
            const newSample = (intSample & ~((1 << this.BITS_PER_SAMPLE) - 1)) |
                            parseInt(bits.padEnd(this.BITS_PER_SAMPLE, '0'), 2);
            channelData[i] = newSample / 32767;
            binaryIndex += bits.length;
          }
        }
      }

      // Convert back to WAV
      const wavData = this.audioBufferToWav(modifiedBuffer);

      return {
        success: true,
        data: wavData,
        capacity
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Encoding failed'
      };
    }
  }

  /**
   * Decode message from audio buffer
   */
  async decode(audioBuffer: AudioBuffer, options: AudioDecodeOptions = {}): Promise<AudioSteganographyResult> {
    try {
      const { password } = options;

      // Extract message length
      let binaryLength = '';
      let bitCount = 0;
      let channelIndex = 0;
      let sampleIndex = 0;

      while (bitCount < this.HEADER_SIZE) {
        if (channelIndex >= audioBuffer.numberOfChannels) {
          channelIndex = 0;
          sampleIndex++;
        }

        const channelData = audioBuffer.getChannelData(channelIndex);
        if (sampleIndex >= channelData.length) break;

        const sample = channelData[sampleIndex];
        const intSample = Math.round(sample * 32767);
        const bits = (intSample & ((1 << this.BITS_PER_SAMPLE) - 1))
          .toString(2).padStart(this.BITS_PER_SAMPLE, '0');

        binaryLength += bits;
        bitCount += this.BITS_PER_SAMPLE;
        channelIndex++;
      }

      const messageLength = parseInt(binaryLength.substring(0, this.HEADER_SIZE), 2);

      if (messageLength <= 0 || messageLength > this.calculateCapacity(audioBuffer) * 8) {
        return {
          success: false,
          error: 'No hidden message found'
        };
      }

      // Extract message
      let binaryMessage = '';
      bitCount = 0;

      while (bitCount < messageLength) {
        if (channelIndex >= audioBuffer.numberOfChannels) {
          channelIndex = 0;
          sampleIndex++;
        }

        const channelData = audioBuffer.getChannelData(channelIndex);
        if (sampleIndex >= channelData.length) break;

        const sample = channelData[sampleIndex];
        const intSample = Math.round(sample * 32767);
        const bits = (intSample & ((1 << this.BITS_PER_SAMPLE) - 1))
          .toString(2).padStart(this.BITS_PER_SAMPLE, '0');

        binaryMessage += bits;
        bitCount += this.BITS_PER_SAMPLE;
        channelIndex++;
      }

      // Convert to string
      const extractedData = this.binaryToString(binaryMessage.substring(0, messageLength));
      const metadata = JSON.parse(extractedData);
      let message = metadata.content;

      // Decrypt if needed
      if (metadata.encrypted) {
        if (!password) {
          return {
            success: false,
            error: 'Password required'
          };
        }
        try {
          const decrypted = CryptoJS.AES.decrypt(message, password);
          message = decrypted.toString(CryptoJS.enc.Utf8);
          if (!message) {
            return { success: false, error: 'Incorrect password' };
          }
        } catch {
          return { success: false, error: 'Incorrect password' };
        }
      }

      return { success: true, data: message };
    } catch (error) {
      return {
        success: false,
        error: 'No hidden message found or decoding failed'
      };
    }
  }

  /**
   * Copy audio buffer
   */
  private copyAudioBuffer(audioBuffer: AudioBuffer): AudioBuffer {
    const newBuffer = new AudioBuffer({
      length: audioBuffer.length,
      numberOfChannels: audioBuffer.numberOfChannels,
      sampleRate: audioBuffer.sampleRate
    });

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const sourceData = audioBuffer.getChannelData(channel);
      const targetData = newBuffer.getChannelData(channel);
      targetData.set(sourceData);
    }

    return newBuffer;
  }

  /**
   * Convert AudioBuffer to WAV file
   */
  private audioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length * numberOfChannels * 2;

    const buffer = new ArrayBuffer(44 + length);
    const view = new DataView(buffer);

    // WAV header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat (PCM)
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true); // ByteRate
    view.setUint16(32, numberOfChannels * 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    this.writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // Write audio data
    const offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        const intSample = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset + (i * numberOfChannels + channel) * 2,
                     intSample < 0 ? intSample * 0x8000 : intSample * 0x7FFF,
                     true);
      }
    }

    return buffer;
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  private stringToBinary(str: string): string {
    let binary = '';
    for (let i = 0; i < str.length; i++) {
      binary += str.charCodeAt(i).toString(2).padStart(16, '0');
    }
    return binary;
  }

  private binaryToString(binary: string): string {
    let str = '';
    for (let i = 0; i < binary.length; i += 16) {
      const chunk = binary.substr(i, 16);
      if (chunk.length === 16) {
        str += String.fromCharCode(parseInt(chunk, 2));
      }
    }
    return str;
  }

  private numberToBinary(num: number, bits: number): string {
    return num.toString(2).padStart(bits, '0');
  }
}

export const audioSteganography = new AudioSteganography();
