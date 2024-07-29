import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {AuthUser} from "../decorators/user.decorator";
import {User, UserDocument} from "./schemas/user.schema";
import {UpdateSettingsDto} from "./dto/settings.dto";
import {CreatePinDto, UpdatePinDto} from "./dto/pin.dto";
import {SocialsService} from "../socials/socials.service";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private socialService: SocialsService,) {
    }

    // update user info
    @Patch()
    updateProfile(@Body() updateUserDto: UpdateUserDto, @AuthUser() user: UserDocument) {
        return this.usersService.update(user, updateUserDto);
    }

    // update user settings
    @Patch('settings')
    updateSettings(@AuthUser() user: UserDocument, @Body() updateSettingsDto: UpdateSettingsDto) {
        return this.usersService.updateUserSettings(user, updateSettingsDto);
    }

    // create user pin
    @Post('settings/pin')
    createPin(@AuthUser() user: UserDocument, @Body() createPinDto: CreatePinDto) {
        return this.usersService.createUserPin(user, createPinDto);
    }

    @Patch('settings/pin')
    updatePin(@AuthUser() user: UserDocument, @Body() updatePinDto: UpdatePinDto) {
        return this.usersService.updateUserPin(user, updatePinDto);
    }

    // socials
    @Post('/followers/follow/:following_id')
    follow(@AuthUser() follower: UserDocument, @Param('following_id') followingId) {
        return this.socialService.follow(follower, followingId)
    }

    @Post('/followers/unfollow/:following_id')
    unfollow(@AuthUser() follower: UserDocument, @Param('following_id') followingId) {
        return this.socialService.unfollow(follower, followingId)
    }

}
