import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

export type PROMO_CODE_DOCUMENT = PromoCode & Document;
@Schema({timestamps:true})
export class PromoCode {
    @Prop({required:true})
    name:string

    @Prop({required:false})
    description:string

    @Prop({required:true, unique:true})
    code:string

    @Prop({required:true})
    discount:number

    @Prop({required:true, default:0})
    promo_code_usage_count:number

    @Prop({required:true})
    expire_at:string

    @Prop({required:true})
    start_date:string

    @Prop({required:true, default:true})
    is_active:boolean
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);