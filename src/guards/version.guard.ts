import {CanActivate, ExecutionContext, HttpStatus, Injectable,} from '@nestjs/common';
import {Request} from 'express';
import {DOMAIN} from "../enums/domain";
import {returnErrorResponse} from "../utils/response";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class VersionGuard implements CanActivate {
    constructor(private configService: ConfigService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!this.isCurrentVersion(request)) returnErrorResponse('Please update your app from the App or Play Store to enjoy the latest from Trades Trek..', HttpStatus.BAD_REQUEST)
        return true;
    }

    private isCurrentVersion(request: Request): boolean {
        const version = request.headers["trades-trek-version"];
        if (!version || version != this.configService.get('TRADES_TREK_VERSION')) return false;
        request["trades-trek-version"] = version;
        return true;
    }
}