import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { sha512 } from '@noble/hashes/sha512';

function pbkdf2Promise(
    password: Buffer,
    saltMixin: Buffer,
    iterations: number,
    keylen: number,
    digest: string
): Promise<Buffer> {
    const derivedKey = pbkdf2(sha512, password, saltMixin, {
        c: iterations,
        dkLen: keylen
    });
    return Promise.resolve(Buffer.from(derivedKey));
}

export async function mnemonicToSeed(
    mnemonic: string,
    password?: string
): Promise<Buffer> {
    return Promise.resolve().then(() => {
        const mnemonicBuffer = Buffer.from((mnemonic || '').normalize('NFKD'), 'utf8');
        const saltBuffer = Buffer.from(('mnemonic' + (password || '')).normalize('NFKD'), 'utf8');
        return pbkdf2Promise(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
    });
}