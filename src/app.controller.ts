import {Controller, Get, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {ConfigService} from "@nestjs/config";
import {returnErrorResponse, successResponse} from "./utils/response";
import configuration from "./config/configuration";
import client from "./config/client";
import {Public} from "./decorators/public-endpoint.decorator";
import {useEncryptionService} from "./services/aes-encrypt";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private configService: ConfigService) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Public()
    @Get('/config')
    getConfig() {
        return successResponse(client())
    }

    @Public()
    @Post('/test')
    test() {
        try {
            let password = 'ROH/2wzXb4zD2InGdwTzNA=='
            // password = useEncryptionService().encryptData(password, this.configService.get('DATA_ENCRYPTION_KEY'))
            // console.log(password)
            const decryptedPassword = useEncryptionService().decryptData(password, this.configService.get('ENCRYPTION_KEY'))
            console.log(decryptedPassword)
        return successResponse('done')
        } catch (e) {
            console.log(e)
            returnErrorResponse(e)
        }
    }

}
