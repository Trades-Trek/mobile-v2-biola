import {Module} from '@nestjs/common';
import {LearnService} from './services/learn.service';
import {LearnController} from './learn.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Category, CategorySchema} from "./schemas/category.schema";
import {LearnResources, LearnResourcesSchema} from "./schemas/learn_resources.schema";
import {Quiz, QuizSchema} from "./schemas/quiz.schema";
import {CategoryService} from "./services/category.service";
import {QuizzesService} from "./services/quizzes.service";
import {QuizzesTaken, QuizzesTakenSchema} from "./schemas/quizzes_taken.schema";
import {ResourceTag, ResourceTagSchema} from "./schemas/resource-tags.schema";

@Module({
    imports: [MongooseModule.forFeature([{name: Category.name, schema: CategorySchema}, {
        name: Category.name,
        schema: CategorySchema
    }, {name: LearnResources.name, schema: LearnResourcesSchema}, {
        name: Quiz.name,
        schema: QuizSchema
    }, {
        name: QuizzesTaken.name,
        schema: QuizzesTakenSchema
    }, {
        name: ResourceTag.name,
        schema: ResourceTagSchema
    }])],
    controllers: [LearnController],
    providers: [LearnService, CategoryService, QuizzesService],
})
export class LearnModule {
}
