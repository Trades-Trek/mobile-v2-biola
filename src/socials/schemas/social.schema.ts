import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {User} from "../../users/schemas/user.schema";

export type SocialDocument = Social & Document;

@Schema({timestamps: true})
export class Social {
    @Prop({type:Types.ObjectId, ref:'User'})
    follower: User;
    @Prop({required: true, type:Types.ObjectId, ref:'User'})
    following: User;
    @Prop({type:Types.ObjectId})
    follower_id: Types.ObjectId;

    @Prop({type:Types.ObjectId})
    following_id: Types.ObjectId;

}

export const SocialSchema = SchemaFactory.createForClass(Social);