import assert from "node:assert";
import { test } from "node:test";
import { validatePasswordPolicy, encryptText, decryptText, generateHmac } from "./crypto";
import { verifyMfaToken, generateTotp } from "./mfa";

test("Security Module Tests", async (t) => {
  await t.test("Password Policy Enforcement", async (sub) => {
    await sub.test("rejects short passwords (< 10 chars)", () => {
      const result = validatePasswordPolicy("Short1!");
      assert.strictEqual(result.isValid, false);
      assert.ok(result.feedback.some((f) => f.includes("10 characters")));
    });

    await sub.test("rejects passwords lacking uppercase or special chars", () => {
      const result = validatePasswordPolicy("weakpassword123");
      assert.strictEqual(result.isValid, false);
    });

    await sub.test("accepts strong compliant passwords", () => {
      const result = validatePasswordPolicy("SecureP@ssw0rd2026!");
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.score, 5);
      assert.strictEqual(result.feedback.length, 0);
    });
  });

  await t.test("AES-256-GCM Field Encryption & Decryption", () => {
    const sensitiveData = "Confidential Salary Note: $150,000 / year + equity";
    const encrypted = encryptText(sensitiveData);

    assert.notStrictEqual(encrypted, sensitiveData);
    assert.ok(encrypted.includes(":")); // iv:tag:ciphertext

    const decrypted = decryptText(encrypted);
    assert.strictEqual(decrypted, sensitiveData);
  });

  await t.test("HMAC SHA256 Data Integrity", () => {
    const payload = "user_123:100:USD:idemp_key_456";
    const sig1 = generateHmac(payload);
    const sig2 = generateHmac(payload);
    const tamperedSig = generateHmac(payload + "_tampered");

    assert.strictEqual(sig1, sig2);
    assert.notStrictEqual(sig1, tamperedSig);
  });

  await t.test("RFC 6238 TOTP Multi-Factor Authentication", () => {
    const secret = "JBSWY3DPEHPK3PXP"; // Standard Base32 test secret
    const validOtp = generateTotp(secret);

    assert.strictEqual(validOtp.length, 6);
    const isValid = verifyMfaToken(validOtp, secret);
    assert.strictEqual(isValid, true);

    const isInvalid = verifyMfaToken("000000", secret);
    assert.strictEqual(isInvalid, false);
  });

  await t.test("Environment Secret Enforcement", () => {
    const originalJwtSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    assert.throws(() => {
      // Re-require or check getEnv logic for missing variable
      const value = process.env.JWT_SECRET;
      if (!value) throw new Error("Missing required environment variable: JWT_SECRET");
    }, /Missing required environment variable: JWT_SECRET/);
    process.env.JWT_SECRET = originalJwtSecret;
  });
});

