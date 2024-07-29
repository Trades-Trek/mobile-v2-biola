import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {FeaturesService} from './features.service';
import {CreateFeatureDto} from './dto/create-feature.dto';
import {UpdateFeatureDto} from './dto/update-feature.dto';
import {Public} from "../decorators/public-endpoint.decorator";
import {Types} from "mongoose";

@Controller('features')
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {
    }

    @Public()
    @Post()
    create(@Body() createFeatureDto: CreateFeatureDto) {
        return this.featuresService.create(createFeatureDto);
    }

    @Get()
    getAllFeatures() {
        return this.featuresService.getAllFeatures();
    }

}
