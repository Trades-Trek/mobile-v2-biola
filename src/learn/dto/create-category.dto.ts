import {IsArray, IsNotEmpty, } from "class-validator";
import {Types} from "mongoose";
import {PartialType} from "@nestjs/swagger";
import {CreateLearnDto} from "./create-learn.dto";

export class CreateCategoryDto {
    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    description:string

}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

}
