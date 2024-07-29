import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {AdminService} from '../services/admin.service';
import {CreateAdminDto} from '../dto/create-admin.dto';
import {UpdateAdminDto} from '../dto/update-admin.dto';
import {LoginDto} from "../../auth/dto/login.dto";
import {Public} from "../../decorators/public-endpoint.decorator";
import {AuthUser} from "../../decorators/user.decorator";
import {User} from "../../users/schemas/user.schema";
import {AuthService} from "../../auth/auth.service";
import {AuthId} from "../../decorators/user_id.decorator";
import {Types} from "mongoose";
import {ApiTags} from "@nestjs/swagger";
import {CreatePlanDto} from "../../plans/dto/create-plan.dto";
import {successResponse} from "../../utils/response";
import {CreateListingDto} from "../../plans/dto/create-listing.dto";
import {PlansService} from "../../plans/plans.service";

@ApiTags('Admin')
@Controller('admin/plans')
export class AdminPlanController {
    constructor(private readonly adminService: AdminService, private planService: PlansService) {
    }

    @Post()
    create(@Body() createPlanDto: CreatePlanDto) {
        return this.planService.createOrUpdatePlan(createPlanDto);
    }

    @Get()
    findAll() {
        return this.planService.findAll();
    }

    @Patch(':plan_id')
    update(@Param('plan_id') planId: Types.ObjectId, @Body() createPlanDto: CreatePlanDto) {
        return this.planService.createOrUpdatePlan(createPlanDto, planId);
    }

    @Post('listing')
    async createListing(@Body() createListingDto: CreateListingDto) {
        await this.planService.createListing(createListingDto);
        return successResponse('listing created successfully')
    }


}
