import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import {AuthModule} from "../auth/auth.module";
import {WatchlistModule} from "../watchlist/watchlist.module";
import {AdminUserController} from "./controllers/admin-user.controller";
import {AdminPlanController} from "./controllers/admin-plan.controller";
import {CompetitionsModule} from "../competitions/competitions.module";
import {RatingsModule} from "../ratings/ratings.module";
import {ForumModule} from "../forum/forum.module";

@Module({
  imports:[RatingsModule, ForumModule, AuthModule, WatchlistModule, CompetitionsModule],
  controllers: [AdminController, AdminUserController, AdminPlanController],
  providers: [AdminService],
})
export class AdminModule {}
