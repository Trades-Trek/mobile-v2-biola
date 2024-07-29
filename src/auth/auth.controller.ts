import {Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupDto} from './dto/signup.dto';
import {LoginDto} from './dto/login.dto';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {GoogleOauthGuard} from "../guards/google-oauth.guard";
import {VerifyUserDto} from "./dto/verify-user.dto";
import {CreateOtpDto} from "../otp/dto/create-otp.dto";
import {VerifyOtpDto} from "../otp/dto/verify-otp.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {UsersService} from "../users/users.service";
import {Public} from "../decorators/public-endpoint.decorator";
import {AuthUser} from "../decorators/user.decorator";
import {User, UserDocument} from "../users/schemas/user.schema";
import {successResponse} from "../utils/response";
import {AuthId} from "../decorators/user_id.decorator";
import {ObjectId, Types} from "mongoose";
import {VerifyBvnAndPhoneDto} from "./dto/verify-bvn.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private userService: UsersService) {
    }

    @ApiOperation({summary: "Signup", description: "Signup"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "creates a user account"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Public()
    @Post('/signup')
    signup(@Body() createAuthDto: SignupDto) {
        return this.authService.signup(createAuthDto);
    }

    // @Public()
    // @Post('/admin/signup')
    // adminSignup(@Body() createAuthDto: SignupDto) {
    //     return this.authService.adminSignup(createAuthDto);
    // }


    @ApiOperation({summary: "Login", description: "Login with email and password"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns the user data with an access token"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Public()
    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }


    @ApiOperation({summary: "Verify user", description: "Used for verifying a newly registered user"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns the user data with an access token"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Public()
    @Post('/verify-user')
    verifyUser(@Body() verifyUserDto: VerifyUserDto) {
        return this.authService.verifyUser(verifyUserDto);
    }

    @ApiOperation({summary: "Verify Bvn & Phone number", description: "Used for verifying user bvn"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a boolean value indicating whether the verification is successful"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Public()
    @Post('/verify-bvn-phone')
    verifyBvn(@AuthUser() user: UserDocument, @Body() verifyBvnAndPhoneDto: VerifyBvnAndPhoneDto) {
        return this.authService.verifyBvnAndPhoneNumber(user, verifyBvnAndPhoneDto);
    }


    @ApiOperation({summary: "Auth user", description: "Get logged in user data"})
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @Get('user')
    authUser(@AuthId() userId: Types.ObjectId) {
        return this.authService.authUser(userId)
    }

    @ApiOperation({summary: "Send Otp", description: "Send otp to email"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a success message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Poor network or validation errors"
    })
    @Post('/send-otp')
    @Public()
    sendOtp(@Body() sendOtpDto: CreateOtpDto) {
        return this.authService.sendOtp(sendOtpDto);
    }

    @ApiOperation({summary: "Re-send Otp", description: "Re-send otp to email"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a success message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Poor network or validation errors"
    })
    @Public()
    @Post('/re-send-otp')
    resendOtp(@Body() sendOtpDto: CreateOtpDto) {
        return this.authService.sendOtp(sendOtpDto);
    }

    @ApiOperation({summary: "Verify Otp", description: "Used for verifying otp"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a success message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Poor network or validation errors"
    })
    @Public()
    @Post('/verify-otp')
    verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto);
    }

    @ApiOperation({summary: "Reset Password", description: "Used for resetting password"})
    @ApiResponse({
        status: HttpStatus.OK,
        description: "returns a success message"
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid request or validation errors"
    })
    @Public()
    @Post('/reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.userService.resetPassword(resetPasswordDto);
    }

    @ApiOperation({summary: "Google login", description: "Login with google"})
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    google() {
    }

    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthCallback(@Req() req, @Res() res) {
        console.log(req.user)
        // const token = await this.authService.signIn(req.user);
        return res.sendStatus(200)
    }

}
