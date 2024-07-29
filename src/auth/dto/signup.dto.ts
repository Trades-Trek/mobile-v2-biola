import {IsEmpty, IsNotEmpty} from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    first_name:string

    @IsNotEmpty()
    last_name:string

    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    password:string

    referral_code?:string

}
