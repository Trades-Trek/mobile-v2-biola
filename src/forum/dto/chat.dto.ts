import {IsEnum, IsNotEmpty} from "class-validator";
import {Types} from "mongoose";
import {CHAT_TYPE} from "../../enums/chat.enum";
import {ApiProperty} from "@nestjs/swagger";

export class CreateChatDto {
    @IsNotEmpty()
    forum_id: string
    @IsNotEmpty()
    chat: string

    @ApiProperty({enum: CHAT_TYPE})
    @IsNotEmpty()
    @IsEnum(CHAT_TYPE)
    type: CHAT_TYPE
}
