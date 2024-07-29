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

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private configService: ConfigService, private userService: UsersService, private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic) return true;

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            returnErrorResponse('Unauthorized', HttpStatus.UNAUTHORIZED)
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get('JWT_SECRET'),
                }
            );
            const user = await this.userService.findOne({field: USER.ID, data: payload.sub, is_server_request:true});
            if (!user) new Error();
            request['user'] = user;
        } catch {
            returnErrorResponse('Unauthorized', HttpStatus.UNAUTHORIZED)
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}