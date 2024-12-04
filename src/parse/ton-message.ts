import { Transaction } from "@ton/core";
import { Cell, beginCell, Address, Slice } from "@ton/core";

interface JettonTransferNotification {
    queryId: bigint;
    amount: bigint;
    from: Address;
    forwardPayload: Slice;  
}

function parseJettonTransferNotification(cell: Cell): JettonTransferNotification {
    const slice = cell.beginParse();
    
    slice.loadUint(32);
    const queryId = slice.loadUintBig(64);
    
    const amount = slice.loadCoins();
    
    const from = slice.loadAddress();
    
    const forwardPayload = slice;
    
    return {
        queryId,
        amount,
        from,
        forwardPayload
    };
}

// Example usage:
export async function handleJettonTransfer(transaction: Transaction) {
    if (transaction.inMessage?.body) {
        try {
            const notification = parseJettonTransferNotification(transaction.inMessage.body);
            return notification;
        } catch (error) {
            console.error('Not a valid Jetton transfer notification');
        }
    }
}