import { randomBytes } from 'crypto';
import { OpenedWallet } from './types';

export async function getSeqno(wallet: OpenedWallet): Promise<number> {
  return await wallet.getSeqno();
}

export async function waitSeqno(seqno: number, wallet: OpenedWallet) {
  for (let attempt = 0; attempt < 10; attempt++) {
    await sleep(1000);
    const seqnoAfter = await wallet.getSeqno();
    if (seqnoAfter == seqno + 1) {
      return true;
    }
  }
  return false;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function bigintRandom(bytes: number) {
  let value = BigInt(0);
  for (const randomNumber of randomBytes(bytes)) {
    const randomBigInt = BigInt(randomNumber);
    value = (value << BigInt(8)) + randomBigInt;
  }
  return value;
}

export function generateQueryId() {
  return bigintRandom(8);
}
