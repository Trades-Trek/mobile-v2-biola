import {Inject, Injectable} from '@nestjs/common';
import {CreateFeatureDto} from './dto/create-feature.dto';
import {UpdateFeatureDto} from './dto/update-feature.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Feature} from "./schemas/feature.schema";
import {Model, Types} from "mongoose";
import {featuresList, useSlugify} from "../utils/constant";
import {successResponse} from "../utils/response";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from 'cache-manager'

@Injectable()
export class FeaturesService {
    constructor(@InjectModel(Feature.name) private featureModel: Model<Feature>, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    async create(createFeatureDto: CreateFeatureDto) {

        for (const feature of featuresList) {
            createFeatureDto['enum_key'] = useSlugify(feature, '_').toUpperCase()
            createFeatureDto['name'] = feature;
            createFeatureDto['slug'] = useSlugify(feature)
            if (!await this.featureModel.findOne({slug: createFeatureDto['slug']})) {
                await this.featureModel.create(createFeatureDto)
            }
        }
        return successResponse('successful');
    }


    async loadFeaturesFromCache(name) {
        return await this.cacheManager.get(name);
    }

    async addFeaturesToCache(name, value):Promise<void>{
        await this.cacheManager.set(name, value, 120000)
    }

    async getAllFeatures() {
        const features = await this.featureModel.find();
        return successResponse({features})
    }

    async remove(featureId: Types.ObjectId) {
        await this.featureModel.findOneAndDelete({'_id': featureId})
        return successResponse('feature deleted successfully');
    }

}
