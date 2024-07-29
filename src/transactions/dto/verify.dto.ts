import {IsNotEmpty} from "class-validator";

export class VerifyTransactionDto {
    @IsNotEmpty()
    payment_reference:string

}