import {IsNotEmpty} from "class-validator";
import {Types} from "mongoose";

export class CreateForumDto {
    @IsNotEmpty()
    topic:string

    @IsNotEmpty()
    competition_id:Types.ObjectId

    description:string
}
