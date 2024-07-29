import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {DEVICE_TYPES} from "../../enums/device_types";
import {Document, Types} from "mongoose";
import {PLAN_TYPE} from "../../enums/plan_type";
import {DEFAULT_CURRENCY} from "../../utils/constant";
import {Role} from "../../enums/role.enum";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required: true, trim: true})
    first_name: string;
    @Prop({required: true, trim: true})
    last_name: string;

    @Prop({required: true})
    full_name: string;

    @Prop({unique: true, trim: true})
    email: string;

    @Prop({default: Role.USER})
    role: string;

    @Prop({required: true, trim: true, unique: true, sparse: true})
    username: string;

    @Prop({required: true, trim: true, select: false})
    password: string;

    @Prop({required:false})
    referral_code: string;

    @Prop({default:'english'})
    language: string;

    @Prop(raw({
        allow_notifications: {type: Boolean, default:true},
        allow_face_id: {type: Boolean, default: false},
        allow_portfolio: {type: Boolean, default: true},
        allow_stock_news: {type: Boolean, default: true},
        allow_price_alerts: {type: Boolean, default: true}
    }))
    settings: Record<string, any>;

    @Prop(raw({
        plan_id: {type: Types.ObjectId, required: false},
        renewal_date: {type: Date, required: false},
        has_expired: {type: Boolean, required: false},
        no_of_days_used: {type: Number, required: false},
        plan_type: {type:String, required: false},
        is_recurring:{type:Boolean, required: false},
    }))
    subscription: Record<string, any>;

    @Prop({default: ''})
    phone: string;

    @Prop({type: Boolean, default: false})
    bvn_verified: boolean;

    @Prop({type: Boolean, default: false})
    phone_verified: boolean;

    @Prop({default: '', required: false})
    referrer_code: string;

    @Prop({default: true, required: false})
    is_first_trek_coins_purchase: boolean;

    @Prop(raw({
        balance: {type: Number, default: 0},
        currency_code: {type: String, default: DEFAULT_CURRENCY.code},
    }))
    wallet: Record<string, any>;

    @Prop({default: 0})

    trek_coin_balance: number;

    @Prop({default: 0})

    pin: number;

    @Prop({default: false})
    has_pin: boolean;


    @Prop({default: false, required:true})
    has_subscribed: boolean;


    @Prop({enum: DEVICE_TYPES, default: DEVICE_TYPES.BROWSER})
    device: string;

    @Prop({required: true, default: 0})
    total_followers: number;

    @Prop({required: true, default: 0})
    total_following: number;

    @Prop({
        default:
            'https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/default-user-avatar.png?alt=media&token=e58679af-a9e8-4d91-b8f5-4587be5dc714',
    })
    profile_pic: string;

    @Prop()
    last_seen: Date;

    @Prop({default: false})
    verified: boolean;

    @Prop({default: true})
    is_active: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);