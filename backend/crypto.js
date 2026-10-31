const crypto = require('crypto');
require('dotenv').config();

const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey() {
    const value = process.env.ENCRYPTION_KEY;
    if (!value) {
        throw new Error('ENCRYPTION_KEY is required');
    }

    if (/^[0-9a-f]{64}$/i.test(value)) {
        return Buffer.from(value, 'hex');
    }

    const key = Buffer.from(value, 'utf8');
    if (key.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be 32 characters or 64 hexadecimal characters');
    }
    return key;
}

function encrypt(text) {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `gcm:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text) {
    if (!text || !text.includes(':')) return text;

    const parts = text.split(':');
    const key = getEncryptionKey();

    if (parts[0] === 'gcm') {
        if (parts.length !== 4) {
            throw new Error('Invalid encrypted value');
        }
        const iv = Buffer.from(parts[1], 'hex');
        const authTag = Buffer.from(parts[2], 'hex');
        const encrypted = Buffer.from(parts[3], 'hex');
        if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
            throw new Error('Invalid encrypted value');
        }
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
    }

    // Read legacy AES-CBC records so existing vaults remain accessible.
    if (parts.length !== 2) {
        throw new Error('Invalid encrypted value');
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = Buffer.from(parts[1], 'hex');
    if (iv.length !== 16) {
        throw new Error('Invalid encrypted value');
    }
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

function validateEncryptionKey() {
    getEncryptionKey();
}

module.exports = { encrypt, decrypt, validateEncryptionKey };