import {Types} from "mongoose";
import {UserDocument} from "../../users/schemas/user.schema";
import {PaginationDto} from "../../enums/pagination.enum";

export class ReferralDto {
    email: string

}

export class ReferralQueryDto extends PaginationDto {
    joined: boolean
}
