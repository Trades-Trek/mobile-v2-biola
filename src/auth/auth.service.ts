import {Injectable} from '@nestjs/common';
import {SignupDto} from './dto/signup.dto';
import {LoginDto} from './dto/login.dto';
import {UsersService} from "../users/users.service";
import {returnErrorResponse, successResponse} from "../utils/response";
import {OtpService} from "../otp/otp.service";
import {User, UserDocument} from "../users/schemas/user.schema";
import {JwtService} from "@nestjs/jwt";
import {VerifyUserDto} from "./dto/verify-user.dto";
import {USER} from "../users/enums/user.enum";
import {CreateOtpDto} from "../otp/dto/create-otp.dto";
import {VerifyOtpDto} from "../otp/dto/verify-otp.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model, ObjectId, Types} from "mongoose";
import {ResetPasswordToken} from "../users/schemas/token.schema";
import {VerifyBvnAndPhoneDto} from "./dto/verify-bvn.dto";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {generateCode} from "../utils/constant";
import {ReferralsService} from "../referrals/referrals.service";
import {Role} from "../enums/role.enum";
import {SubscriptionsService} from "../subscriptions/subscriptions.service";
import {PlansService} from "../plans/plans.service";
import {SUBSCRIPTION_DURATION} from "../enums/subscription_duration";
import {CompetitionsService} from "../competitions/services/competitions.service";
import {useEncryptionService} from "../services/aes-encrypt";
import {ConfigService} from "@nestjs/config";
import {NotificationsService} from "../notifications/notifications.service";

const bcrypt = require("bcrypt");

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private otpService: OtpService, private jwtService: JwtService, private referralService: ReferralsService, private subscriptionService: SubscriptionsService, private planService: PlansService, private competitionService: CompetitionsService, private configService: ConfigService, private notificationService: NotificationsService) {
    }

    async signup(createAuthDto: SignupDto) {
        const {email, first_name, last_name, password, referral_code} = createAuthDto;
        if (referral_code) {
            if (!await this.userService.findOne({
                field: USER.REFERRAL_CODE,
                data: referral_code,
                fields_to_load: USER.REFERRAL_CODE
            })) returnErrorResponse('Invalid referral code')
        }
        
        // const decryptedPassword = useEncryptionService().decryptData(password, this.configService.get('ENCRYPTION_KEY'))


        const user = await this.userService.findOne({
            field: USER.EMAIL,
            data: email,
            fields_to_load: 'email verified _id'
        }) ?? await this.userService.create({
            first_name,
            last_name,
            email,
            password: await bcrypt.hash(password, 10),
            // password: decryptedPassword ? await bcrypt.hash(decryptedPassword, 10) : await bcrypt.hash(password, 10),
            referral_code
        })
      
        if (user.verified) returnErrorResponse('Already a user')

        await this.otpService.sendOtpViaEmail(user.email)
        return successResponse({is_verified: false, message: 'A one time passcode has been sent to your email'})
    }

    async adminSignup(createAuthDto: SignupDto) {
        const {email, first_name, last_name, password} = createAuthDto;
        const admin = await this.userService.create({
            first_name,
            last_name,
            email,
            role: Role.ADMIN,
            password: await bcrypt.hash(password, 10),
            is_verified: true
        })
        return successResponse({admin})

    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        let user: UserDocument | undefined = await this.userService.findOne({
            field: USER.EMAIL,
            data: email,
            is_server_request: true
        })
        if (!user) returnErrorResponse('User does not exist')

        const decryptedPassword = useEncryptionService().decryptData(password, this.configService.get('ENCRYPTION_KEY'))

        if (!await this.comparePassword(decryptedPassword ? decryptedPassword : password, user.password)) returnErrorResponse('Invalid credentials')

        const accessToken = user.verified ? await this.generateAccessToken(user._id, user.username) : await this.otpService.sendOtpViaEmail(user.email, true, user.full_name);
        // load client user data
        if (user.verified) {
            user = await this.userService.findOne({
                field: USER.EMAIL,
                data: email,
            })
            this.notificationService.create({
                user_id: user.id,
                title: 'Login successful',
                description: SUCCESS_MESSAGES.LOGGED_IN_SUCCESS
            })
        }

        const message = user.verified ? 'Login successful' : 'A one time passcode has been sent to your email';
        return successResponse({
            is_verified: user.verified,
            access_token: accessToken,
            user: user.verified ? user : null,
            message
        })

    }

    async verifyUser(verifyUserDto: VerifyUserDto) {
        const {email, otp} = verifyUserDto;
        if (!await this.otpService.verifyOtpViaMail(email, otp)) returnErrorResponse('Invalid Otp')
        let user: UserDocument | undefined = await this.userService.findOne({field: USER.EMAIL, data: email})
        if (!user) returnErrorResponse('User does not exist')

        if (user.verified) returnErrorResponse('Your account has already been verified')

        await user.updateOne({verified: true, referral_code: generateCode(6)})

        user = await this.userService.findOne({field: USER.EMAIL, data: email})
        // check if user was referred
        if (user.referrer_code) {
            const referrer = await this.userService.findOne({
                data: user.referrer_code,
                field: USER.REFERRAL_CODE,
                is_server_request: true
            })
            const referral = await this.referralService.findOrCreate(user.email, referrer)
            if (referral) {
                this.referralService.joined(referrer, referral)
            }
        }

        // subscribe user to a free trial
        const freeTrialPlan = await this.planService.findOne({duration: SUBSCRIPTION_DURATION.TRIAL})
        if (freeTrialPlan) {
            await this.subscriptionService.createOrRenewSubscription(user, freeTrialPlan, false, false)
        }
        // join default competition
        const tradesTrekCompetition = await this.competitionService.findOne({is_default: true})
        if (tradesTrekCompetition) {
            await this.competitionService.findOrCreateParticipant(tradesTrekCompetition.id, user.email, tradesTrekCompetition.owner)
            await this.competitionService.joinCompetition(user, tradesTrekCompetition)
        }

        // generate access token
        const accessToken = await this.generateAccessToken(user._id, user.username);
        return successResponse({is_verified: user.verified, access_token: accessToken, user})

    }

    async sendOtp(sendOtpDto: CreateOtpDto) {
        const {email} = sendOtpDto;
        await this.otpService.sendOtpViaEmail(email)
        return successResponse('Otp sent to your mail')
    }

    async verifyOtp(sendOtpDto: VerifyOtpDto) {
        console.log(sendOtpDto)
        const {email, otp, request_password_reset} = sendOtpDto;
        const user = await this.userService.findOne({
            field: USER.EMAIL,
            data: email,
            fields_to_load: 'email'
        });
        if (!user) returnErrorResponse('User does not exist');

        if (!await this.otpService.verifyOtpViaMail(email, otp)) returnErrorResponse('Could not Verify OTP')
        const passwordResetToken = request_password_reset ? await this.userService.requestPasswordReset(user._id) : null;
        const returnData = request_password_reset ? {
            message: 'Otp verified successfully',
            password_reset_token: passwordResetToken,
        } : {message: 'Otp verified successfully'};
        return successResponse(returnData)
    }

    async verifyBvnAndPhoneNumber(user: UserDocument, verifyBvnAndPhoneDto: VerifyBvnAndPhoneDto) {
        const {bvn, phone, dob, first_name, last_name} = verifyBvnAndPhoneDto;
        const isValidBvn = true;
        if (!isValidBvn) returnErrorResponse(ERROR_MESSAGES.INVALID_BVN)
        await user.updateOne({bvn_verified: true, phone_verified: true})
        return successResponse({verified: true, message: SUCCESS_MESSAGES.BVN_VERIFIED})
    }

    async authUser(userId: Types.ObjectId) {
        return successResponse({user: await this.userService.findOne({field: USER.ID, data: userId})})
    }


    async generateAccessToken(user_id: any, username: string) {
        const payload = {sub: user_id, username};
        return await this.jwtService.signAsync(payload);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword)
    }


}
