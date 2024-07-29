import {UserDocument} from "../../users/schemas/user.schema";
import {TRANSACTION_STATUS} from "../../enums/transaction_status";
import {Types} from "mongoose";
import {TRANSACTION_ENTITY, TRANSACTION_TYPE} from "../../enums/transaction_type";
import {PaginationDto} from "../../enums/pagination.enum";
import {ApiProperty} from "@nestjs/swagger";

export class CreateTransactionDto {
    user_id:Types.ObjectId

    transfer_code?:string

    reference:string

    amount:number

    status?:TRANSACTION_STATUS

    description:string

    type:TRANSACTION_TYPE

    entity:TRANSACTION_ENTITY
    wallet_balance_before_transaction:number
    trek_coin_balance_before_transaction:number

}


export class TransactionQueryDto extends PaginationDto {
    @ApiProperty({enum: TRANSACTION_ENTITY})
    entity: TRANSACTION_ENTITY
}
