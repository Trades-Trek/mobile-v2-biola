import {IsNotEmpty} from "class-validator";

export class VerifyUserDto  {
    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    otp:number
}
