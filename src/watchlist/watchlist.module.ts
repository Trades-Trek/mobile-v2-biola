import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Watchlist, WatchlistSchema} from "./schemas/watchlist.schema";

@Module({
  imports:[MongooseModule.forFeature([{name:Watchlist.name, schema:WatchlistSchema}])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
  exports:[WatchlistService]
})
export class WatchlistModule {}
