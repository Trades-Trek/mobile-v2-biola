import {IsNotEmpty} from "class-validator";

export class ChangePasswordDto {

    @IsNotEmpty()
    new_password:string

    @IsNotEmpty()
    confirm_new_password:string
}

export class WalletDto {

    @IsNotEmpty()
    amount:string

}
