import {IsNotEmpty, ValidateIf} from "class-validator";

export class WatchlistDto {

}

export class WatchlistPriceAlertDto {
    @IsNotEmpty()
    value: number
    @ValidateIf((data) => data.value)
    @IsNotEmpty()
    order: string
    @ValidateIf((data) => data.value)
    @IsNotEmpty()
    order_price: number

}
