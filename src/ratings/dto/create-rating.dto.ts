import {IsInt, IsNotEmpty, Max, Min} from "class-validator";

export class CreateRatingDto {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    star: number;

    review?: string;
}
