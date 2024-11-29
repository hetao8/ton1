import {
  WalletContractV4,
} from '@ton/ton';
import { TonAccountRestore } from './address';

import { TonClient } from '@ton/ton';

async function main() {
  try {
    // Create Client
    const client = new TonClient({
      // endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      // apiKey: '802a084382453a012dce0386fae0deee61942f90da8a6bb625d162784874c3d7',
      endpoint: "https://rpc.ankr.com/http/ton_api_v2"
    });
    const mnemonics: string[] = [];
    const privateKey = '';
    // let mnemonics = await mnemonicNew();
    let keyPair = await TonAccountRestore.restoreFromPrivateKey(privateKey);

    let workchain = 0; // ton所在的工作链
    let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    let contract = client.open(wallet);

    // Get balance
    let balance: bigint = await contract.getBalance();
    console.log('Balance:', balance);
    /*
    // Create a transfer
    let seqno: number = await contract.getSeqno();
    let transfer = contract.createTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          value: '0.01',
          to: 'UQBPO4-Zv8AbkC7NZ0ZTQ1xWofu2e-_sh2eW_Uj0Ctzlzu7b',
        }),
      ],
    });
      */
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}



