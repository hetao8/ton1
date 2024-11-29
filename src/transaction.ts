import { KeyPair, keyPairFromSecretKey } from '@ton/crypto';
import {
  Address,
  internal,
  TonClient,
  WalletContractV4,
} from '@ton/ton';
import { getSeqno, waitSeqno } from './utils';

export class TonTransaction {
  constructor() {}
  static async transferTons(
    client: TonClient,
    keyPair: KeyPair,
    to: string,
    amount: number,
    message = '',
  ) {
    try {
      const wallet = WalletContractV4.create({
        workchain: 0,
        publicKey: keyPair.publicKey,
      });

      const contract = client.open(wallet);

      const seqno = await getSeqno(contract);

      // 创建交易
      const transfer = contract.createTransfer({
        seqno,
        messages: [
          internal({
            to: to,
            value: amount.toString(),
            body: message,
            bounce: false,
          }),
        ],
        secretKey: keyPair.secretKey,
      });

      console.log('Created transfer object:', transfer);

      // 发送交易
      await contract.send(transfer);

      // 等待交易上链
      const res = await waitSeqno(seqno, contract);
      if (!res) {
        console.error('Transaction failed OR timeout');
        return;
      }

      // 获取交易哈希
      const transactionHash = transfer.hash;
      console.log('Transaction hash:', transactionHash);

      return transactionHash;
    } catch (e) {
      console.error('Error in transferTons:', e);
      throw e;
    }
  }

  /**
   * 获取ton余额
   */
  static async getBalance(client: TonClient, publicKey: string) {
    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: Buffer.from(publicKey, 'hex'),
    });

    const contract = client.open(wallet);

    const balance = await contract.getBalance();
    return balance;
  }

  /**
   * 通过地址获取ton余额
   *
   */
  static async getBalanceByAddress(client: TonClient, address: string) {
    const balance = await client.getBalance(Address.parse(address));
    return balance;
  }

}
