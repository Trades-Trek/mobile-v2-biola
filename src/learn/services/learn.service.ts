import {Injectable} from '@nestjs/common';
import {CreateLearnDto} from '../dto/create-learn.dto';
import {UpdateLearnDto} from '../dto/update-learn.dto';
import {InjectModel} from "@nestjs/mongoose";
import {LearnResources} from "../schemas/learn_resources.schema";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../../utils/response";
import {SUCCESS_MESSAGES} from "../../enums/success-messages";
import {Pagination} from "../../enums/pagination.enum";
import {ERROR_MESSAGES} from "../../enums/error-messages";
import {CreateResourceTagDto} from "../dto/resource-tag.dto";
import {ResourceTag} from "../schemas/resource-tags.schema";
import {QuizzesTakenDto} from "../dto/quizzes_taken.dto";
import {User, UserDocument} from "../../users/schemas/user.schema";
import {QuizzesTaken} from "../schemas/quizzes_taken.schema";

@Injectable()
export class LearnService {
    constructor(@InjectModel(LearnResources.name) private learnModel: Model<LearnResources>, @InjectModel(ResourceTag.name) private resourceTagModel: Model<ResourceTag>, @InjectModel(QuizzesTaken.name) private quizTakenModel: Model<QuizzesTaken>) {
    }

    async create(createLearnDto: CreateLearnDto) {
        const copy = JSON.parse(JSON.stringify(createLearnDto));
        delete createLearnDto.tags;
        const learn = await this.learnModel.create(createLearnDto)
        for (const tag of copy.tags) learn.tags.push(tag)
        await learn.save();
        return successResponse(SUCCESS_MESSAGES.LEARN_RESOURCE_CREATED)
    }

    async findAll(categoryId?: Types.ObjectId, pagination?: Pagination) {
        let filter = {};
        if (categoryId) filter = {category_id: categoryId}
        const learnResources = await this.learnModel.find(filter).populate('quizzes').skip(pagination.page).limit(pagination.limit)
        return successResponse({learn_resources: learnResources})

    }

    async findOne(learnResourceId: Types.ObjectId) {
        return this.learnModel.findById(learnResourceId);
    }

    async update(learnResourceId: Types.ObjectId, updateLearnDto: UpdateLearnDto) {
        const learnResource = await this.learnModel.findByIdAndUpdate(learnResourceId, {
            $set: updateLearnDto,
            $addToSet: {tags: {$each: updateLearnDto.tags}}
        }, {new: true})

        return successResponse({learn_resource: learnResource})

    }

    async remove(learnResourceId: Types.ObjectId) {
        if (!await this.learnModel.findByIdAndDelete(learnResourceId)) returnErrorResponse('Learn resource not found')
        return successResponse(SUCCESS_MESSAGES.LEARN_RESOURCE_DELETED)
    }

    async createResourceTag(tagDto: CreateResourceTagDto) {
        const resourceTag = await this.resourceTagModel.create(tagDto)
        return successResponse({resource_tag: resourceTag})
    }

    async getAllResourceTags() {
        return successResponse(await this.resourceTagModel.find())
    }

    async storeQuizzesTaken(quizId: Types.ObjectId, quizzesTakenDto: QuizzesTakenDto, user: UserDocument) {
       if(!await this.quizTakenModel.findOne({user:user.id, quiz_id:quizId})){
           const data = {
               quiz_id: quizId,
               answers: quizzesTakenDto.answers,
               user: user.id,
               score: 0,
               taken_at: Date.now()
           }
           await this.quizTakenModel.create(data)
       }
        return successResponse('recorded successfully')
    }
}

