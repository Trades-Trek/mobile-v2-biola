import {PartialType} from '@nestjs/swagger';
import {CreateUserDto} from './create-user.dto';
import {IsNotEmpty} from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    first_name: string;
    @IsNotEmpty()
    last_name: string;
    @IsNotEmpty()
    phone: string

    @IsNotEmpty()
    gender: string

    profile_picture: string
}
