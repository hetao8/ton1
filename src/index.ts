import {
  Address,
  WalletContractV4,
} from '@ton/ton';
import { TonAccountRestore } from './address';

import { TonClient } from '@ton/ton';
import { hexToBase64 } from './parse/base64-convert';
import { parseMessageBody } from './parse/parseMessageBody';

async function main() {
  try {
    // Create Client
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: '802a084382453a012dce0386fae0deee61942f90da8a6bb625d162784874c3d7',
      // endpoint: "https://rpc.ankr.com/http/ton_api_v2"
    });
    const mnemonics: string[] = ["reward", "speed", "winner", "perfect", "liquid", "century", "liberty", "vendor", "sun", "quality", "draw", "silver"]
    const mnemonic = "reward speed winner perfect liquid century liberty vendor sun quality draw silver";

    // const masterChain = await client.getMasterchainInfo()
    // console.log(masterChain)
    // const res = await client.getWorkchainShards(masterChain.latestSeqno)
    // console.log(res)
    // const txs = await client.getShardTransactions(res[0].workchain, res[0].seqno, res[0].shard)
    // console.log(txs[0])

    const res = await client.getTransaction(Address.parse("EQDlzeq0SUI-CleKAAffzHWO89W6d1i2aMDxgOFb6FSEhoN8"), "51361215000001", hexToBase64("94e9042e5d835d6bb20052887f728565cd8f57dabeb46b785fdd5d76498bb0a4"))
    console.log("1 :",parseMessageBody(res?.inMessage!.body!))
    // console.log("2 :",await handleJettonTransfer(res!))


    // console.log(await handleJettonTransfer(res!))
    // const res = await client.getTransactions(Address.parse("UQBFZGGiW_gheObFdKyQRZjkhY0htM2oMiehh0MIrY1Ywoy1"), {
    //   limit: 10
    // })

    // res.forEach((item) => {
    //   console.log("hex: ",item.hash().toString('hex'))
    //   console.log("base64: ",item.hash().toString('base64'))
    //   console.log(item)
    // })

    // let mnemonics = await mnemonicNew();
    // let keyPair = await TonAccountRestore.restoreFromPrivateKey(privateKey);

    // let workchain = 0; // ton所在的工作链
    // let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    // let contract = client.open(wallet);

    // // Get balance
    // let balance: bigint = await contract.getBalance();
    // console.log('Balance:', balance);
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


main()
