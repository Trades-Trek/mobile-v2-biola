import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { ReferralDto } from './dto/referral.dto';
import {AuthUser} from "../decorators/user.decorator";
import {User, UserDocument} from "../users/schemas/user.schema";

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  create(@AuthUser() referrer:UserDocument, @Body() createReferralDto: ReferralDto) {
    return this.referralsService.referAFriend(referrer,createReferralDto);
  }

  @Get()
  findAll(@AuthUser() user:UserDocument) {
    return this.referralsService.findAll(user);
  }


}
