import {Injectable} from '@nestjs/common';
import {CreateLearnDto} from '../dto/create-learn.dto';
import {UpdateLearnDto} from '../dto/update-learn.dto';
import {InjectModel} from "@nestjs/mongoose";
import {LearnResources} from "../schemas/learn_resources.schema";
import {Model, Types} from "mongoose";
import {returnErrorResponse, successResponse} from "../../utils/response";
import {SUCCESS_MESSAGES} from "../../enums/success-messages";
import {Pagination} from "../../enums/pagination.enum";
import {Category} from "../schemas/category.schema";
import {CreateCategoryDto, UpdateCategoryDto} from "../dto/create-category.dto";
import {ERROR_MESSAGES} from "../../enums/error-messages";

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {
    }

    async create(createCategoryDto: CreateCategoryDto) {
        await this.categoryModel.create(createCategoryDto)
        return successResponse(SUCCESS_MESSAGES.CATEGORY_CREATED)
    }

    async findAll(pagination?: Pagination) {
        const count = await this.categoryModel.countDocuments({})
        const categories = await this.categoryModel.find().skip(pagination.page).limit(pagination.limit)
        return successResponse({categories, total_rows: count})

    }

    findOne(id: number) {
        return `This action returns a #${id} learn`;
    }

    async update(categoryId: Types.ObjectId, updateLearnDto: UpdateCategoryDto) {
        const category = await this.categoryModel.findByIdAndUpdate(categoryId, updateLearnDto, {new: true})
        if(!category) returnErrorResponse(ERROR_MESSAGES.CATEGORY_NOT_FOUND)
        return successResponse({category})
    }

    async remove(categoryId: Types.ObjectId) {
        if (!await this.categoryModel.findByIdAndDelete(categoryId)) returnErrorResponse(ERROR_MESSAGES.CATEGORY_NOT_FOUND)
        return successResponse(SUCCESS_MESSAGES.CATEGORY_DELETED)
    }
}
