import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {ReferralDto, ReferralQueryDto} from './dto/referral.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Referral, ReferralDocument} from "./schemas/referral.schema";
import {Model} from "mongoose";
import {UserDocument} from "../users/schemas/user.schema";
import {QueueService} from "../queues/queue.service";
import {returnErrorResponse, successResponse} from "../utils/response";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {ConfigService} from "@nestjs/config";
import {WalletService} from "../wallet/wallet.service";
import {NotificationsService} from "../notifications/notifications.service";
import useDayJs from '../services/dayjs'
import {ERROR_MESSAGES} from "../enums/error-messages";
import {ACTIVITY_ENTITY} from "../enums/activities.enum";
import {Pagination} from "../enums/pagination.enum";
import {AppSetting} from "../app-settings/schemas/app-setting.schema";
import {AppSettingsService} from "../app-settings/app-settings.service";

@Injectable()
export class ReferralsService {
    constructor(@InjectModel(Referral.name) private referralModel: Model<Referral>, private queueService: QueueService, private configService: ConfigService, @Inject(forwardRef(() => WalletService)) private walletService: WalletService, private notificationService: NotificationsService, private appSettingsService:AppSettingsService) {
    }

    async findOrCreate(email: string, referrer: UserDocument, entity?: ACTIVITY_ENTITY) {
        return await this.referralModel.findOne({email}) ?? await this.referralModel.create({
            email,
            referrer,
            referrer_id: referrer.id,
        })

    }

    async referAFriend(referrer: UserDocument, referralDto: ReferralDto) {
        const referral = await this.findOrCreate(referralDto.email, referrer)
        if (referral.joined) returnErrorResponse(ERROR_MESSAGES.ALREADY_REFERRED)
        // send invite via mail
        await this.queueService.sendEmail({
            to: referral.email,
            subject: 'Referral Invite',
            context: {
                code: referrer.referral_code,
                referrer_full_name: referrer.full_name,
                referred_email: referralDto.email
            },
            template: '/ReferralInvite'
        })
        return successResponse(SUCCESS_MESSAGES.REFER_A_FRIEND_SUCCESS)
    }

    async findAll(user: UserDocument) {
        const totalPending = await this.referralModel.countDocuments({referrer_id: user.id, joined: false})
        const totalCompleted = await this.referralModel.countDocuments({referrer_id: user.id, joined: true})
        const totalEarning = await this.referralModel.aggregate([
            {
                $match: {
                    'referrer_id': user.id,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount_earned"
                    }
                }
            }
        ])
        const referrals = await this.referralModel.find({referrer_id: user.id})
        return successResponse({
            total_pending: totalPending,
            total_completed: totalCompleted,
            total_earning: totalEarning[0].total,
            referrals
        })

    }

    async joined(referrer: UserDocument, referral: ReferralDocument): Promise<void> {
        await referral.updateOne({joined: true, joined_date: useDayJs.getDate()}, {new: true})
        // inform referrer via push
    }

    async reward(referrer: UserDocument, referral: ReferralDocument): Promise<void> {
        const {REFERRAL_REWARD} = await this.appSettingsService.getSettings();
        await referral.updateOne({amount_earned: REFERRAL_REWARD}, {new: true})
        // credit referrer's trek coins with amount earned
        await this.walletService.creditUserTrekCoins(referrer, REFERRAL_REWARD)
        // notify user
        await this.notificationService.create({
            title: SUCCESS_MESSAGES.REFERRAL_REWARD_TITLE,
            description: SUCCESS_MESSAGES.REFERRAL_REWARD_DESCRIPTION,
            user_id: referrer.id
        })

    }

    // admin resource
    async getAllReferrals(referralQueryDto: ReferralQueryDto, pagination: Pagination) {
        let filter = {};
        if (referralQueryDto.joined) {
            filter['joined'] = true;
        }
        const count = await this.referralModel.countDocuments(filter);
        const referrals = await this.referralModel.find(filter).populate('referrer', 'full_name _id').sort({created_at: -1}).skip(pagination.page).limit(pagination.limit)
        return successResponse({referrals, total_rows: count})
    }


}
