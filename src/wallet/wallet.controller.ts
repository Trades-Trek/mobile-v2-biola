import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpStatus} from '@nestjs/common';
import {WalletService} from './wallet.service';
import {FundTrekCoinsDto} from './dto/wallet.dto';
import {successResponse} from "../utils/response";
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {BankTransferDto} from "./dto/bank-transfer.dto";
import {SubscribedGuard} from "../guards/subscribed.guard";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {FeatureGuard} from "../guards/feature.guard";
import {hasFeatures} from "../decorators/features.decorator";
import {FEATURES} from "../enums/features";
import {ConfigService} from "@nestjs/config";
import {AppSettingsService} from "../app-settings/app-settings.service";

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService, private configService: ConfigService, private appSettingsService: AppSettingsService) {
    }

    @Get('trek-coins/convert')
    async convertToTrekCoins(@Query('amount') amount: number) {
        const {TREK_COINS_CONVERSION_RATE_IN_NAIRA} = await this.appSettingsService.getSettings()
        return successResponse({
            trek_coins: await this.walletService.convertToTrekCoins(amount),
            conversion_rate: TREK_COINS_CONVERSION_RATE_IN_NAIRA
        })
    }

    @Get('trek-coins/convert/cash')
    async convertTrekCoinsToCash(@Query('trek_coins') trekCoins: number) {
        const {TREK_COINS_CONVERSION_RATE_IN_NAIRA} = await this.appSettingsService.getSettings()

        return successResponse({
            cash: await this.walletService.convertTrekCoinsToCash(trekCoins),
            conversion_rate: TREK_COINS_CONVERSION_RATE_IN_NAIRA
        })
    }

    @ApiOperation({summary: "Convert cash to trek coins"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    // @hasFeatures(FEATURES.USER_CAN_CONVERT_WALLET_FUNDS_TO_TREK_COINS)
    // @UseGuards(SubscribedGuard, FeatureGuard)
    @Post('trek-coins/convert')
    fundTrekCoinsViaWallet(@AuthUser() user: UserDocument, @Body() fundTrekCoinsDto: FundTrekCoinsDto) {
        return this.walletService.fundTrekCoinsViaWallet(user, fundTrekCoinsDto)
    }

    @ApiOperation({summary: "Convert trek coins to cash"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @hasFeatures(FEATURES.USER_CAN_CONVERT_WALLET_FUNDS_TO_TREK_COINS)
    @UseGuards(SubscribedGuard, FeatureGuard)
    @Post('trek-coins/convert/cash')
    withdrawTrekCoins(@AuthUser() user: UserDocument, @Body() fundTrekCoinsViaWalletDto: FundTrekCoinsDto) {
        return this.walletService.withdrawTrekCoins(user, fundTrekCoinsViaWalletDto)
    }

    @ApiOperation({summary: "Transfer cash from wallet to bank account"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('/bank/transfer')
    bankTransfer(@AuthUser() user: UserDocument, @Body() bankTransferDto: BankTransferDto) {
        return this.walletService.transferToBankAccount(user, bankTransferDto)
    }
}
