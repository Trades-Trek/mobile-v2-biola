import {Injectable} from '@nestjs/common';
import {UpdateAppSettingsDto} from './dto/create-app-setting.dto';
import {InjectModel} from "@nestjs/mongoose";
import {AppSetting} from "./schemas/app-setting.schema";
import {Model, Types} from "mongoose";

@Injectable()
export class AppSettingsService {
    constructor(@InjectModel(AppSetting.name) private appSettingModel: Model<AppSetting>) {
    }

    async getSettings(): Promise<AppSetting> {
        return await this.appSettingModel.findOne({where: {is_global: true}}).exec() ?? await this.appSettingModel.create({is_global: true});
    }


    async update(id: Types.ObjectId, updateAppSettingsDto: UpdateAppSettingsDto) {

    }


}
