import { Test, TestingModule } from '@nestjs/testing';
import { LearnController } from './learn.controller';
import { LearnService } from './learn.service';

describe('LearnController', () => {
  let controller: LearnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearnController],
      providers: [LearnService],
    }).compile();

    controller = module.get<LearnController>(LearnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
