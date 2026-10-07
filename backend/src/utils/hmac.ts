import crypto from "crypto";

/**
 * Verify Paystack HMAC SHA512 signature using secret key
 */
export function verifyPaystackSignature(rawBody: string, signatureHeader: string | undefined, secretKey: string): boolean {
  if (!signatureHeader) return false;
  try {
    const hash = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
    return hash === signatureHeader;
  } catch (e) {
    return false;
  }
}
