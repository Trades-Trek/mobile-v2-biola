import {returnErrorResponse} from "../utils/response";
import {DEFAULT_CURRENCY} from "../utils/constant";
import {ERROR_MESSAGES} from "../enums/error-messages";
const crypto = require("crypto");
const axios = require("axios");

const usePaystackService = () => {
    const createTransferRecipient = async (account_number: string, account_name: string, bank_code: string, currency?: string) => {
        try {
            const options = {
                headers: header()
            };
            const data = {
                type: "nuban",
                account_number,
                name: account_name,
                bank_code,
                currency: currency ? currency : DEFAULT_CURRENCY.code
            };
            const response = await axios.post("https://api.paystack.co/transferrecipient", data, options);
            return response.data.data;
        } catch (e) {
            console.log(e);
            returnErrorResponse(ERROR_MESSAGES.PAYSTACK_BAD_GATE);
        }

    };

    const initiateTransfer = async (amount: number, recipient_code: string, reference?: string) => {
        try {
            const options = {
                headers: header()
            };
            const data = {
                source: "balance",
                reason: "payout",
                amount: amount * 100,
                recipient: recipient_code,
                reference: reference ?? getReference()
            };
            const response = await axios.post("https://api.paystack.co/transfer", data, options);
            const response_data = response.data.data;
            if (response.data.status) return response_data;
        } catch (e) {
            console.log(e.response.data.message);
            returnErrorResponse(e.response.data.message);
        }
    };

    const getReference = () => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    const verifyTransaction = async (reference: string): Promise<boolean> => {
        try {
            const options = {
                headers: header()
            };
            const response = await axios.get("https://api.paystack.co/transaction/verify/" + reference, options);
            console.log("verified");
            return !!response.data.status;
        } catch (e) {
            console.log(e);
            return false;
        }

    };


    const initializeTransaction = async (email: string, amount: number, metadata: any, payment_channels?: Array<string>) => {
        try {
            const options = {
                headers: header()
            };
            const data = {
                email,
                amount: amount * 100,
                metadata,
                channels: payment_channels && payment_channels.length ? payment_channels : ['card', 'bank', 'ussd', 'bank_transfer']
            };
            const response = await axios.post("https://api.paystack.co/transaction/initialize", data, options);
            return response.data.data;
        } catch (e) {
            console.log(e);
            returnErrorResponse("Could not initialize transaction");
        }

    };


    const getNigerianBanks = async () => {
        const options = {
            headers: header()
        };
        const response = await axios.get("https://api.paystack.co/bank", options);
        if (response.status) return response.data.data;
        return [];
    };


    const verifyBankAccount = async (account_number: string, bank_code: string) => {
        try {
            const options = {
                headers: header()
            };
            const response = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`, options);
            return response.data.data;
        } catch (e) {
            console.log(e.response)
            e.response.data == ERROR_MESSAGES.INVALID_BANK_ACCOUNT ? returnErrorResponse(e.response.data) : returnErrorResponse(ERROR_MESSAGES.PAYSTACK_BAD_GATE);
        }
    };


    const header = () => {
        const APIKEY = process.env.NODE_ENV === "production" ? process.env.PAYSTACK_SECRET_KEY : process.env.PAYSTACK_TEST_SECRET_KEY;
        const Bearer = `Bearer ${APIKEY}`;
        return {
            Authorization: Bearer,
            "content-type": "application/json"
        };
    };


    const authenticate = (req_body: any, paystack_signature: any) => {
        const APIKEY = process.env.NODE_ENV === "production" ? process.env.PAYSTACK_SECRET_KEY : process.env.PAYSTACK_TEST_SECRET_KEY;
        const hash = crypto.createHmac("sha512", APIKEY).update(JSON.stringify(req_body)).digest("hex");
        return hash == paystack_signature;
    };

    return {
        verifyTransaction,
        initializeTransaction,
        verifyBankAccount,
        authenticate,
        getNigerianBanks,
        createTransferRecipient,
        initiateTransfer,
        getReference
    };
};

export default usePaystackService();