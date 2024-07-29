import {IsNotEmpty} from "class-validator";

export class UpdateSettingsDto {
    @IsNotEmpty()
    allow_face_id: boolean;
    @IsNotEmpty()
    allow_notifications: boolean;
    @IsNotEmpty()
    allow_portfolio: boolean;
    @IsNotEmpty()
    allow_stock_news: boolean;
    @IsNotEmpty()
    allow_price_alerts: boolean

}
