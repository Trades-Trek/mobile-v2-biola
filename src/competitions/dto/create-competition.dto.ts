import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateIf} from "class-validator";
import {COMPETITION_ENTRY, COMPETITION_TYPE, COMPETITION_VISIBILITY} from "../../enums/competition.enum";
import {ApiProperty} from "@nestjs/swagger";
import {Optional} from "@nestjs/common";
import {Types} from "mongoose";

export class CreateCompetitionDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @ValidateIf((data) => data.type === COMPETITION_TYPE.GROUP)
    @IsNotEmpty()
    @IsNumber()
    capacity?: number

    @ApiProperty({
        enum: COMPETITION_TYPE
    })
    @IsNotEmpty()
    @IsEnum(COMPETITION_TYPE)
    type: COMPETITION_TYPE

    @ApiProperty({
        enum: COMPETITION_ENTRY
    })
    @IsNotEmpty()
    @IsEnum(COMPETITION_ENTRY)
    entry: COMPETITION_ENTRY

    @IsNotEmpty()
    @Max(1)
    @Min(0)
    allow_late_entry: number

    @IsNotEmpty()
    @IsNumber()
    @Max(1)
    @Min(0)
    allow_portfolio_viewing: number

    @ApiProperty({
        enum: COMPETITION_VISIBILITY
    })
    @IsNotEmpty()
    @IsEnum(COMPETITION_VISIBILITY)
    visibility: COMPETITION_VISIBILITY

    @IsNotEmpty()
    @IsNumber()
    @Max(1)
    @Min(0)
    allow_portfolio_resetting: number

    @IsNotEmpty()
    start_date: string

    end_date?: string

    @IsNotEmpty()
    market_delay: number

    @IsNotEmpty()
    minimum_price: number

    @IsNotEmpty()
    quick_sell: number

    @IsNotEmpty()
    commission: number

    @IsNotEmpty()
    starting_cash: number

    is_default: number

    // @Optional()
    // @IsArray()
    participants?: Array<string>

}

export class JoinCompetitionDto {
    password:string
}

export class PortfolioDto {
    competition_id:Types.ObjectId
}