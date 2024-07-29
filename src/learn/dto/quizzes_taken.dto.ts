import {QuestionDto} from "./quiz.dto";
import {ApiProperty} from "@nestjs/swagger";
import {ArrayMinSize, IsArray, IsNotEmpty, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class QuizzesTakenDto {
    @IsArray()
    @ValidateNested({each: true})
    @ArrayMinSize(2)
    @Type(() => AnswerDto)
    answers:AnswerDto[]
}

export class AnswerDto {
    @ApiProperty()
    @IsNotEmpty()
    question:string

    @ApiProperty()
    @IsNotEmpty()
    answer:string
}