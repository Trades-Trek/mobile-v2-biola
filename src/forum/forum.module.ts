import {Module} from '@nestjs/common';
import {ForumService} from './forum.service';
import {ForumController} from './forum.controller';
import {Forum, ForumSchema} from "./schemas/forum.schema";
import {Chat, ChatSchema} from "./schemas/chat.schema";
import {MongooseModule} from "@nestjs/mongoose";
import {CompetitionsModule} from "../competitions/competitions.module";
import {CompetitionsService} from "../competitions/services/competitions.service";

@Module({
    imports: [CompetitionsModule, MongooseModule.forFeature([{name: Forum.name, schema: ForumSchema}, {
        name: Chat.name,
        schema: ChatSchema
    }])],
    controllers: [ForumController],
    providers: [ForumService],
    exports:[ForumService]
})
export class ForumModule {
}
