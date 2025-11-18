import CryptoJS from 'crypto-js';

export interface EncodeOptions {
  message: string;
  password?: string;
  compressionLevel?: number;
}

export interface DecodeOptions {
  password?: string;
}

export interface SteganographyResult {
  success: boolean;
  data?: string;
  error?: string;
  capacity?: number;
}

class ImageSteganography {
  private readonly HEADER_SIZE = 32; // bits for message length
  private readonly BITS_PER_CHANNEL = 2; // Use 2 LSB for better capacity

  /**
   * Calculate the maximum capacity of an image in bytes
   */
  calculateCapacity(imageData: ImageData): number {
    const totalPixels = imageData.width * imageData.height;
    const totalBits = totalPixels * 3 * this.BITS_PER_CHANNEL; // RGB channels only
    const headerBits = this.HEADER_SIZE;
    const availableBits = totalBits - headerBits;
    return Math.floor(availableBits / 8); // Convert to bytes
  }

  /**
   * Encode a message into image data using LSB steganography
   */
  encode(imageData: ImageData, options: EncodeOptions): SteganographyResult {
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

      // Convert message to binary
      const binaryMessage = this.stringToBinary(dataToHide);
      const messageLength = binaryMessage.length;

      // Check capacity
      const capacity = this.calculateCapacity(imageData);
      if (messageLength / 8 > capacity) {
        return {
          success: false,
          error: `Message too large. Maximum capacity: ${capacity} bytes, Required: ${Math.ceil(messageLength / 8)} bytes`
        };
      }

      // Encode message length in header
      const lengthBinary = this.numberToBinary(messageLength, this.HEADER_SIZE);
      const fullBinary = lengthBinary + binaryMessage;

      // Hide data in LSB
      const data = imageData.data;
      let binaryIndex = 0;

      for (let i = 0; i < data.length && binaryIndex < fullBinary.length; i++) {
        // Skip alpha channel (every 4th byte)
        if ((i + 1) % 4 === 0) continue;

        // Replace LSB bits
        const bits = fullBinary.substr(binaryIndex, this.BITS_PER_CHANNEL);
        if (bits.length > 0) {
          // Clear the LSB bits and set new ones
          data[i] = (data[i] & (255 << this.BITS_PER_CHANNEL)) | parseInt(bits.padEnd(this.BITS_PER_CHANNEL, '0'), 2);
          binaryIndex += bits.length;
        }
      }

      return { success: true, capacity };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Encoding failed'
      };
    }
  }

  /**
   * Decode a message from image data
   */
  decode(imageData: ImageData, options: DecodeOptions = {}): SteganographyResult {
    try {
      const { password } = options;
      const data = imageData.data;

      // Extract message length from header
      let binaryLength = '';
      let bitCount = 0;
      let i = 0;

      while (bitCount < this.HEADER_SIZE && i < data.length) {
        if ((i + 1) % 4 === 0) {
          i++;
          continue;
        }
        const bits = (data[i] & ((1 << this.BITS_PER_CHANNEL) - 1)).toString(2).padStart(this.BITS_PER_CHANNEL, '0');
        binaryLength += bits;
        bitCount += this.BITS_PER_CHANNEL;
        i++;
      }

      const messageLength = parseInt(binaryLength.substring(0, this.HEADER_SIZE), 2);

      if (messageLength <= 0 || messageLength > this.calculateCapacity(imageData) * 8) {
        return {
          success: false,
          error: 'No hidden message found or image is corrupted'
        };
      }

      // Extract message
      let binaryMessage = '';
      bitCount = 0;

      while (bitCount < messageLength && i < data.length) {
        if ((i + 1) % 4 === 0) {
          i++;
          continue;
        }
        const bits = (data[i] & ((1 << this.BITS_PER_CHANNEL) - 1)).toString(2).padStart(this.BITS_PER_CHANNEL, '0');
        binaryMessage += bits;
        bitCount += this.BITS_PER_CHANNEL;
        i++;
      }

      // Convert binary to string
      const extractedData = this.binaryToString(binaryMessage.substring(0, messageLength));

      // Parse metadata
      const metadata = JSON.parse(extractedData);
      let message = metadata.content;

      // Decrypt if encrypted
      if (metadata.encrypted) {
        if (!password) {
          return {
            success: false,
            error: 'This message is password protected. Please provide a password.'
          };
        }
        try {
          const decrypted = CryptoJS.AES.decrypt(message, password);
          message = decrypted.toString(CryptoJS.enc.Utf8);
          if (!message) {
            return {
              success: false,
              error: 'Incorrect password'
            };
          }
        } catch {
          return {
            success: false,
            error: 'Incorrect password'
          };
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
   * Convert string to binary representation
   */
  private stringToBinary(str: string): string {
    let binary = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      binary += charCode.toString(2).padStart(16, '0'); // Use 16 bits for Unicode support
    }
    return binary;
  }

  /**
   * Convert binary to string
   */
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

  /**
   * Convert number to binary with fixed length
   */
  private numberToBinary(num: number, bits: number): string {
    return num.toString(2).padStart(bits, '0');
  }
}

export const imageSteganography = new ImageSteganography();
