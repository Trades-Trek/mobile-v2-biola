import {CanActivate, ExecutionContext, HttpStatus, Injectable,} from '@nestjs/common';
import {Request} from 'express';
import {DOMAIN} from "../enums/domain";
import {returnErrorResponse} from "../utils/response";

@Injectable()
export class DomainGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!this.isValidDomain(request) && !request.path.includes("webhook")) returnErrorResponse('Forbidden', HttpStatus.FORBIDDEN)
        console.log(request.path)
        console.log(request.body)
        return true;
    }

    private isValidDomain(request: Request): boolean {
        const header = request.headers["dm"];
        const domains = [DOMAIN.WEB_APP, DOMAIN.MOBILE_APP];
        if (!header || !domains.includes(<DOMAIN>header)) return false;
        request["DM"] = header;
        return true;
    }
}