import { TonWallet } from '@okxweb3/coin-ton';
import { KeyPair } from '@ton/crypto';
import {
  Address,
  JettonWallet,
  JettonMaster,
  TonClient,
  beginCell,
  WalletContractV4,
  internal,
  SendMode,
} from '@ton/ton';
import { generateQueryId, waitSeqno } from './utils';

export class TonToken {
  // 获取代币钱包地址
  static async getJettonWalletAddress(
    client: TonClient,
    userAddress: string,
    jettonMaster: string,
  ): Promise<string> {
    try {
      const userAddressCell = beginCell()
        .storeAddress(Address.parse(userAddress))
        .endCell();

      const response = await client.runMethod(
        Address.parse(jettonMaster),
        'get_wallet_address',
        [{ type: 'slice', cell: userAddressCell }],
      );

      return response.stack.readAddress().toString();

    //   const master = JettonMaster.create(Address.parse(jettonMaster));
    //   const provider = client.provider(Address.parse(jettonMaster));
    //   const walletAddress = await master.getWalletAddress(provider, Address.parse(userAddress));
    //   return walletAddress.toString();
    } catch (error) {
      console.error('Error getting Jetton wallet address:', error);
      throw error;
    }
  }

  // 获取代币余额
  static async getJettonBalance(client: TonClient, jettonWalletAddress: string): Promise<bigint> {
    try {
      const provider = client.provider(Address.parse(jettonWalletAddress));
      const jettonWallet = JettonWallet.create(Address.parse(jettonWalletAddress));

      const balance = await jettonWallet.getBalance(provider);
      return balance;
    } catch (error) {
      console.error('Error getting Jetton balance:', error);
      throw error;
    }
  }

  // 检查代币交易状态
  static async checkTransactionStatus(
    client: TonClient,
    transactionHash: string,
    jettonWalletAddress: string,
  ): Promise<boolean> {
    try {
      const transactions = await client.getTransactions(Address.parse(jettonWalletAddress), {
        limit: 20,
      });

      return transactions.some((tx) => tx.hash.toString() === transactionHash);
    } catch (error) {
      console.error('Error checking transaction status:', error);
      throw error;
    }
  }

  // 获取 Jetton 代币信息（name, symbol, decimals 等）
  static async getJettonInfo(client: TonClient, jettonMaster: string) {
    try {
      const provider = client.provider(Address.parse(jettonMaster));
      const master = JettonMaster.create(Address.parse(jettonMaster));

      // 调用方法获取信息
      const metaData = await master.getJettonData(provider);
      console.log('Jetton info:', metaData);
    } catch (error) {
      console.error('Error getting Jetton info:', error);
      throw error;
    }
  }

  /**
   * 转账代币
   * @param client TonClient 实例
   * @param tokenAddress 代币合约地址
   * @param fromWalletAddress 发送方钱包地址
   * @param toAddress 接收方地址
   * @param amount 代币数量
   * @param userKeyPair 用户密钥对
   */
  static async transferJetton(
    client: TonClient,
    tokenAddress: string,
    fromWalletAddress: string,
    toAddress: string,
    amount: bigint,
    userKeyPair: KeyPair,
  ) {
    try {
      const destAddress = Address.parse(toAddress);

      const wallet = WalletContractV4.create({
        publicKey: userKeyPair.publicKey,
        workchain: 0,
      });
      const contract = client.open(wallet);

      const jettonWallet = await this.getJettonWalletAddress(
        client,
        fromWalletAddress,
        tokenAddress,
      );

      const body = beginCell()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(generateQueryId(), 64)
        .storeCoins(amount)
        .storeAddress(destAddress) // to address
        .storeAddress(wallet.address) // response address
        .storeMaybeRef(undefined)
        .storeCoins(1) 
        .storeBit(false)
        .endCell();
      const seqno: number = await contract.getSeqno();

      const myTransaction = {
        seqno,
        secretKey: userKeyPair.secretKey,
        messages: [
          internal({
            to: jettonWallet,
            value: BigInt(100000000), // 0.1 TON
            bounce: false,
            body: body,
          }),
        ],
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        value: '100000000',
      };

      await contract.sendTransfer(myTransaction);

      await waitSeqno(seqno, contract);
    } catch (error) {
      console.error('Error transferring Jettons:', error);
      throw error;
    }
  }

  static async transferJettonFromOkx(
    client: TonClient,
    tokenAddress: string,
    fromWalletAddress: string,
    toAddress: string,
    amount: bigint,
    userKeyPair: KeyPair,
  ) {
    const wallet = WalletContractV4.create({
      publicKey: userKeyPair.publicKey,
      workchain: 0,
    });
    const contract = client.open(wallet);
    const tonWallet = new TonWallet();
    const seqno: number = await contract.getSeqno();

    const param = {
      privateKey: '',
      data: {
        type: 'jettonTransfer', // type of jetton TOKEN transfer
        // jetton wallet address of from address
        fromJettonAccount: await TonToken.getJettonWalletAddress(
          client,
          fromWalletAddress,
          tokenAddress,
        ),
        to: toAddress, // destination address
        seqno: seqno, // nonce or sequence of from address
        toIsInit: true, // destination address init or not
        memo: 'jetton test', // comment for this tx
        decimal: 9, // decimal of jetton TOKEN on ton blockchain
        amount: '1', // decimal of TOKEN is 2 on ton blockchain, so that here real value is 1
        messageAttachedTons: '50000000', // message fee, default 0.05, here is 0.05 * 10^9
        invokeNotificationFee: '1', // notify fee, official recommend 0.000000001, here is 0.000000001 * 10^9
        // expireAt: timeoutAtSeconds, // timeout at seconds eg, 1718863283n, default now + 60s
        /**
         * export enum SendMode {
         *     CARRY_ALL_REMAINING_BALANCE = 128,
         *     CARRY_ALL_REMAINING_INCOMING_VALUE = 64,
         *     DESTROY_ACCOUNT_IF_ZERO = 32,
         *     PAY_GAS_SEPARATELY = 1,
         *     IGNORE_ERRORS = 2,
         *     NONE = 0
         * }
         */
        sendMode: 1,
        queryId: '18446744073709551615', // string of uint64 number, eg 18446744073709551615 = 2^64 - 1
      },
    };
    const tx = await tonWallet.signTransaction(param);
    await client.sendExternalMessage(contract, tx);
  }
}
