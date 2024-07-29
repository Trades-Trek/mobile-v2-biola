import {IsNotEmpty} from "class-validator";

export class InitializeTransactionDto {
    @IsNotEmpty()
    amount:number

    @IsNotEmpty()
    email:string

    metadata:any

    payment_channels:Array<any>

}