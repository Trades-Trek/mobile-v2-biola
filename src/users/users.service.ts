import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {Model, Types} from "mongoose";
import {UserQueryDto} from "./dto/query.dto";
import {ResetPasswordDto} from "../auth/dto/reset-password.dto";
import {returnErrorResponse, successResponse} from "../utils/response";
import {ResetPasswordToken} from "./schemas/token.schema";
import {UpdateSettingsDto} from "./dto/settings.dto";
import {isEmpty} from "class-validator";
import {CreatePinDto, UpdatePinDto} from "./dto/pin.dto";
import {USER} from "./enums/user.enum";
import {TransactionsService} from "../transactions/transactions.service";
import {NotificationsService} from "../notifications/notifications.service";
import {OrdersService} from "../orders/orders.service";
import {AccountValueService} from "../competitions/services/account-value.service";
import {useEncryptionService} from "../services/aes-encrypt";
import {ConfigService} from "@nestjs/config";
import {Pagination} from "../enums/pagination.enum";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {ChangePasswordDto} from "../admin/dto/change-password.dto";
import {SUCCESS_MESSAGES} from "../enums/success-messages";

const bcrypt = require("bcrypt");
const crypto = require("crypto")

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(ResetPasswordToken.name) private resetPasswordTokenModel: Model<ResetPasswordToken>, private transactionService: TransactionsService, private notificationService: NotificationsService, private orderService: OrdersService, private accountValueService: AccountValueService, private configService: ConfigService) {
    }

    async create(createUserDto: CreateUserDto) {
        const data = {
            referrer_code: createUserDto.referral_code,
            first_name: createUserDto.first_name,
            last_name: createUserDto.last_name,
            email: createUserDto.email,
            full_name: createUserDto.first_name + ' ' + createUserDto.last_name,
            username: createUserDto.first_name + '@0' + await this.userModel.countDocuments({}) + 1,
            password: createUserDto.password,
            role: createUserDto.role ?? 'user',
            verified: createUserDto.is_verified ?? false

        }
        return await this.userModel.create(data)
    }

    async updateUserSettings(user: UserDocument, updateSettingsDto: UpdateSettingsDto) {
        const updatedFields = {
            settings: {}
        };
        Object.keys(updateSettingsDto).forEach(key => {
            if (!isEmpty(updateSettingsDto[key])) {
                updatedFields.settings[key] = updateSettingsDto[key];
            }
        });
        await user.updateOne(updatedFields)
        return successResponse('settings updated successfully')
    }

    async createUserPin(user: UserDocument, createPinDto: CreatePinDto) {
        if (user.pin) returnErrorResponse('cannot create more than one pin')
        await user.updateOne({pin: await bcrypt.hash(createPinDto.pin, 10), has_pin: true})
        return successResponse('Your pin has been created successfully')
    }

    async updateUserPin(user: UserDocument, updatePinDto: UpdatePinDto) {
        if (!await bcrypt.compare(updatePinDto.current_pin, user.pin)) returnErrorResponse('Incorrect pin')
        await user.updateOne({pin: await bcrypt.hash(updatePinDto.current_pin, 10)})
        return successResponse('Your pin has been updated successfully')
    }

    async findOne(query: UserQueryDto) {
        const queryObj = {};
        queryObj[query.field] = query.data;
        query.fields_to_load = !query.fields_to_load ? !query.is_server_request ? USER.DEFAULT_FIELDS : USER.DEFAULT_SERVER_FIELDS : query.fields_to_load;
        return this.userModel.findOne(queryObj).select(query.fields_to_load);
    }


    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const {new_password, reset_password_token, confirm_password} = resetPasswordDto;
        const decryptedNewPassword = await useEncryptionService().decryptData(new_password, this.configService.get('ENCRYPTION_KEY'))
        const decryptedConfirmPassword = await useEncryptionService().decryptData(confirm_password, this.configService.get('ENCRYPTION_KEY'))
        if (decryptedNewPassword !== decryptedConfirmPassword) returnErrorResponse('Passwords do not match')
        let passwordResetToken = await this.resetPasswordTokenModel.findOne({reset_token: reset_password_token});
        if (!passwordResetToken) returnErrorResponse("Invalid or expired password reset token");
        const isValid = await bcrypt.compare(reset_password_token, passwordResetToken.token);
        if (!isValid) {
            returnErrorResponse("Invalid or expired password reset token");
        }
        const hash = await bcrypt.hash(decryptedNewPassword, 10);
        await this.userModel.updateOne(
            {_id: passwordResetToken.user_id},
            {$set: {password: hash}},
        );
        await passwordResetToken.deleteOne()
        return successResponse('Your password has been reset successfully')
    }


    async requestPasswordReset(user_id: Types.ObjectId): Promise<number> {
        let token = await this.resetPasswordTokenModel.findOne({user_id});
        if (token) await token.deleteOne();
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(10));
        await this.resetPasswordTokenModel.create({
            user_id,
            token: hash,
            reset_token: resetToken
        })
        return resetToken;
    }


    async update(user: UserDocument, updateUserDto: UpdateUserDto) {
        const updatedFields = {};
        Object.keys(updateUserDto).forEach(key => {
            if (!isEmpty(updateUserDto[key])) {
                updatedFields[key] = updateUserDto[key];
            }
        });
        updatedFields['full_name'] = updateUserDto.first_name + ' ' + updateUserDto.last_name;
        await user.updateOne(updatedFields)
        return successResponse({message: 'profile updated successfully'})
    }

    // end of client resource

    // admin resources
    async getAllUsers(pagination: Pagination) {
        const count = await this.userModel.countDocuments({});
        const users = await this.userModel.find().skip(pagination.page).limit(pagination.limit)
        return successResponse({users, total_rows: count})
    }

    async updateUser(user:UserDocument, updateUserDto: UpdateUserDto) {
        return await this.update(user, updateUserDto)
    }

    async updateUserStatus(user:UserDocument) {
        user.is_active = !user.is_active;
        await user.save();
        return successResponse(SUCCESS_MESSAGES.USER_STATUS_UPDATED)
    }

    async changePassword(user: UserDocument, changePasswordDto: ChangePasswordDto) {
        if (changePasswordDto.new_password.trim() != changePasswordDto.confirm_new_password.trim()) returnErrorResponse(ERROR_MESSAGES.INVALID_CREDENTIALS)

        if (!await this.userModel.findByIdAndUpdate(user.id, {password: await bcrypt.hash(changePasswordDto.new_password, Number(10))})) returnErrorResponse(ERROR_MESSAGES.INVALID_USER)

        return successResponse('password changed successfully')

    }

    async deleteUser(user: UserDocument) {
        await user.deleteOne()
        return successResponse('deleted successfully');
    }

}
