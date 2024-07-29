import {Global, Module} from '@nestjs/common';
import {FeaturesService} from './features.service';
import {FeaturesController} from './features.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Feature, FeatureSchema} from "./schemas/feature.schema";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{name: Feature.name, schema: FeatureSchema}])],
    controllers: [FeaturesController],
    providers: [FeaturesService],
    exports: [FeaturesService]
})
export class FeaturesModule {
}
