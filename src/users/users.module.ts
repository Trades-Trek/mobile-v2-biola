import {Global, Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schemas/user.schema";
import {ResetPasswordToken, ResetPasswordTokenSchema} from "./schemas/token.schema";
import {OrdersModule} from "../orders/orders.module";
import {CompetitionsModule} from "../competitions/competitions.module";

@Global()
@Module({
    imports: [OrdersModule, CompetitionsModule, MongooseModule.forFeature([{name: User.name, schema: UserSchema}, {name: ResetPasswordToken.name, schema: ResetPasswordTokenSchema}])],
    controllers: [UsersController],
    providers: [UsersService],
    exports:[UsersService]
})
export class UsersModule {
}
