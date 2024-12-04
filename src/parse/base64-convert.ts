export function base64ToHex(base64Str: string): string {
    const buffer = Buffer.from(base64Str, 'base64');
    return buffer.toString('hex');
}

export function hexToBase64(hexStr: string): string {
    const buffer = Buffer.from(hexStr, 'hex');
    return buffer.toString('base64');
}
