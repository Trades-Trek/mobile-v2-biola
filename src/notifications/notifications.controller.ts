import {Controller, Get} from "@nestjs/common";
import {ForumService} from "../forum/forum.service";
import {NotificationsService} from "./notifications.service";
import {GetPagination} from "../decorators/pagination.decorator";
import {Pagination} from "../enums/pagination.enum";
import {AuthUser} from "../decorators/user.decorator";
import {User, UserDocument} from "../users/schemas/user.schema";

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationService: NotificationsService) {
    }

    @Get()
    getUserNotifications(@GetPagination() pagination:Pagination, @AuthUser() user:UserDocument){
        return this.notificationService.getUserNotifications(user,pagination)
    }
}