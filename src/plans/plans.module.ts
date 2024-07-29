import {Global, Module} from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Plan, PlanSchema} from "./schemas/plan.schema";
import {PlanFeature, PlanFeatureSchema} from "./schemas/plan_features.schema";
import {Listing, ListingSchema} from "./schemas/listing.schema";
import {PlanListing, PlanListingSchema} from "./schemas/plan_listings.schema";
@Global()
@Module({
  imports:[MongooseModule.forFeature([{name: Plan.name, schema: PlanSchema}, {name:PlanFeature.name, schema:PlanFeatureSchema}, {name:Listing.name, schema:ListingSchema}, {name:PlanListing.name, schema:PlanListingSchema}])],
  controllers: [PlansController],
  providers: [PlansService],
  exports:[PlansService]
})
export class PlansModule {}
