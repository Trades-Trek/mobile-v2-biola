import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {AdminService} from '../services/admin.service';
import {UpdateAdminDto} from '../dto/update-admin.dto';
import {LoginDto} from "../../auth/dto/login.dto";
import {Public} from "../../decorators/public-endpoint.decorator";
import {AuthUser} from "../../decorators/user.decorator";
import {User, UserDocument} from "../../users/schemas/user.schema";
import {AuthService} from "../../auth/auth.service";
import {AuthId} from "../../decorators/user_id.decorator";
import {Types} from "mongoose";
import {ApiTags} from "@nestjs/swagger";
import {Pagination, PaginationDto} from "../../enums/pagination.enum";
import {GetPagination} from "../../decorators/pagination.decorator";
import {TransactionsService} from "../../transactions/transactions.service";
import {TransactionQueryDto} from "../../transactions/dto/create-transaction.dto";
import {ReferralsService} from "../../referrals/referrals.service";
import {ReferralQueryDto} from "../../referrals/dto/referral.dto";
import {CompanyService} from "../../stock/services/company.service";
import {RatingsService} from "../../ratings/ratings.service";
import {CreateForumDto} from "../../forum/dto/create-forum.dto";
import {ForumService} from "../../forum/forum.service";
import {SendPushNotificationDto} from "../../notifications/dto/create-notification.dto";

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService, private authService: AuthService, private transactionService: TransactionsService, private referralService: ReferralsService, private companyService: CompanyService, private ratingsService: RatingsService, private forumService: ForumService) {
    }

    @Public()
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.adminService.login(loginDto);
    }


    @Get('auth')
    auth(@AuthId() userId: Types.ObjectId) {
        return this.authService.authUser(userId);
    }

    @Get('transactions')
    transactions(@Query() query: TransactionQueryDto, @GetPagination() pagination) {
        return this.transactionService.getAllTransactions(query, pagination)
    }

    @Get('referrals')
    referrals(@Query() query: ReferralQueryDto, @GetPagination() pagination) {
        return this.referralService.getAllReferrals(query, pagination)
    }

    @Get('/stocks')
    getStocks(@Query() query: PaginationDto, @GetPagination() pagination: Pagination) {
        return this.companyService.findAll(pagination);
    }

    @Patch('stocks')
    updateStock() {

    }

    @Get('ratings')
    getRatings(@Query() query: PaginationDto, @GetPagination() pagination: Pagination) {
        return this.ratingsService.getAllRatings(pagination);
    }

    @Post('forums')
    createForum(@Body() createForumDto: CreateForumDto, @AuthUser() user: UserDocument) {
        return this.forumService.create(createForumDto, user, true);
    }

    @Get('forums/:competition_id')
    getCompetitionForums(@Param('competition_id') competitionId: Types.ObjectId, @GetPagination() pagination: Pagination) {
        return this.forumService.findAll(competitionId, pagination);
    }
    @Delete('forums/:forum_id')
    removeForum(@Param('forum_id') forumId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.forumService.removeForum(forumId, user, true);
    }

    @Get('forums/chats/:forum_id')
    getChats(@Param('forum_id') forumId: Types.ObjectId, @GetPagination() pagination: Pagination) {
        return this.forumService.findAllChat(forumId, pagination);
    }

    @Post('/push-notifications')
    sendNotification(@Body() sendPushDto:SendPushNotificationDto){
        return this.adminService.sendPushNotification(sendPushDto)
    }

    @Get('/push-notifications')
    getPushNotifications(){

    }


}
