import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {AppSettingsService} from './app-settings.service';
import {UpdateAppSettingDto} from './dto/update-app-setting.dto';
import {successResponse} from "../utils/response";
import {Types} from "mongoose";

@Controller('app-settings')
export class AppSettingsController {
    constructor(private readonly appSettingsService: AppSettingsService) {
    }


    @Get()
    async getAppSettings() {
        return successResponse(await this.appSettingsService.getSettings())
    }

    @Patch(':id')
    update(@Param('id') id: Types.ObjectId, @Body() updateAppSettingDto: UpdateAppSettingDto) {
        return this.appSettingsService.update(id, updateAppSettingDto);
    }

}
