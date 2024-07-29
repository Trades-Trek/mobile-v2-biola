import { PartialType } from '@nestjs/swagger';
import { WatchlistDto } from './watchlist.dto';

export class UpdateWatchlistDto extends PartialType(WatchlistDto) {}
