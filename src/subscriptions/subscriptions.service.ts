import {Injectable} from '@nestjs/common';
import {UserDocument} from "../users/schemas/user.schema";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../utils/response";
import {PlansService} from "../plans/plans.service";
import {PlanDocument} from "../plans/schemas/plan.schema";
import useDayJs from '../services/dayjs'
import {PLAN_TYPE} from "../enums/plan_type";
import {AuthUser} from "../decorators/user.decorator";
import {UsersService} from "../users/users.service";
import {TransactionsService} from "../transactions/transactions.service";
import {InjectModel} from "@nestjs/mongoose";
import {SubscriptionHistory} from "./schemas/subscription-history.schema";
import {NotificationsService} from "../notifications/notifications.service";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {WalletService} from "../wallet/wallet.service";
import {USER} from "../users/enums/user.enum";

@Injectable()
export class SubscriptionsService {
    constructor(private planService: PlansService, private userService: UsersService, private transactionService: TransactionsService, @InjectModel(SubscriptionHistory.name) private subscriptionsHistoryModel: Model<SubscriptionHistory>, private notificationService: NotificationsService, private walletService: WalletService) {
    }

    async giftPlan(giver: UserDocument, recipientId: Types.ObjectId, planId: Types.ObjectId) {
        // get recipient
        const recipient: UserDocument | undefined = await this.userService.findOne({
            data: recipientId,
            field: USER.ID,
            is_server_request: true
        })
        if (!recipient) returnErrorResponse('Recipient not found')
        // get plan
        const plan = await this.planService.findOne(planId)
        if (!plan) returnErrorResponse('Plan does not exist')
        // ensure recipient is not subscribed to a paid plan
        if (recipient.has_subscribed && !recipient.subscription.has_expired) returnErrorResponse(ERROR_MESSAGES.RECIPIENT_ON_PAID_PLAN)
        // convert plan price to trek coins
        const planAmountInTrekCoins = await this.walletService.convertToTrekCoins(plan.amount)
        // ensure giver has enough trek coins
        if (giver.trek_coin_balance < planAmountInTrekCoins) returnErrorResponse(ERROR_MESSAGES.INSUFFICIENT_TREK_COINS_BALANCE)

        // gift recipient
        await this.createOrRenewSubscription(recipient, plan, false, false, false)
        // debit giver trek coins
        await this.walletService.debitUserTrekCoins(giver, planAmountInTrekCoins)
        // notify recipient
        this.notificationService.create({
            user_id: recipient.id,
            title: `You've been gifted a plan`,
            description: `Hi ${recipient.first_name}, ${giver.full_name} just gifted you a ${plan.name} plan. Please check your profile settings to see more of this plan and its features`,
            priority: true
        })
        return successResponse('successful')
    }

    async subscribe(user: UserDocument, planId: Types.ObjectId) {
        const plan: PlanDocument | undefined = await this.planService.findOne(planId)
        if (!plan) returnErrorResponse('plan does not exist');
        const userSub = user.subscription;
        // check if plan is a gift plan
        if (plan.is_gift_plan) returnErrorResponse('You cannot subscribe to gift plans')
        // check if user has already subscribed to this plan
        if (user.has_subscribed) {
            if (userSub.plan_id === planId) returnErrorResponse(ERROR_MESSAGES.SUBSCRIBED)
            if (userSub.plan_type === PLAN_TYPE.PAID && !userSub.has_expired) returnErrorResponse(ERROR_MESSAGES.PAID_PLAN_ACTIVE)
        }
        // check if user has enough funds in his/her trek coin balance
        const planAmountInTrekCoins = await this.walletService.convertToTrekCoins(plan.amount)
        if (user.trek_coin_balance < planAmountInTrekCoins && plan.type === PLAN_TYPE.PAID) returnErrorResponse(ERROR_MESSAGES.INSUFFICIENT_TREK_COINS_BALANCE)
        // subscribe user to this plan
        await this.createOrRenewSubscription(user, plan)
        // dispatch event
        return successResponse('subscription successful')
    }

    async renew(@AuthUser() user: UserDocument) {
        if (!user.has_subscribed) returnErrorResponse(ERROR_MESSAGES.NO_SUBSCRIPTION)
        const userSub = user.subscription;
        if (!userSub.has_expired) returnErrorResponse(ERROR_MESSAGES.SUBSCRIPTION_EXPIRED)
        const plan: PlanDocument | undefined = await this.planService.findOne(userSub.plan_id)
        const planAmountInTrekCoins = await this.walletService.convertToTrekCoins(plan.amount)
        if (user.trek_coin_balance < planAmountInTrekCoins) returnErrorResponse(ERROR_MESSAGES.INSUFFICIENT_TREK_COINS_BALANCE)
        // renew plan
        await this.createOrRenewSubscription(user, plan, true)
        // dispatch event
        return successResponse('Subscription renewed successfully')
    }


    async createOrRenewSubscription(user: UserDocument, plan: PlanDocument, isRenew: boolean = false, debitTrekCoins: boolean = true, sendNotification: boolean = true): Promise<boolean> {
        const today = useDayJs.getDate();
        const renewalDate = useDayJs.addDays(today, plan.no_of_days)
        const trekCoins = await this.walletService.convertToTrekCoins(plan.amount)
        if (debitTrekCoins) await this.walletService.debitUserTrekCoins(user, trekCoins)
        await user.updateOne({
            has_subscribed: true,
            subscription: {
                plan_id: plan.id,
                has_expired: false,
                renewal_date: renewalDate,
                plan_type: plan.type
            }
        });
        this.createSubscriptionHistory(user.id, plan.id, renewalDate)
        if (sendNotification) {
            const title = isRenew ? 'Subscription Renewed Successfully' : 'Subscription Successful'
            const description = isRenew ? `Your ${plan.name} plan subscription has been renewed successfully` : `Your subscription to ${plan.name} plan was successfully`;

            this.notificationService.create({
                user_id: user.id,
                title,
                description,
                priority: true
            })
        }

        return true;
    }

    async createSubscriptionHistory(user_id: Types.ObjectId, plan_id: Types.ObjectId, expire_at: Date): Promise<SubscriptionHistory> {
        return await this.subscriptionsHistoryModel.create({expire_at, plan_id, user_id})
    }
}
