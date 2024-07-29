import {CanActivate, ExecutionContext, HttpStatus, Injectable,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import {ConfigService} from "@nestjs/config";
import {returnErrorResponse} from "../utils/response";
import {UsersService} from "../users/users.service";
import {USER} from "../users/enums/user.enum";
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorators/public-endpoint.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {Role} from "../enums/role.enum";
import {ERROR_MESSAGES} from "../enums/error-messages";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService: JwtService, private configService: ConfigService, private userService: UsersService, private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.params.user_id;
        if (request.user.role !== Role.ADMIN) returnErrorResponse('Unauthorized resource')

        if (userId) {
            const client = await this.userService.findOne({field: '_id', data: userId});
            if (!client) returnErrorResponse(ERROR_MESSAGES.INVALID_USER)
            request['client'] = client;
        }
        return true

    }


}