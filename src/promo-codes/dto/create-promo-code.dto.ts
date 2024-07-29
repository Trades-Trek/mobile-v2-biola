import {IsNotEmpty, IsNumber} from "class-validator";

export class CreatePromoCodeDto {
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    description:string

    @IsNotEmpty()
    @IsNumber()
    discount:number

    @IsNotEmpty()
    start_date:string

    @IsNotEmpty()
    expire_at:string

    @IsNotEmpty()
    code:string
}

export class VerifyPromoCodeDto {

    @IsNotEmpty()
    code:string
}
