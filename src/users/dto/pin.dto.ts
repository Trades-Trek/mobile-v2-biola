import {IsNotEmpty, IsNumber, Max, MaxLength, Min, MinLength} from "class-validator";

export class CreatePinDto {
    @IsNotEmpty()
    @IsNumber()
    @MinLength(4)
    @MaxLength(4)
    pin:number;
}

export class UpdatePinDto {
    @IsNotEmpty()
    @IsNumber()
    @MinLength(4)
    @MaxLength(4)
    current_pin:number;

    @IsNotEmpty()
    @IsNumber()
    @MinLength(4)
    @MaxLength(4)
    new_pin:number;
}