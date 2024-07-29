import {Injectable} from '@nestjs/common';
import {CreateActivityDto} from './dto/create-activity.dto';
import {UpdateActivityDto} from './dto/update-activity.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Activity} from "./schemas/activity.schema";
import {Model, Types} from "mongoose";
import {Pagination} from "../enums/pagination.enum";

@Injectable()
export class ActivitiesService {
    constructor(@InjectModel(Activity.name) private activityModel: Model<Activity>) {
    }

    async create(createActivityDto: CreateActivityDto): Promise<void> {
        await this.activityModel.create(createActivityDto)
    }

    async findAllUserActivities(userId: Types.ObjectId,  pagination: Pagination): Promise<Activity[]> {
        return this.activityModel.find({by: userId}, {}, {limit: pagination.limit, skip: pagination.page});
    }



    findOne(id: Types.ObjectId) {
        return `This action returns a #${id} activity`;
    }

    update(id: number, updateActivityDto: UpdateActivityDto) {
        return `This action updates a #${id} activity`;
    }

    remove(id: number) {
        return `This action removes a #${id} activity`;
    }
}
