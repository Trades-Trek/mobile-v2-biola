import {IsNotEmpty} from "class-validator";

export class VerifyBvnAndPhoneDto  {
    @IsNotEmpty()
    bvn:number

    @IsNotEmpty()
    phone:string

    @IsNotEmpty()
    dob:string

    @IsNotEmpty()
    first_name:string

    @IsNotEmpty()
    last_name:string
}
