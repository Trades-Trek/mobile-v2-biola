import {ArrayMinSize, IsArray, IsNotEmpty,} from "class-validator";
import {Types} from "mongoose";

export class CreateLearnDto {
    @IsNotEmpty()
    title:string

    @IsNotEmpty()
    description:string

    @IsNotEmpty()
    content_url:string

    @IsNotEmpty()
    content_type:string

    @IsNotEmpty()
    thumbnail_url:string

    @IsNotEmpty()
    author:string

    @IsNotEmpty()
    provider:string

    @IsNotEmpty()
    category_id:string

    @ArrayMinSize(2)
    @IsArray()
    tags:Array<string>

    @ArrayMinSize(2)
    @IsArray()
    symbols:Array<string>

    // @IsArray()
    // quizzes:Array<Types.ObjectId>
}
