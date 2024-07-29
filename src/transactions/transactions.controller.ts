import {Body, Controller, Get, HttpStatus, Post, Req, Res} from '@nestjs/common';
import {TransactionsService} from "./transactions.service";
import usePaystackService from "../services/paystack";
import {Public} from "../decorators/public-endpoint.decorator";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {InitializeTransactionDto} from "./dto/intialise.dto";
import {VerifyTransactionDto} from "./dto/verify.dto";
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {GetPagination} from "../decorators/pagination.decorator";
import {Pagination} from "../enums/pagination.enum";

const logger = require('../utils/logger');

@Controller()
export class TransactionsController {
    constructor(private transactionService: TransactionsService) {
    }


    @Public()
    @Post("/paystack/webhook")
    webHookHandler(@Res() res, @Req() req) {
        const body = req.body;
        if (usePaystackService.authenticate(body, req.headers["x-paystack-signature"])) {
            console.log("authenticated");
            logger.info(`webhook data ${JSON.stringify(body)}`);
            this.transactionService.paystackWebhookHandler(body);
        } else {
            console.log("not authenticated");
        }
        res.sendStatus(200);
    }

    @Get('transactions')
    getUserTransactions(@AuthUser() user:UserDocument, @GetPagination() pagination:Pagination){
        return this.transactionService.getUserTransactions(user, pagination)
    }

    @ApiOperation({summary: "Initialize transaction/payment"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a success message with an access code"
    })
    @Post("transactions/initialize")
    initialize(@Body() initializeTransactionDto: InitializeTransactionDto) {
        return this.transactionService.initializeTransaction(initializeTransactionDto);
    }

    @ApiOperation({summary: "Verify transaction/payment"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a boolean value and a message"
    })
    @Post("transactions/verify")
    async verify(@Body() verifyTransactionDto: VerifyTransactionDto) {
       return this.transactionService.verifyTransaction(verifyTransactionDto)
    }
}
