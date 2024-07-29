import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
@Schema({timestamps:true})
export class AppSetting {
    @Prop({required:true, default:500000})
    STARTING_CASH:number

    @Prop({required:true, type:Boolean, default:true})
    is_global:boolean

    @Prop({required:true, default:250, type:Number})
    REFERRAL_REWARD:number


    @Prop({required:true, default:0, type:Number})
    REWARD_USERS_RATING:number


    @Prop({required:true, default:10, type:Number})
    RATING_REWARD:number


    @Prop({required:true, default:1000, type:Number})
    MIN_STARTING_CASH:number

    @Prop({required:true, default:20000, type:Number})
    MAX_STARTING_CASH:number

    @Prop({required:true, default:1, type:Number})
    CAPACITY_FEE:number


    @Prop({required:true, default:1000, type:Number})
    TREK_COINS_CONVERSION_RATE_IN_NAIRA:number


}
export const AppSettingsSchema = SchemaFactory.createForClass(AppSetting);
