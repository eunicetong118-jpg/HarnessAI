import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * Output format: iv:tag:encryptedData (all hex)
 */
export function encrypt(text: string): string {
  const keyStr = process.env.ENCRYPTION_KEY;
  if (!keyStr || keyStr.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 32-byte (64-char) hex string');
  }

  const key = Buffer.from(keyStr, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a string formatted as iv:tag:encryptedData.
 */
export function decrypt(encryptedText: string): string {
  const keyStr = process.env.ENCRYPTION_KEY;
  if (!keyStr || keyStr.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 32-byte (64-char) hex string');
  }

  const [ivHex, tagHex, dataHex] = encryptedText.split(':');
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error('Invalid encrypted text format');
  }

  const key = Buffer.from(keyStr, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const encrypted = Buffer.from(dataHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = decipher.update(encrypted) + decipher.final('utf8');
  return decrypted;
}
