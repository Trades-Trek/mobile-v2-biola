import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema({timestamps: true})
export class Notification {
    @Prop({type: Types.ObjectId, required: true})
    user_id: string

    @Prop({required: true})
    title: string

    @Prop({required: true})
    description: string

    @Prop({required: true, type: Boolean, default: false})
    read: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);