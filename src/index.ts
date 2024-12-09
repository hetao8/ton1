import {
  Address,
  WalletContractV4,
} from '@ton/ton';
import { TonAccountRestore } from './address';

import { TonClient } from '@ton/ton';
import { hexToBase64 } from './parse/base64-convert';
import { parseMessageBody } from './parse/parseMessageBody';
import { TonToken } from './token';
const endpoint = 'https://toncenter.com/api/v2/jsonRPC';
const apiKey = '802a084382453a012dce0386fae0deee61942f90da8a6bb625d162784874c3d7';
async function main() {
  try {
    // Create Client
    const client = new TonClient({
      endpoint,
      apiKey
      // endpoint: 'http://localhost:80'
      // endpoint: "https://rpc.ankr.com/http/ton_api_v2"
    });
    const mnemonics: string[] = ["reward", "speed", "winner", "perfect", "liquid", "century", "liberty", "vendor", "sun", "quality", "draw", "silver"]
    const mnemonic = "reward speed winner perfect liquid century liberty vendor sun quality draw silver";
    
    // const masterChain = await client.getMasterchainInfo()
    // console.log(masterChain)
    // const res = await client.getWorkchainShards(masterChain.latestSeqno)
    // console.log(res)
    // let txs: any[] = []
    // for (let i = 0; i < res.length; i++) {
    //   const shard = res[i];
    //   const transactions = await client.getShardTransactions(shard.workchain, shard.seqno, shard.shard)
    //   // console.log(transactions)
    //   txs = txs.concat(transactions)
    // }
    // for (let i = 0; i < txs.length; i++) {
    //   const tx = txs[i];
    //   const res = await client.getTransaction(tx.account, tx.lt, tx.hash)
    //   console.log(res)
    // }

    // res.forEach(async(item) => {
    //   await client.(item.workchain, item.seqno, item.shard, endpoint, apiKey)
    // })

    // const res = await client.getTransaction(Address.parse("EQCaue9JJr_TL1jsD5frETaC3_ew1-ducUr5Rv8JOCBfKiqQ"), "51588012000001", hexToBase64("84ddec95b3b108f3d7ad1afda8283e6ceefec3c81b3cbb01eac41b548eaf603f"))
    // console.log("res: ",res?.inMessage!.body!.toString())
    // console.log("1 :",parseMessageBody(res?.inMessage!.body!))
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

    const  privateKey = ""
    const keyPair = await TonAccountRestore.restoreFromPrivateKey(privateKey);
    const USDT_ADDRESS = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"
    const from = await TonAccountRestore.getWalletAddress(keyPair);
    const to = ""
    const amount = BigInt(100000)
    const text = "test1"
    await TonToken.transferJetton(client, USDT_ADDRESS, from, to, amount, keyPair, text)
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}


main()
