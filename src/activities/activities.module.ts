import {Global, Module} from '@nestjs/common';
import {ActivitiesService} from './activities.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Activity, ActivitySchema} from "./schemas/activity.schema";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{name: Activity.name, schema: ActivitySchema}])],
    providers: [ActivitiesService],
    exports:[ActivitiesService]
})
export class ActivitiesModule {
}
