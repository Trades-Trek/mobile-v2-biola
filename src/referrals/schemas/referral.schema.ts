/* eslint-disable prettier/prettier */
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import  {Document, Types} from 'mongoose';
import {User} from "../../users/schemas/user.schema";

export type ReferralDocument = Referral & Document;
@Schema({timestamps: true})
export class Referral {

    @Prop({type: Types.ObjectId, ref: 'User'})
    referrer: User;
    @Prop({unique:true})
    email: string;

    @Prop({required: true})
    referrer_id: Types.ObjectId;

    @Prop({default: false})
    joined: boolean

    @Prop({default: false})
    joined_date: string

    @Prop({default: 0})
    amount_earned: number


}

export const RefferalSchema = SchemaFactory.createForClass(Referral);
// RefferalSchema.plugin(mongoosePaginate);
