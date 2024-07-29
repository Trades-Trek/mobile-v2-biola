import {IsNotEmpty} from "class-validator";

export class CreateListingDto {
    @IsNotEmpty()
    name:string
}