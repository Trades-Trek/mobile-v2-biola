import {UserDocument} from "../../users/schemas/user.schema";
import {ACTIVITY_ENTITY} from "../../enums/activities.enum";

export class CreateActivityDto {
    activity: string;

    entity: ACTIVITY_ENTITY;

    by:UserDocument
}
