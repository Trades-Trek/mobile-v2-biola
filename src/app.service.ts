import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {RollbarLogger} from "nestjs-rollbar";

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(private configService: ConfigService, private readonly rollbarLogger: RollbarLogger) {
    }

    getHello(): string {
        console.log(this.configService.get('DB_URL'))
        return 'Hello World!';
    }

    onApplicationBootstrap(): any {
        this.rollbarLogger.info('Application bootstrapped successfully',)
    }
}
