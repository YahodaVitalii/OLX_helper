import { Test, TestingModule } from '@nestjs/testing';
import { NovaPoshtaController } from './nova-poshta.controller';
import { NovaPoshtaService } from './nova-poshta.service';

describe('NovaPoshtaController', () => {
  let controller: NovaPoshtaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NovaPoshtaController],
      providers: [NovaPoshtaService],
    }).compile();

    controller = module.get<NovaPoshtaController>(NovaPoshtaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
