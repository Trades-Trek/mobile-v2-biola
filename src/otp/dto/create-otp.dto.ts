import {IsNotEmpty} from "class-validator";

export class CreateOtpDto {
    email: string
    phone?: string
    request_password_reset?:boolean
}
