import {Injectable} from '@nestjs/common';
import {CreatePlanDto} from './dto/create-plan.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Plan, PlanDocument} from "./schemas/plan.schema";
import {Model, Types} from "mongoose";
import {successResponse} from "../utils/response";
import {FeaturesService} from "../features/features.service";
import {PlanFeature} from "./schemas/plan_features.schema";
import {CreateListingDto} from "./dto/create-listing.dto";
import {Listing} from "./schemas/listing.schema";
import {PlanListing} from "./schemas/plan_listings.schema";
import {SUCCESS_MESSAGES} from "../enums/success-messages";

@Injectable()
export class PlansService {
    constructor(@InjectModel(Plan.name) private planModel: Model<Plan>, @InjectModel(PlanFeature.name) private planFeatureModel: Model<PlanFeature>, private featureService: FeaturesService, @InjectModel(Listing.name) private listingModel: Model<Listing>, @InjectModel(PlanListing.name) private planListingModel: Model<PlanListing>) {
    }

    async createOrUpdatePlan(createPlanDto: CreatePlanDto, planId?: Types.ObjectId) {
        let plan = planId ? await this.planModel.findById(planId) : await this.planModel.create(createPlanDto);
        // add features
        for (const feature of createPlanDto.features) {
            if (!await this.planFeatureModel.findOne({feature, plan: plan.id})) {
                await this.planFeatureModel.create({plan: plan.id, feature})
            }
        }
        // add listing
        for (const listing of createPlanDto.listings) {
            if (!await this.planListingModel.findOne({listing, plan: plan.id})) {
                await this.planListingModel.create({plan: plan.id, listing})
            }
        }
        return successResponse({plan, message: planId ? SUCCESS_MESSAGES.PLAN_CREATED : SUCCESS_MESSAGES.PLAN_UPDATED})
    }


    async findAll(populateFeatures: boolean = false) {
        const plans = await this.planModel.aggregate().lookup({
            from: 'planlistings',
            localField: '_id', foreignField: 'plan',
            as: 'listings'
        })
        return successResponse({plans})
    }


    async getPlanFeatures(planId: Types.ObjectId) {
        const id = planId.toHexString()
        let planFeatures = await this.featureService.loadFeaturesFromCache(`plan_features_${id}`)
        if (!planFeatures) {
            console.log('no cache')
            planFeatures = await this.planFeatureModel.find({plan: id}).populate('feature');
            this.featureService.addFeaturesToCache(`plan_features_${id}`, planFeatures)
        }
        return planFeatures

    }

    async findOne(filter: {}): Promise<PlanDocument | undefined> {
        return this.planModel.findOne(filter);
    }

    async createListing(createListingDto: CreateListingDto) {
        const listing = await this.listingModel.create(createListingDto)
        return successResponse({listing, message: 'success'})
    }


}
