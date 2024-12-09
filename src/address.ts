import {
  KeyPair,
  mnemonicToWalletKey,
  mnemonicNew,
  mnemonicValidate,
  keyPairFromSeed,
  keyPairFromSecretKey,
} from '@ton/crypto';
import { WalletContractV4, WalletContractV5R1 } from '@ton/ton';
import { ed25519_getDerivedPrivateKey } from './hd-utils/ed25519';

export class TonAccountRestore {
  /**
   * 从助记词恢复钱包密钥对
   * @param mnemonic 助记词数组
   * @returns 密钥对
   */
  static async restoreFromMnemonics(mnemonic: string[]): Promise<KeyPair> {
    try {
      // 验证助记词
      const isValid = await mnemonicValidate(mnemonic);
      if (!isValid) {
        throw new Error('Invalid mnemonic');
      }
      return await mnemonicToWalletKey(mnemonic);
    } catch (error) {
      throw new Error(`助记词转换失败: ${error}`);
    }
  }

  static async restoreFromMnemonic(mnemonicString: string): Promise<KeyPair> {
    try {
        const mnemonic = mnemonicString.trim().split(/\s+/).filter(word => word.length > 0);
        
        const isValid = await mnemonicValidate(mnemonic);
        if (!isValid) {
            throw new Error('Invalid mnemonic');
        }
        
        return await mnemonicToWalletKey(mnemonic);
    } catch (error) {
        throw new Error(`助记词转换失败: ${error}`);
    }
}

  /**
   * 从私钥生成密钥对
   * @param secretKey 私钥 Buffer
   * @returns 密钥对
   */
  static async restoreFromSecretKey(secretKey: Buffer): Promise<KeyPair> {
    try {
      const keyPair = await mnemonicToWalletKey([secretKey.toString('hex')]);
      return keyPair;
    } catch (error) {
      throw new Error(`私钥处理失败: ${error}`);
    }
  }

  /**
   * 通过私钥生成密钥对
   * @param privateKey
   * @returns
   */
  static async restoreFromPrivateKey(privateKey: string): Promise<KeyPair> {
    try {
      const privateKeyBuffer = Buffer.from(privateKey, 'hex');
      const keyPair = keyPairFromSeed(privateKeyBuffer);
      const secretKeyHex = privateKey + keyPair.publicKey.toString('hex');
      const secretKeyBuffer = Buffer.from(secretKeyHex, 'hex');
      return keyPairFromSecretKey(secretKeyBuffer);
    } catch (error) {
      throw new Error(`私钥处理失败: ${error}`);
    }
  }

  /**
   * 生成新的助记词
   * @param wordCount 助记词数量，默认为24个词
   * @returns 助记词数组
   */
  static async generateNewMnemonic(wordCount: number = 24): Promise<string[]> {
    try {
      return await mnemonicNew(wordCount);
    } catch (error) {
      throw new Error(`助记词生成失败: ${error}`);
    }
  }

  /**
   * 从密钥对获取钱包合约地址
   * @param keyPair 密钥对
   * @param workchain 工作链 ID (默认为 0)
   * @returns 钱包地址
   */
  static async getWalletAddress(keyPair: KeyPair, workchain: number = 0): Promise<string> {
    try {
      // 创建 V4 钱包合约实例
      const wallet0 = WalletContractV4.create({
        publicKey: keyPair.publicKey,
        workchain,
      });
      // 创建 v5 R1 钱包合约
      const wallet1 = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
        workchain,
      });

      console.log(
        'address v4: ',
        wallet0.address.toString({
          testOnly: false,
          bounceable: false,
          urlSafe: true,
        }),
      );
      console.log(
        'address v5r1: ',
        wallet1.address.toString({
          testOnly: false,
          bounceable: false,
          urlSafe: true,
        }),
      );

      // 默认返回 V4 钱包地址
      return wallet0.address.toString({
        testOnly: false,
        bounceable: false,
        urlSafe: true,
      });
    } catch (error) {
      throw new Error(`地址生成失败: ${error}`);
    }
  }

  static getDerivedPath(index: number) {
    return `m/44'/607'/${index}'`;
  }

  static async getDerivedPrivateKey(mnemonic: string, hdIndex: number): Promise<string> {
    return ed25519_getDerivedPrivateKey(mnemonic, this.getDerivedPath(hdIndex));
  }
  
}
