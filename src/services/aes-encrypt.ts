const CryptoJS = require("crypto-js");
const crypto = require("crypto");
export const useEncryptionService = () => {

    const encryptData = (data: any, secretKey: string, iv?: any): string => {
        // console.log(iv)
        // iv = CryptoJS.enc.Base64.parse(iv);
        // console.log(iv.toString())
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    };

    const decryptData = (encryptedData: string, secretKey: string) => {
        const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_IV)
        const key = CryptoJS.enc.Utf8.parse(secretKey)
        return CryptoJS.AES.decrypt(encryptedData, key, {iv: iv}).toString(CryptoJS.enc.Utf8);
    };

    return {encryptData, decryptData}

    const generateSecretKey = (): string => {
        const keyLength = 32; // 32 bytes = 256 bits (AES-256)
        const buffer = new Uint8Array(keyLength);
        crypto.getRandomValues(buffer);
        return Array.from(buffer, (byte) =>
            byte.toString(16).padStart(2, '0')
        ).join('');
    };
}