import {Prop, Schema, SchemaFactory,} from "@nestjs/mongoose";
import {User, UserDocument} from "../../users/schemas/user.schema";
import {Types} from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

@Schema({timestamps:true})
export class Rating {
    @Prop({ required: true })
    star: number;

    @Prop({ required: false })
    review: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    user: User;


}
export const RatingSchema = SchemaFactory.createForClass(Rating);

RatingSchema.plugin(mongoosePaginate);
