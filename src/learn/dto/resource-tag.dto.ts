import {IsNotEmpty} from "class-validator";

export class CreateResourceTagDto {
    @IsNotEmpty()
    tag:string

}