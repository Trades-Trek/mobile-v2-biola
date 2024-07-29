import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {LearnService} from './services/learn.service';
import {CreateLearnDto} from './dto/create-learn.dto';
import {UpdateLearnDto} from './dto/update-learn.dto';
import {CategoryService} from "./services/category.service";
import {Types} from "mongoose";
import {GetPagination} from "../decorators/pagination.decorator";
import {Pagination} from "../enums/pagination.enum";
import {CreateCategoryDto, UpdateCategoryDto} from "./dto/create-category.dto";
import {CreateQuizDto} from "./dto/quiz.dto";
import {QuizzesService} from "./services/quizzes.service";
import {ApiConsumes} from "@nestjs/swagger";
import {Public} from "../decorators/public-endpoint.decorator";
import {CreateResourceTagDto} from "./dto/resource-tag.dto";
import {QuizzesTakenDto} from "./dto/quizzes_taken.dto";
import {AuthUser} from "../decorators/user.decorator";
import {User, UserDocument} from "../users/schemas/user.schema";

@Public()
@Controller('learn')
export class LearnController {
    constructor(private readonly learnService: LearnService, private categoryService: CategoryService, private quizzesService: QuizzesService) {
    }

    @Post('/categories')
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get('categories')
    findAllCategories(@GetPagination() pagination: Pagination) {
        return this.categoryService.findAll(pagination);
    }

    @Patch('categories/:category_id')
    updateCategory(@Param('category_id') categoryId: Types.ObjectId, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(categoryId, updateCategoryDto);
    }

    @Delete('categories/:category_id')
    removeCategory(@Param('category_id') categoryId: Types.ObjectId) {
        return this.categoryService.remove(categoryId);
    }

    @Post('/resources')
    create(@Body() createLearnDto: CreateLearnDto) {
        return this.learnService.create(createLearnDto);
    }

    @Get('resources')
    findAll(@Query('category_id') categoryId: Types.ObjectId, @GetPagination() pagination: Pagination) {
        return this.learnService.findAll(categoryId, pagination);
    }

    @Get('resources/:learn_resource_id')
    findOne(@Param('learn_resource_id') learnResourceId: Types.ObjectId) {
        return this.learnService.findOne(learnResourceId);
    }

    @Patch('resources/:learn_resource_id')
    update(@Param('learn_resource_id') learnResourceId: Types.ObjectId, @Body() updateLearnDto: UpdateLearnDto) {
        return this.learnService.update(learnResourceId, updateLearnDto);
    }

    @Delete('resources/:learn_resource_id')
    remove(@Param('learn_resource_id') learnResourceId: Types.ObjectId) {
        return this.learnService.remove(learnResourceId);
    }

    // @ApiConsumes("multipart/form-data")
    @Post('/quizzes')
    createQuiz(@Body() createQuizDto: CreateQuizDto) {
        return this.quizzesService.create(createQuizDto);
    }


    @Get('quizzes')
    findAllQuiz(@Query('learn_resource_id') learnResourceId: Types.ObjectId, @GetPagination() pagination: Pagination) {
        return this.quizzesService.findAll(learnResourceId, pagination);
    }

    @Post('/resource-tags')
    addResourceTags(@Body() tagDto: CreateResourceTagDto) {
        return this.learnService.createResourceTag(tagDto)
    }

    @Get('/resource-tags')
    getAllResourceTags() {
        return this.learnService.getAllResourceTags()
    }

    @Post('quizzes-taken/:quiz_id')
    storeQuizzesTaken(@Param('quiz_id') quizId:Types.ObjectId, @Body() quizzesTakenDto: QuizzesTakenDto, @AuthUser() user:UserDocument) {
        return this.learnService.storeQuizzesTaken(quizId, quizzesTakenDto, user)
    }

}
