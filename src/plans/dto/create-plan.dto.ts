import {IsNotEmpty, IsArray, ArrayNotEmpty} from "class-validator";
import {SUBSCRIPTION_DURATION} from "../../enums/subscription_duration";
import {Types} from "mongoose";

export class CreatePlanDto {
    @IsNotEmpty()
    name: string
    description: string

    @IsNotEmpty()
    duration: SUBSCRIPTION_DURATION

    @IsNotEmpty()
    no_of_days: number

    @IsNotEmpty()
    amount: number

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    features: [Types.ObjectId]

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    listings: Array<any>
}
