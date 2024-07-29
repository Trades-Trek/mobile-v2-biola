import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({timestamps:true})
export class PromoCodeUsage {
    @Prop({required:true})
    promo_code_id:string

    @Prop({required:true})
    user_id:string

}

export const PromoCodeUsageSchema = SchemaFactory.createForClass(PromoCodeUsage);