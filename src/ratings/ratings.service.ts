import {Injectable} from '@nestjs/common';
import {CreateRatingDto} from './dto/create-rating.dto';
import {UpdateRatingDto} from './dto/update-rating.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Rating} from "./schemas/rating.schema";
import {Model, Types} from "mongoose";
import {successResponse} from "../utils/response";
import {UserDocument} from "../users/schemas/user.schema";
import {ConfigService} from "@nestjs/config";
import {NotificationsService} from "../notifications/notifications.service";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {WalletService} from "../wallet/wallet.service";
import {Pagination} from "../enums/pagination.enum";
import {AppSettingsService} from "../app-settings/app-settings.service";

@Injectable()
export class RatingsService {
    constructor(@InjectModel(Rating.name) private ratingModel: Model<Rating>, private configService: ConfigService, private notificationService: NotificationsService, private walletService: WalletService, private appSettingService: AppSettingsService) {
    }

    async create(user: UserDocument, createRatingDto: CreateRatingDto) {
        createRatingDto['user'] = user.id;
        await this.ratingModel.create(createRatingDto)
        const {REWARD_USERS_RATING, RATING_REWARD} = await this.appSettingService.getSettings()
        if (REWARD_USERS_RATING) await this.reward(user, RATING_REWARD)
        return successResponse('Rating feedback submitted successfully');
    }

    async findAll(user: UserDocument, paginationParameters: Pagination) {
        const ratings = await this.ratingModel.find({user: user.id});
        console.log(paginationParameters)
        const {totalRating, ratingCount} = await this.getUserRating(user.id)
        return successResponse({ratings, total_rating: totalRating, rating_count: ratingCount})
    }

    async getUserRating(userId: Types.ObjectId): Promise<{ totalRating: number, ratingCount: number }> {
        let totalRating = 0;
        const ratingCount = await this.ratingModel.countDocuments({user: userId})
        const ratingSum = await this.ratingModel.aggregate([
            {
                $match: {
                    'user': userId,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$star"
                    }
                }
            },
        ])
        totalRating = ratingSum[0].total ? Math.round(ratingSum[0].total / ratingCount) : 0;
        return {totalRating, ratingCount};
    }

    async reward(user: UserDocument, rewardBonus: number): Promise<void> {
        await this.walletService.creditUserTrekCoins(user, rewardBonus)
        await this.notificationService.create({
            title: SUCCESS_MESSAGES.RATING_REWARD_TITLE,
            description: SUCCESS_MESSAGES.RATING_REWARD_DESCRIPTION,
            user_id: user.id,
            priority: true
        })
    }

    async getAllRatings(pagination: Pagination) {
        const count = await this.ratingModel.countDocuments();
        const ratings = await this.ratingModel.find().populate('user', 'full_name _id').skip(pagination.page).limit(pagination.limit).sort({created_at: -1}).exec();
        return successResponse({rating: ratings, total_rows: count})
    }

}
