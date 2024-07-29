import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import configuration from "../../config/configuration";
import {SUBSCRIPTION_DURATION} from "../../enums/subscription_duration";
import {DEVICE_TYPES} from "../../enums/device_types";
import mongoose from "mongoose";

@Schema({expires: '5m'})
export class ResetPasswordToken {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user_id: string

    @Prop({required: true})
    token: string

    @Prop({required: true})
    reset_token: string

}

export const ResetPasswordTokenSchema = SchemaFactory.createForClass(ResetPasswordToken);