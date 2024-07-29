import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema({timestamps:true})
export class Chat {
    @Prop()
    chat:string

    @Prop({required:true, default:'text'})
    type:string

    @Prop({required:true, default:false})
    pinned:boolean

    @Prop({required: true, type: Types.ObjectId,
        ref: 'User'})
    sender: Types.ObjectId

    @Prop({required: true, type: Types.ObjectId,
        ref: 'Forum'})
    forum: Types.ObjectId
}
export const ChatSchema = SchemaFactory.createForClass(Chat)