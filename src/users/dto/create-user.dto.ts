import {Role} from "../../enums/role.enum";

export class CreateUserDto {
    first_name: string;

    last_name: string;
    email: string;
    password: string;
    referral_code?: string
    role?:Role
    is_verified?: boolean

}
