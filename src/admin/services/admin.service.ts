import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {CreateAdminDto} from '../dto/create-admin.dto';
import {UpdateAdminDto} from '../dto/update-admin.dto';
import {LoginDto} from "../../auth/dto/login.dto";
import {AuthService} from "../../auth/auth.service";
import {UsersService} from "../../users/users.service";
import {UserDocument} from "../../users/schemas/user.schema";
import {USER} from "../../users/enums/user.enum";
import {returnErrorResponse, successResponse} from "../../utils/response";
import {Role} from "../../enums/role.enum";
import {ERROR_MESSAGES} from "../../enums/error-messages";
import {CompetitionsService} from "../../competitions/services/competitions.service";
import {SendPushNotificationDto} from "../../notifications/dto/create-notification.dto";
import {useOneSignalService} from "../../services/onesignal";

const bcrypt = require("bcrypt");

@Injectable()
export class AdminService {
    constructor(private authService: AuthService, @Inject(forwardRef(() => UsersService)) private userService: UsersService) {
    }

    async create(createAdminDto: CreateAdminDto) {
        createAdminDto.password = await bcrypt.hash(createAdminDto.password)
        await this.userService.create({...createAdminDto, is_verified: true})
        return successResponse('user created successfully')
    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        // get user for server usage
        let user: UserDocument | undefined = await this.userService.findOne({
            field: USER.EMAIL,
            data: email,
            is_server_request: true
        })
        if (!user) returnErrorResponse(ERROR_MESSAGES.INVALID_USER)

        if (user.role !== Role.ADMIN) returnErrorResponse(ERROR_MESSAGES.UNAUTHORISED)

        if (!await this.authService.comparePassword(password, user.password)) returnErrorResponse(ERROR_MESSAGES.INVALID_CREDENTIALS)
        // get user for client
        user = await this.userService.findOne({
            field: USER.EMAIL,
            data: email,
        })
        return successResponse({
            access_token: await this.authService.generateAccessToken(user.id, user.username),
            user
        })
    }

    async sendPushNotification(sendPushNotificationDto:SendPushNotificationDto){
        const {user_ids, description, title} = sendPushNotificationDto;
        await useOneSignalService().sendPushNotification(user_ids, title, description, {})
        return successResponse('push notification sent successfully')
    }


}
