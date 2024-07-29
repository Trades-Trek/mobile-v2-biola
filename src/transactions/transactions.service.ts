import {HttpStatus, Injectable, Post, Body, forwardRef, Inject} from '@nestjs/common';
import {CreateTransactionDto, TransactionQueryDto} from './dto/create-transaction.dto';
import {UpdateTransactionDto} from './dto/update-transaction.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Transaction} from "./schemas/transaction.schema";
import {Model} from "mongoose";
import {PAYSTACK_STATUS, PAYSTACK_WEBHOOK_EVENTS} from "../enums/paystack_events";
import {UsersService} from "../users/users.service";
import {USER} from "../users/enums/user.enum";
import {UserDocument} from "../users/schemas/user.schema";
import {InitializeTransactionDto} from "./dto/intialise.dto";
import {successResponse} from "../utils/response";

const logger = require('../utils/logger');
import usePaystackService from "../services/paystack";
import {VerifyTransactionDto} from "./dto/verify.dto";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {WalletService} from "../wallet/wallet.service";
import {ConfigService} from "@nestjs/config";
import {Pagination} from "../enums/pagination.enum";
import {AppSettingsService} from "../app-settings/app-settings.service";

@Injectable()
export class TransactionsService {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>, @Inject(forwardRef(() => UsersService)) private userService: UsersService, private walletService: WalletService, private configService: ConfigService, private appSettingsService: AppSettingsService) {
    }

    async create(createTransactionDto: CreateTransactionDto): Promise<void> {
        const {TREK_COINS_CONVERSION_RATE_IN_NAIRA} = await this.appSettingsService.getSettings()
        createTransactionDto['conversion_rate'] = TREK_COINS_CONVERSION_RATE_IN_NAIRA
        await this.transactionModel.create(createTransactionDto)
    }

    async getUserTransactions(user: UserDocument, pagination: Pagination) {
        const count = await this.transactionModel.countDocuments({user_id: user.id})
        const transactions = await this.transactionModel.find({user_id: user.id}).sort({created_at: -1}).skip(pagination.page).limit(pagination.limit);
        return successResponse({transactions, total_rows: count})
    }

    async paystackWebhookHandler(payload: any) {
        switch (payload.event) {
            case PAYSTACK_WEBHOOK_EVENTS.CHARGE_SUCCESS:
                this.handleDeposit(payload.data)
                break;
            case PAYSTACK_WEBHOOK_EVENTS.TRANSFER_SUCCESS:
                // handle transfer success
                this.handleTransfer(payload.data)
                break;
            case PAYSTACK_WEBHOOK_EVENTS.TRANSFER_FAILED:
                this.handleTransfer(payload.data)
                break;
            // handle failed transfer
            case PAYSTACK_WEBHOOK_EVENTS.TRANSFER_REVERSED:
                // handle reversed transfer
                this.handleTransfer(payload.data)
                break;
            default:
                console.log('hmmhmhhmhmhmhmhmhmhm')
        }
    }


    async handleDeposit(data: any): Promise<void> {
        const userId = data.metadata.user_id;
        const amount_paid = data.metadata.amount_paid;
        const paystackAmount = data.amount;
        // find user and credit his/her wallet
        const user: UserDocument | undefined = await this.userService.findOne({
            field: USER.ID,
            data: userId,
            is_server_request: true
        })
        if (user) this.walletService.creditUserWallet(user, amount_paid)
        logger.info('Credited user successfully')
    }

    async handleTransfer(paystackResponse) {
        const transfer_code = paystackResponse.transfer_code;
        // get transaction
        const transaction = await this.transactionModel.findOne({transfer_code})
        if (transaction) {
            // update transaction status
            await transaction.updateOne({status: paystackResponse.status})
            // check if transfer failed or reversed
            if (paystackResponse.status === PAYSTACK_STATUS.FAILED || paystackResponse.status === PAYSTACK_STATUS.REVERSED) {
                const user = await this.userService.findOne({
                    data: transaction.user_id,
                    field: USER.ID,
                    is_server_request: true
                })
                //  refund user
                this.walletService.creditUserWallet(user, transaction.amount)
            }
        }

    }

    async initializeTransaction(initializeTransactionDto: InitializeTransactionDto) {
        const {email, payment_channels, metadata, amount} = initializeTransactionDto;
        return successResponse(await usePaystackService.initializeTransaction(email, amount, metadata, payment_channels))
    }

    async verifyTransaction(verifyTransactionDto: VerifyTransactionDto) {
        const verified = await usePaystackService.verifyTransaction(verifyTransactionDto.payment_reference)
        const message = verified ? SUCCESS_MESSAGES.VERIFIED_TRANSACTION : ERROR_MESSAGES.UNVERIFIED_TRANSACTION;
        return successResponse({verified, message})
    }

    // admin resource
    async getAllTransactions(query: TransactionQueryDto, pagination: Pagination) {
        let filter = {}
        if (query.entity) {
            filter['entity'] = query.entity
        }
        const count = await this.transactionModel.countDocuments(filter)
        const transactions = await this.transactionModel.find(filter).sort({created_at: -1}).skip(pagination.page).limit(pagination.limit);
        return successResponse({transactions, total_rows: count})
    }

}
