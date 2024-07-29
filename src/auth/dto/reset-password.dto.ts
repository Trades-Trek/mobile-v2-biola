import {IsNotEmpty} from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    new_password: string

    @IsNotEmpty()
    reset_password_token: string

    @IsNotEmpty()
    confirm_password: string
}


