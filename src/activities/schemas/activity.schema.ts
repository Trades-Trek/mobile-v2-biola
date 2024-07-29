import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {User} from "../../users/schemas/user.schema";

@Schema({timestamps:true})
export class Activity {
    @Prop({required:true})
    activity: string;

    @Prop({required:true})
    entity: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    by: User;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
