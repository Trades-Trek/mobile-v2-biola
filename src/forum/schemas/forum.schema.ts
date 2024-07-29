import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

export type ForumDocument = Forum &Document ;
@Schema({timestamps:true})
export class Forum {
    @Prop()
    topic:string

    @Prop({required: true, type: Types.ObjectId,
        ref: 'User'})
    creator: Types.ObjectId

    @Prop({required: true, type: Types.ObjectId,
        ref: 'Competition'})
    competition: Types.ObjectId
}
export const ForumSchema = SchemaFactory.createForClass(Forum)