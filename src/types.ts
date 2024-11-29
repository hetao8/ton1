import { Address, Cell, Dictionary, OpenedContract, WalletContractV4, WalletContractV5R1 } from "@ton/ton";

export type KeyPair = {
    publicKey: Buffer;
    secretKey: Buffer;
}

export type WalletConfig = {
    workchain: number;
    publicKey: Buffer;
}

export type Wallet = WalletContractV5R1 | WalletContractV4

export type OpenedWallet = OpenedContract<Wallet>;

// 基础类型定义
type AccountStatus = 'uninit' | 'active' | 'frozen';

type CurrencyCollection = {
    coins: bigint;
    extraCurrencies?: Dictionary<number, bigint>;
};

type HashUpdate = {
    oldHash: bigint;
    newHash: bigint;
};

type MessageInfo = {
    type: string;
    value?: CurrencyCollection;
    dest?: Address;
    src?: Address;
    bounced?: boolean;
    bounce?: boolean;
    body?: Cell;
};

type Message = {
    info: MessageInfo;
    body: Cell;
};

type TransactionDescription = {
    type: string;
    creditFirst: boolean;
    storagePhase?: {
        storageFeesCollected: bigint;
        storageFeesDue?: bigint;
    };
    creditPhase?: {
        dueFeesCollected?: bigint;
        credit: bigint;
    };
    computePhase: {
        success: boolean;
        gasUsed: bigint;
        gasLimit: bigint;
        gasFees: bigint;
        exitCode?: number;
    };
    actionPhase?: {
        success: boolean;
        totalActions: number;
        totalFees: bigint;
        resultCode: number;
    };
    bouncePhase?: {
        bounce: boolean;
        resultCode: number;
    };
};

// 处理后的类型定义
export interface ProcessedMessage {
    type: string;
    value: string | undefined;
    destination: string | undefined;
    source: string | undefined;
    bounced: boolean | undefined;
    bounce: boolean | undefined;
    bodyHash: string | undefined;
}

export interface ProcessedComputePhase {
    success: boolean;
    gasUsed: string;
    gasLimit: string;
    gasFees: string;
    exitCode?: number;
}

export interface ProcessedActionPhase {
    success: boolean;
    totalActions: number;
    totalFees: string;
    resultCode: number;
}

export interface ProcessedStoragePhase {
    storageFeesCollected: string;
    storageFeesDue?: string;
}

export interface ProcessedCreditPhase {
    dueFeesCollected?: string;
    credit: string;
}

export interface ProcessedBouncePhase {
    bounce: boolean;
    resultCode: number;
}

export interface ProcessedTransaction {
    hash: string;
    address: string;
    lt: string;
    timestamp: number;
    prevTransactionHash: string;
    prevTransactionLt: string;
    totalFees: string;
    statusChange: {
        old: AccountStatus;
        new: AccountStatus;
    };
    messages: {
        inMessage?: ProcessedMessage;
        outMessages: ProcessedMessage[];
    };
    description: {
        type: string;
        creditFirst: boolean;
        computePhase: ProcessedComputePhase;
        actionPhase?: ProcessedActionPhase;
        storagePhase?: ProcessedStoragePhase;
        creditPhase?: ProcessedCreditPhase;
        bouncePhase?: ProcessedBouncePhase;
    };
    stateUpdate: {
        oldHash: string;
        newHash: string;
    };
}

