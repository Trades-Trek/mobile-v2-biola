import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus} from '@nestjs/common';
import {SubscriptionsService} from './subscriptions.service';
import {Types} from "mongoose";
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {
    }

    @ApiOperation({summary: "Subscribe"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('/subscribe/:plan_id')
    create(@Param('plan_id') planId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.subscriptionsService.subscribe(user, planId);
    }

    @ApiOperation({summary: "Renew Subscription"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('/renew')
    renew(@AuthUser() user: UserDocument) {
        return this.subscriptionsService.renew(user);
    }

    @ApiOperation({summary: "Gift Subscription Plan"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a successful message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Post('/gift-plan/:recipient_id/:plan_id')
    giftPlan(@AuthUser() giver: UserDocument, @Param('recipient_id') recipientId:Types.ObjectId, @Param('plan_id') planId: Types.ObjectId) {
        return this.subscriptionsService.giftPlan(giver, recipientId, planId);
    }


}
