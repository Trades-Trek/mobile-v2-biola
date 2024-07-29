import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus} from '@nestjs/common';
import {PromoCodesService} from './promo-codes.service';
import {CreatePromoCodeDto, VerifyPromoCodeDto} from './dto/create-promo-code.dto';
import {UpdatePromoCodeDto} from './dto/update-promo-code.dto';
import {successResponse} from "../utils/response";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Promo Codes')
@Controller('promo-codes')
export class PromoCodesController {
    constructor(private readonly promoCodesService: PromoCodesService) {
    }

    @Post()
    create(@Body() createPromoCodeDto: CreatePromoCodeDto) {
        return this.promoCodesService.create(createPromoCodeDto);
    }

    @ApiOperation({summary: "Verify Promo Code", description: "Used for verifying promotion code"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns the promo code discount"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "expired/invalid promo code or validation errors"
    })
    @Post('/verify/:code')
    async verify(@Param() verifyPromoCodeDto: VerifyPromoCodeDto) {
        const promoCode = await this.promoCodesService.verifyPromoCode(verifyPromoCodeDto.code);
        return successResponse({promo_code_discount: promoCode.discount, message: 'success'})
    }

    @ApiOperation({summary: "Retrieve All Promo codes", description: "Used for retrieving all promotion codes"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns an array of promotion codes"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid/Bad Request or validation errors"
    })
    @Get()
    findAll() {
        return this.promoCodesService.findAll();
    }


}
