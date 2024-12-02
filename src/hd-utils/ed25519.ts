import { mnemonicToSeed } from './bip39';
import { hmacSHA512 } from './sha512';

interface KeyPair {
  key: Buffer;
  chainCode: Buffer;
}

const HARDENED_OFFSET = 0x80000000;
const pathRegex = new RegExp("^m(\\/[0-9]+')+$");

const replaceDerive = (val: string): string => val.replace("'", '');

const isValidPath = (path: string): boolean => {
  if (!pathRegex.test(path)) {
    return false;
  }
  return !path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    .map((val) => Number(val))
    .some((num) => Number.isNaN(num));
};

function getMasterKeyFromSeed(seed: Buffer): KeyPair {
  const I = hmacSHA512('ed25519 seed', seed);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR,
  };
}

function CKDPriv(parentKeys: KeyPair, index: number): KeyPair {
  const indexBuffer = Buffer.allocUnsafe(4);
  indexBuffer.writeUInt32BE(index, 0);
  const data = Buffer.concat([Buffer.alloc(1, 0), parentKeys.key, indexBuffer]);
  const I = hmacSHA512(parentKeys.chainCode, data);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    key: IL,
    chainCode: IR,
  };
}

function derivePath(path: string, seed: Buffer, offset: number = HARDENED_OFFSET): KeyPair {
  if (!isValidPath(path)) {
    throw new Error('Invalid derivation path');
  }

  const { key, chainCode } = getMasterKeyFromSeed(seed);
  const segments = path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    .map((el) => parseInt(el, 10));

  return segments.reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + offset), {
    key,
    chainCode,
  });
}

export async function ed25519_getDerivedPrivateKey(
  mnemonic: string,
  hdPath: string,
): Promise<string> {
  const seed = await mnemonicToSeed(mnemonic);
  const derivedSeed = derivePath(hdPath, seed).key;
  const privateKey = derivedSeed;

  return Promise.resolve(privateKey.toString('hex'));
}
