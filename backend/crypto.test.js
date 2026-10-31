const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const test = require('node:test');

process.env.ENCRYPTION_KEY = 'a'.repeat(64);

const { decrypt, encrypt, validateEncryptionKey } = require('./crypto');

test('validates the configured encryption key', () => {
  assert.doesNotThrow(() => validateEncryptionKey());
});

test('encrypts and decrypts values with AES-GCM', () => {
  const encrypted = encrypt('vault secret');

  assert.match(encrypted, /^gcm:/);
  assert.equal(decrypt(encrypted), 'vault secret');
});

test('uses a different IV for each encryption', () => {
  const first = encrypt('same value');
  const second = encrypt('same value');

  assert.notEqual(first, second);
});

test('rejects tampered AES-GCM values', () => {
  const encrypted = encrypt('tamper check');
  const parts = encrypted.split(':');
  const lastCharacter = parts[3].slice(-1);
  parts[3] = `${parts[3].slice(0, -1)}${lastCharacter === '0' ? '1' : '0'}`;

  assert.throws(() => decrypt(parts.join(':')));
});

test('reads legacy AES-CBC values', () => {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([
    cipher.update('legacy secret', 'utf8'),
    cipher.final()
  ]);
  const legacyValue = `${iv.toString('hex')}:${encrypted.toString('hex')}`;

  assert.equal(decrypt(legacyValue), 'legacy secret');
});

test('rejects malformed encrypted values', () => {
  assert.throws(() => decrypt('gcm:bad:value'));
  assert.throws(() => decrypt('gcm:00112233445566778899aabb:zz'.padEnd(67, '0')));
  assert.throws(() => decrypt('00112233445566778899aabb:abc'));
});
