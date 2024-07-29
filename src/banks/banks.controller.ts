import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {BanksService} from './banks.service';

@Controller('banks')
export class BanksController {
    constructor(private readonly banksService: BanksService) {
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.banksService.findOne(+id);
    }

}
