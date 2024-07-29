import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards} from '@nestjs/common';
import {AdminService} from '../services/admin.service';
import {CreateAdminDto} from '../dto/create-admin.dto';
import {UsersService} from "../../users/users.service";
import {GetPagination} from "../../decorators/pagination.decorator";
import {Pagination, PaginationDto} from "../../enums/pagination.enum";
import {Types} from "mongoose";
import {UpdateUserDto} from "../../users/dto/update-user.dto";
import {ChangePasswordDto, WalletDto} from "../dto/change-password.dto";
import {WatchlistService} from "../../watchlist/watchlist.service";
import {returnErrorResponse, successResponse} from "../../utils/response";
import {GetClient} from "../../decorators/user-admin.decorator";
import {UserDocument} from "../../users/schemas/user.schema";
import {WatchlistPriceAlertDto} from "../../watchlist/dto/watchlist.dto";
import {AdminGuard} from "../../guards/admin.guard";
import {TransactionsService} from "../../transactions/transactions.service";
import {ApiTags} from "@nestjs/swagger";

@UseGuards(AdminGuard)
@ApiTags('Admin')
@Controller('admin/users')
export class AdminUserController {
    constructor(private usersService: UsersService, private adminService: AdminService, private watchlistService: WatchlistService, private transactionsService: TransactionsService) {
    }

    @Post('create')
    create(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.create(createAdminDto);
    }

    @Get()
    getAllUsers(@Query() paginationDto: PaginationDto, @GetPagination() pagination: Pagination) {
        return this.usersService.getAllUsers(pagination);
    }

    @Get(':user_id')
    viewUser(@GetClient() user: UserDocument) {
        return successResponse({user});
    }

    @Patch(':user_id')
    update(@GetClient() user: UserDocument, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(user, updateUserDto);
    }

    @Patch('/update-status/:user_id')
    updateUserStatus(@GetClient() user: UserDocument) {
        return this.usersService.updateUserStatus(user);
    }

    @Patch('/change-password/:user_id')
    changePassword(@GetClient() user: UserDocument, @Body() changePasswordDto: ChangePasswordDto) {
        return this.usersService.changePassword(user, changePasswordDto);
    }

    @Delete(':user_id')
    deleteUser(@GetClient() user: UserDocument) {
        return this.usersService.deleteUser(user);
    }

    @Patch('wallet/:user_id')
    async updateWalletBalance(@Body() walletDto: WalletDto, user: UserDocument) {
        await user.updateOne({wallet: {balance: walletDto.amount}})
        return successResponse('updated successfully');
    }

    @Get('/transactions/:user_id')
    async getUserWalletTransactions(@Query() paginationDto: PaginationDto, @GetClient() user: UserDocument, @GetPagination() pagination: Pagination) {
        return await this.transactionsService.getUserTransactions(user, pagination);
    }

    @Get('/watchlist/:user_id')
    async getUserWatchlist(@GetClient() user: UserDocument, @GetPagination() pagination: Pagination) {
        return await this.watchlistService.findAll(user, pagination);
    }

    @Post('watchlist/:user_id/:symbol')
    async addToWatchlist(@Param('symbol') symbol: string, @GetClient() user: UserDocument) {
        return this.watchlistService.create(symbol, user);
    }

    @Patch('watchlist/price-alert/:watchlist_id')
    priceAlert(@Param('watchlist_id') watchlistId: string, @Body() priceAlertDto: WatchlistPriceAlertDto, @GetClient() user: UserDocument) {
        return this.watchlistService.setPriceAlert(watchlistId, priceAlertDto, user);
    }

    @Delete('watchlist/:watchlist_id')
    deleteWatchList(@Param('watchlist_id') watchlistId: Types.ObjectId) {
        return this.watchlistService.deleteUserWatchlist(watchlistId);
    }


}
