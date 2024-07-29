import {Injectable} from '@nestjs/common';
import {CreatePromoCodeDto} from './dto/create-promo-code.dto';
import {UpdatePromoCodeDto} from './dto/update-promo-code.dto';
import {InjectModel} from "@nestjs/mongoose";
import {PROMO_CODE_DOCUMENT, PromoCode} from "./schemas/promo-code.schema";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../utils/response";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {PromoCodeUsage} from "./schemas/promo-code-usage.schema";
import {ERROR_MESSAGES} from "../enums/error-messages";

@Injectable()
export class PromoCodesService {
    constructor(@InjectModel(PromoCode.name) private promoCodeModel: Model<PromoCode>, @InjectModel(PromoCodeUsage.name) private promoCodeUsageModel: Model<PromoCodeUsage>) {
    }

    async create(createPromoCodeDto: CreatePromoCodeDto) {
        const promoCode = await this.promoCodeModel.create(createPromoCodeDto)
        return successResponse({promo_code: promoCode, message: SUCCESS_MESSAGES.PROMO_CREATED})
    }

    async verifyPromoCode(code: string) {
        const today = Date.now();
        const promoCode = await this.findOne(code);
        if (!promoCode) returnErrorResponse(ERROR_MESSAGES.PROMO_INVALID);
        // format the promo code dates
        const promoCodeStartDate = Date.parse(promoCode.start_date);
        const promoCodeExpiry = Date.parse(promoCode.expire_at);

        if (promoCodeStartDate > today) returnErrorResponse(ERROR_MESSAGES.PROMO_NOT_STARTED);
        if (promoCodeExpiry <= today) returnErrorResponse(ERROR_MESSAGES.PROMO_EXPIRED);
        return promoCode;
    }

    async recordPromoCodeUsage(userId: Types.ObjectId, promoCodeId: Types.ObjectId) {
        await this.promoCodeUsageModel.create({user_id: userId, promo_code_id: promoCodeId})
        await this.incrementPromoCodeUsage(promoCodeId)
        return true;
    }

    async incrementPromoCodeUsage(promoCodeId: Types.ObjectId): Promise<void> {
        await this.promoCodeModel.findOneAndUpdate({'_id': promoCodeId}, {$inc: {promo_code_usage_count: +1}})
    }

    async findAll() {
        const promoCodes = await this.promoCodeModel.find();
        return successResponse({promo_codes: promoCodes})
    }

    async findOne(code: string) {
        return this.promoCodeModel.findOne({code});
    }

    async update(id: Types.ObjectId, updatePromoCodeDto: UpdatePromoCodeDto) {
        const promoCode = await this.promoCodeModel.findOneAndUpdate({'_id': id}, updatePromoCodeDto, {new: true})
        return successResponse({promo_code: promoCode, message: SUCCESS_MESSAGES.PROMO_UPDATED})
    }

    async remove(id: Types.ObjectId) {
        await this.promoCodeModel.findByIdAndDelete(id)
        return successResponse(SUCCESS_MESSAGES.PROMO_DELETED)
    }
}
