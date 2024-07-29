import {IsNotEmpty} from "class-validator";

export class FundTrekCoinsDto  {
    @IsNotEmpty()
    cash:number
}

export class FundWalletDto  {
    @IsNotEmpty()
    trek_coins:number
}
