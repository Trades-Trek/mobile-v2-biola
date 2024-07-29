import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from '@nestjs/core';
import {PlansService} from "../plans/plans.service";

@Injectable()
export class FeatureGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private planService: PlansService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredFeatures = this.reflector.get<string[]>('features', context.getHandler());
        if (!requiredFeatures) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userSub = request.user.subscription;
        const userSubscriptionFeatures = await this.planService.getPlanFeatures(userSub.plan_id)
        return !requiredFeatures.some((feature) =>
            !this.formatFeaturesIntoArrayOfString(userSubscriptionFeatures)?.includes(feature));

    }

    formatFeaturesIntoArrayOfString(features): Array<any> {
        const arrayOfStrings = [];
        for (const f of features) arrayOfStrings.push(f.feature.slug)
        return arrayOfStrings;
    }
}
