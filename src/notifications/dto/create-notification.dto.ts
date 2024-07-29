import {Types} from "mongoose";

export class CreateNotificationDto {
    user_id: Types.ObjectId

    title: string

    description: string

    priority?: boolean
    payload?: {}
}


export class SendPushNotificationDto {
    user_ids: Types.ObjectId | Array<Types.ObjectId>

    title: string

    description: string

}