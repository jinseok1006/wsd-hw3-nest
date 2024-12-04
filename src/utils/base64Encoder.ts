export class Base64Encoder {
  // Static method to encode a string to Base64
  static encode(input: string): string {
    return Buffer.from(input, "utf-8").toString("base64");
  }

  // Static method to compare a raw string with a Base64 encoded string
  static compare(rawString: string, base64String: string): boolean {
    
    const encodedRawString = Base64Encoder.encode(rawString);

    return encodedRawString === base64String;
  }
}
