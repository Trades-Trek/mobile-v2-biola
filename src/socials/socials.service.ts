import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Social, SocialDocument} from "./schemas/social.schema";
import {Model, Types} from "mongoose";
import {UserDocument} from "../users/schemas/user.schema";
import {UsersService} from "../users/users.service";
import {USER} from "../users/enums/user.enum";
import {returnErrorResponse, successResponse} from "../utils/response";

@Injectable()
export class SocialsService {
    constructor(@InjectModel(Social.name) private socialModel: Model<Social>, private userService: UsersService) {
    }

    async follow(follower: UserDocument, followingId: Types.ObjectId): Promise<any> {
        const following: UserDocument | undefined = await this.userService.findOne({
            field: USER.ID,
            data: followingId,
            fields_to_load: '_id total_followers'
        })
        if (!following) returnErrorResponse('Invalid User');
        await this.socialModel.create({
            following_id: followingId,
            follower: follower,
            follower_id: follower.id,
            following
        })
        this.incrementFollowers(following)
        this.incrementFollowing(follower)
        return successResponse('successful')

    }

    async unfollow(follower: UserDocument, followingId: Types.ObjectId): Promise<any> {
        const following: UserDocument | undefined = await this.userService.findOne({
            field: USER.ID,
            data: followingId,
            fields_to_load: USER.ID
        })
        if (!following) returnErrorResponse('Invalid User');
        await this.socialModel.findOneAndDelete({following_id: followingId, follower_id: follower.id})
        this.decrementFollowers(following)
        this.decrementFollowing(follower)
        return successResponse('unfollowed successfully')
    }

    async incrementFollowers(followed: UserDocument): Promise<boolean> {
        await followed.updateOne({$inc: {total_followers: 1}})
        // dispatch event
        return true;
    }

    async incrementFollowing(follower: UserDocument): Promise<boolean> {
        await follower.updateOne({$inc: {total_following: 1}})
        return true
    }

    async decrementFollowers(followed: UserDocument): Promise<boolean> {
        await followed.updateOne({$inc: {total_followers: -1}})
        return true;
    }

    async decrementFollowing(follower: UserDocument): Promise<boolean> {
        await follower.updateOne({$inc: {total_following: -1}})
        return true
    }

}
