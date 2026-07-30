import QRCode from "qrcode";
import crypto from "crypto";

export interface MfaSetupData {
  secret: string;
  otpauthUrl: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

/**
 * Base32 Encoding / Decoding for RFC 6238 TOTP
 */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(input: string): Buffer {
  const cleanInput = input.toUpperCase().replace(/=+$/, "").replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleanInput.length; i++) {
    const val = ALPHABET.indexOf(cleanInput[i]);
    if (val === -1) continue;

    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generate HMAC-SHA1 TOTP token for given secret & timestamp counter
 */
export function generateTotp(secretBase32: string, timeStep = 30): string {
  const key = base32Decode(secretBase32);
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / timeStep);

  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter), 0);

  const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = (binary % 1000000).toString().padStart(6, "0");
  return otp;
}

export async function generateMfaSecret(email: string): Promise<MfaSetupData> {
  const randomBytes = crypto.randomBytes(20);
  const secret = base32Encode(randomBytes);
  const serviceName = "Job Application Tracker";
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(serviceName)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(serviceName)}`;
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

  const backupCodes = Array.from({ length: 8 }, () =>
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );

  return {
    secret,
    otpauthUrl,
    qrCodeUrl,
    backupCodes,
  };
}

export function verifyMfaToken(token: string, secretBase32: string): boolean {
  if (!token || !secretBase32 || token.trim().length !== 6) return false;
  const cleanToken = token.trim();

  // Allow current window, -1 window, +1 window (30-sec tolerance)
  const currentEpoch = Math.floor(Date.now() / 1000);
  const timeStep = 30;

  for (let offset = -1; offset <= 1; offset++) {
    const key = base32Decode(secretBase32);
    const counter = Math.floor(currentEpoch / timeStep) + offset;

    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter), 0);

    const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
    const dynamicOffset = hmac[hmac.length - 1] & 0xf;
    const binary =
      ((hmac[dynamicOffset] & 0x7f) << 24) |
      ((hmac[dynamicOffset + 1] & 0xff) << 16) |
      ((hmac[dynamicOffset + 2] & 0xff) << 8) |
      (hmac[dynamicOffset + 3] & 0xff);

    const expectedOtp = (binary % 1000000).toString().padStart(6, "0");
    if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expectedOtp))) {
      return true;
    }
  }

  return false;
}
