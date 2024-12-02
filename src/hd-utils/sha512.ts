import { hmac } from '@noble/hashes/hmac';
import { sha512 } from '@noble/hashes/sha512';

export function hmacSHA512(key: Buffer | string, buffer: Buffer | string): Buffer {
    return Buffer.from(hmac(sha512, key, buffer));
}