import {Global, Module} from '@nestjs/common';
import {AppSettingsService} from './app-settings.service';
import {AppSettingsController} from './app-settings.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {AppSetting, AppSettingsSchema} from "./schemas/app-setting.schema";

@Global()
@Module({
    imports:[MongooseModule.forFeature([{name:AppSetting.name, schema:AppSettingsSchema}])],
    controllers: [AppSettingsController],
    providers: [AppSettingsService],
    exports:[AppSettingsService]
})
export class AppSettingsModule {
}
