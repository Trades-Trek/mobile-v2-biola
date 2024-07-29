import {Injectable} from '@nestjs/common';
import {CreateBankDto} from './dto/create-bank.dto';
import {UpdateBankDto} from './dto/update-bank.dto';
import {UserDocument} from "../users/schemas/user.schema";
import usePaystackService from '../services/paystack'
import {InjectModel} from "@nestjs/mongoose";
import {Bank, BankDocument} from "./schemas/bank.schema";
import {Model, Types} from "mongoose";
import {successResponse} from "../utils/response";

@Injectable()
export class BanksService {
    constructor(@InjectModel(Bank.name) private bankModel: Model<Bank>) {
    }


    async saveAndRetrieveBankAccount(user: UserDocument, account_number: string, bank_code: string, bank_name:string): Promise<BankDocument> {
        let bankAccount: BankDocument | undefined = await this.bankModel.findOne({user_id: user.id})
        if (bankAccount) {
            // check if it is a new bank account
            if (bankAccount.account_number !== account_number || bankAccount.bank_code !== bank_code) {
                // verify and update new bank account
                const {
                    verifiedBankAccount,
                    paystackRecipient
                } = await this.verifyAndCreatePaystackRecipent(account_number, bank_code)

                const formattedBankInfo = this.formatBankAccountInfo(user.id, verifiedBankAccount, paystackRecipient, bank_code, bank_name)
                bankAccount = await this.update(bankAccount.id, formattedBankInfo)
            }
        } else {
            // verify and create new bank account
            const {
                verifiedBankAccount,
                paystackRecipient
            } = await this.verifyAndCreatePaystackRecipent(account_number, bank_code)
            const formattedBankInfo = this.formatBankAccountInfo(user.id, verifiedBankAccount, paystackRecipient, bank_code, bank_name)
            bankAccount = await this.create(formattedBankInfo)
        }
        return bankAccount

    }

    async verifyAndCreatePaystackRecipent(account_number, bank_code): Promise<{ verifiedBankAccount, paystackRecipient }> {
        const verifiedBankAccount = await usePaystackService.verifyBankAccount(account_number, bank_code);
        const paystackRecipient = await usePaystackService.createTransferRecipient(account_number, verifiedBankAccount.account_name, bank_code);
        return {verifiedBankAccount, paystackRecipient}
    }

    formatBankAccountInfo(userId: Types.ObjectId, verifiedBankAccount, paystackRecipient, bank_code: string, bank_name:string): any {
        return {
            bank_name,
            bank_code,
            recipient_code: paystackRecipient.recipient_code,
            account_name: verifiedBankAccount.account_name,
            auth_code: paystackRecipient.details.authorization_code,
            currency: paystackRecipient.currency,
            email: paystackRecipient.email,
            recipient_id: paystackRecipient.id,
            user_id: userId.id,
            account_number: paystackRecipient.details.account_number,
            bank_id: verifiedBankAccount.bank_id
        }
    }

    async create(createBankDto: CreateBankDto) {
        return await this.bankModel.create(createBankDto)
    }

    async update(bankAccount_id: Types.ObjectId, updateBankDto: UpdateBankDto) {
        return this.bankModel.findOneAndUpdate(bankAccount_id, updateBankDto, {new: true});
    }

    findOne(id: number) {
        return `This action returns a #${id} bank`;
    }


    remove(id: number) {
        return `This action removes a #${id} bank`;
    }
}
