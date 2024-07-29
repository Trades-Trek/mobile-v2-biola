import {CanActivate, ExecutionContext, HttpStatus, Injectable,} from '@nestjs/common';
import {Request} from 'express';
import {returnErrorResponse} from "../utils/response";
import {ConfigService} from "@nestjs/config";
import {PLAN_TYPE} from "../enums/plan_type";

@Injectable()
export class SubscribedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const subscription = user.subscription;
        if (!subscription.plan_id || subscription.plan_type === PLAN_TYPE.FREE || subscription.has_expired) returnErrorResponse('Please subscribe or renew plan to continue')
        return true;
    }

}