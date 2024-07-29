import {ArrayMinSize, IsArray, IsNotEmpty, ValidateNested,} from "class-validator";
import {Types} from "mongoose";
import {ApiProperty, PartialType} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {Question} from "../schemas/question.schema";

export class QuestionDto {
    @IsNotEmpty()
    @ApiProperty()
    text: string

    @IsNotEmpty()
    @ApiProperty()
    question_type: string

    @IsNotEmpty()
    @ApiProperty()
    description: string

    @ApiProperty()
    @IsNotEmpty()
    correct_answer: string

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(2)
    options: Array<string>
}

export class CreateQuizDto {
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    learn_resource_id: Types.ObjectId


    // @ApiProperty({type: QuestionDto})
    @IsArray()
    @ValidateNested({each: true})
    @ArrayMinSize(2)
    @Type(() => QuestionDto)
    questions: QuestionDto[]
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {

}

