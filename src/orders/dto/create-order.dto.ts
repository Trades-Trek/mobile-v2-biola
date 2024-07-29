import {IsEnum, IsNotEmpty, IsNumber, Min, MIN, ValidateIf} from "class-validator";
import {ORDER_DURATION, ORDER_STATUS, ORDER_TYPE, TRADE_ACTION} from "../../enums/orders.enum";
import {ApiProperty} from "@nestjs/swagger";
import {Types} from "mongoose";
import {PaginationDto} from "../../enums/pagination.enum";

export class CreateOrderDto {

    @ApiProperty({enum: TRADE_ACTION})
    @IsNotEmpty()
    @IsEnum(TRADE_ACTION)
    trade_action: TRADE_ACTION

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number

    @ApiProperty({enum: ORDER_DURATION})
    @IsNotEmpty()
    @IsEnum(ORDER_DURATION)
    duration: ORDER_DURATION

    @ApiProperty({enum: ORDER_TYPE})
    @IsNotEmpty()
    @IsEnum(ORDER_TYPE)
    order_type: ORDER_TYPE

    @ValidateIf((data) => data.type === ORDER_TYPE.LIMIT)
    @IsNotEmpty()
    @IsNumber()
    price?: number

    @IsNotEmpty()
    competition_id: Types.ObjectId
}

export class OrderQueryDto extends PaginationDto {
    competition_id?: Types.ObjectId
    user_id?: Types.ObjectId
    status?: ORDER_STATUS
    trade_action?: TRADE_ACTION

}
