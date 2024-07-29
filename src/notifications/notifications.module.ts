import {Global, Module} from '@nestjs/common';
import {NotificationsService} from './notifications.service';
import {MongooseModule} from "@nestjs/mongoose";
import {NotificationSchema, Notification} from "./schemas/notification.schema";
import {NotificationsController} from "./notifications.controller";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{name: Notification.name, schema: NotificationSchema}])],
    controllers:[NotificationsController],
    providers: [NotificationsService],
    exports: [NotificationsService]
})
export class NotificationsModule {
}
