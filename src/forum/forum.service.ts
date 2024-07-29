import {Injectable} from '@nestjs/common';
import {CreateForumDto} from './dto/create-forum.dto';
import {UpdateForumDto} from './dto/update-forum.dto';
import {UserDocument} from "../users/schemas/user.schema";
import {CompetitionsService} from "../competitions/services/competitions.service";
import {returnErrorResponse, successResponse} from "../utils/response";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Forum, ForumDocument} from "./schemas/forum.schema";
import {ActivitiesService} from "../activities/activities.service";
import {ACTIVITY_ENTITY, ACTIVITY_MESSAGES} from "../enums/activities.enum";
import {useOneSignalService} from "../services/onesignal";
import {NotificationsService} from "../notifications/notifications.service";
import {Pagination} from "../enums/pagination.enum";
import {CreateChatDto} from "./dto/chat.dto";
import {Chat} from "./schemas/chat.schema";
import {ERROR_MESSAGES} from "../enums/error-messages";
import {SUCCESS_MESSAGES} from "../enums/success-messages";
import pusherService from '../services/pusher'

const Filter = require('bad-words'),
    filter = new Filter();

@Injectable()
export class ForumService {
    constructor(@InjectModel(Forum.name) private forumModel: Model<Forum>, private competitionService: CompetitionsService, private activityService: ActivitiesService, private notificationService: NotificationsService, @InjectModel(Chat.name) private chatModel: Model<Chat>) {
    }

    async create(createForumDto: CreateForumDto, creator?: UserDocument, isAdmin: boolean = false) {
        const {competition_id, topic, description} = createForumDto;
        const competition = await this.competitionService.findOne({'_id': createForumDto.competition_id})
        if (!competition) returnErrorResponse('Competition does not exist');
        // create forum
        const data = {
            competition: competition_id,
            topic,
            description,
            creator: isAdmin ? competition.owner : creator.id
        }
        const forum = await this.forumModel.create(data)
        // log activity
        this.activityService.create({
            activity: ACTIVITY_MESSAGES.CREATED_FORUM,
            by: creator,
            entity: ACTIVITY_ENTITY.COMPETITION
        })
        // dispatch to participants
        this.notifyParticipants(forum)
        return successResponse({forum})
    }

    async notifyParticipants(forum: ForumDocument | Forum): Promise<void> {
        const participants = await this.competitionService.getParticipants(forum.competition)
        if (participants.length) {
            for (const p of participants) {
                if (p.participant) this.notificationService.create({
                    title: 'A new forum has been created',
                    description: 'A new forum has been created',
                    priority: true,
                    user_id: p.participant
                })
            }
        }
    }

    async findAll(competitionId: Types.ObjectId, pagination: Pagination) {
        const count = await this.forumModel.countDocuments({competition: competitionId});
        const forums = await this.forumModel.find({competition: competitionId}).skip(pagination.page).limit(pagination.limit).sort({created_at: -1})
        return successResponse({forums, total_rows:count})
    }

    async createChat(sender: UserDocument, createChatDto: CreateChatDto) {
        const {chat, forum_id, type} = createChatDto;
        if (filter.isProfane(chat)) returnErrorResponse('Chat looks offensive')
        const newChat = await this.chatModel.create({chat, forum: forum_id, type, sender: sender.id})
        await pusherService.dispatchEvent(`private-forum-${forum_id}-chats`, 'on-new-chat', {chat})
        return successResponse({new_chat: newChat})
    }

    async findAllChat(forumId: Types.ObjectId, pagination: Pagination) {
        const count = await this.chatModel.countDocuments({forum: forumId})
        const chats = await this.chatModel.find({forum: forumId}).limit(pagination.limit).skip(pagination.page);
        return successResponse({chats, total_rows: count})
    }

    async removeForum(forumId: Types.ObjectId, user: UserDocument, isAdmin:boolean = false) {
        const forum = await this.forumModel.findById(forumId)
        if (!forum) returnErrorResponse(ERROR_MESSAGES.FORUM_NOT_FOUND)
        if (!isAdmin && forum.creator !== user.id) returnErrorResponse('Unauthorized')
        await forum.deleteOne()
        return successResponse(SUCCESS_MESSAGES.FORUM_DELETED)
    }

    async deleteChat(chatId: Types.ObjectId, user: UserDocument) {
        const chat = await this.chatModel.findOne({'_id': chatId})
        if (!chat) returnErrorResponse(ERROR_MESSAGES.CHAT_NOT_FOUND)
        if (chat.sender !== user.id) returnErrorResponse('Unauthorized')
        await chat.deleteOne()
        await pusherService.dispatchEvent(`private-forum-${chat.forum}-chats`, 'on-delete-chat', {chat})
        return successResponse(SUCCESS_MESSAGES.CHAT_DELETED)
    }
}
