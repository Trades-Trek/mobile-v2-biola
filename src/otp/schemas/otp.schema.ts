/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ expires: '2m' })
export class Otp {
    @Prop({ required: true, trim: true })
    email: string;

    @Prop({ required: false })
    phone: string;

    @Prop({ required: true, trim: true })
    otp: number;


    @Prop({ default: Date.now, trim: true })
    createdAt: Date;
}
export const OtpSchema = SchemaFactory.createForClass(Otp);
