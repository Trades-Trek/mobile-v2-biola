import {IsNotEmpty} from "class-validator";

export class VerifyOtpDto {
    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    otp:number
    request_password_reset:number
}
