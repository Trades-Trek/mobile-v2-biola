import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {ForumService} from './forum.service';
import {CreateForumDto} from './dto/create-forum.dto';
import {UpdateForumDto} from './dto/update-forum.dto';
import {AuthUser} from "../decorators/user.decorator";
import {UserDocument} from "../users/schemas/user.schema";
import {Types} from "mongoose";
import {GetPagination} from "../decorators/pagination.decorator";
import {PaginationParameters} from "mongoose-paginate-v2";
import {Pagination} from "../enums/pagination.enum";
import {CreateChatDto} from "./dto/chat.dto";

@Controller('forum')
export class ForumController {
    constructor(private readonly forumService: ForumService) {
    }

    @Post()
    createForum(@Body() createForumDto: CreateForumDto, @AuthUser() user: UserDocument) {
        return this.forumService.create(createForumDto, user);
    }

    @Post('/chats')
    chat(@Body() createChatDto: CreateChatDto, @AuthUser() user: UserDocument) {
        return this.forumService.createChat(user, createChatDto);
    }

    @Get('/:competition_id')
    findAll(@Param('competition_id') competitionId: Types.ObjectId, @GetPagination() pagination: Pagination) {
        return this.forumService.findAll(competitionId, pagination);
    }

    @Get('chats/:forum_id')
    getChats(@Param('forum_id') forumId: Types.ObjectId, @GetPagination() pagination: Pagination) {
        return this.forumService.findAllChat(forumId, pagination);
    }


    @Delete(':forum_id')
    removeForum(@Param('forum_id') forumId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.forumService.removeForum(forumId, user);
    }

    @Delete(':chat_id')
    removeChat(@Param('chat_id') chatId: Types.ObjectId, @AuthUser() user: UserDocument) {
        return this.forumService.deleteChat(chatId, user);
    }


}
