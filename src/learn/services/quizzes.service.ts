import {Injectable} from '@nestjs/common';
import {CreateLearnDto} from '../dto/create-learn.dto';
import {UpdateLearnDto} from '../dto/update-learn.dto';
import {InjectModel} from "@nestjs/mongoose";
import {LearnResourceDocument, LearnResources} from "../schemas/learn_resources.schema";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../../utils/response";
import {SUCCESS_MESSAGES} from "../../enums/success-messages";
import {Pagination} from "../../enums/pagination.enum";
import {Category} from "../schemas/category.schema";
import {CreateCategoryDto, UpdateCategoryDto} from "../dto/create-category.dto";
import {ERROR_MESSAGES} from "../../enums/error-messages";
import {Quiz} from "../schemas/quiz.schema";
import {CreateQuizDto, UpdateQuizDto} from "../dto/quiz.dto";
import {LearnService} from "./learn.service";

@Injectable()
export class QuizzesService {
    constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>, private learnResourceService: LearnService) {
    }

    async create(createQuizDto: CreateQuizDto) {
        // retrieve learn resource
        const learnResource: LearnResourceDocument = await this.learnResourceService.findOne(createQuizDto.learn_resource_id)
        if (!learnResource) returnErrorResponse(ERROR_MESSAGES.LEARN_RESOURCE_NOT_FOUND)
        const quiz = await this.quizModel.create(createQuizDto)
        await learnResource.updateOne({$addToSet: {quizzes: quiz.id}})

        return successResponse(SUCCESS_MESSAGES.QUIZ_CREATED)
    }

    async findAll(learnResourceId?: Types.ObjectId, pagination?: Pagination) {
        let filter = {};
        if (learnResourceId) filter = {learn_resource_id: learnResourceId}
        const count = await this.quizModel.countDocuments(filter)
        const quizzes = await this.quizModel.find(filter).skip(pagination.page).limit(pagination.limit)
        return successResponse({quizzes, total_rows: count})

    }

    findOne(id: number) {
        return `This action returns a #${id} learn`;
    }

    async update(quizId: Types.ObjectId, updateQuizDto: UpdateQuizDto) {
        const learnResource: LearnResourceDocument = await this.learnResourceService.findOne(updateQuizDto.learn_resource_id)
        if (!learnResource) returnErrorResponse(ERROR_MESSAGES.LEARN_RESOURCE_NOT_FOUND)
        const quiz = await this.quizModel.findByIdAndUpdate(quizId, updateQuizDto, {new: true})
        if (!quiz) returnErrorResponse('Quiz not found')
        await learnResource.updateOne({$addToSet: {quizzes: quiz.id}})
        return successResponse({quiz})
    }

    async remove(quizId: Types.ObjectId) {
        if (!await this.quizModel.findByIdAndDelete(quizId)) returnErrorResponse(ERROR_MESSAGES.CATEGORY_NOT_FOUND)
        return successResponse(SUCCESS_MESSAGES.QUIZ_DELETED)
    }
}
