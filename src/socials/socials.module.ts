import {Global, Module} from '@nestjs/common';
import {SocialsService} from './socials.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Social, SocialSchema} from "./schemas/social.schema";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{name: Social.name, schema: SocialSchema}])],
    providers: [SocialsService],
    exports:[SocialsService]
})
export class SocialsModule {
}
