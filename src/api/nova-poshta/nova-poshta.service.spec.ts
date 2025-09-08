import { Test, TestingModule } from '@nestjs/testing';
import { NovaPoshtaService } from './nova-poshta.service';

describe('NovaPoshtaService', () => {
  let service: NovaPoshtaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NovaPoshtaService],
    }).compile();

    service = module.get<NovaPoshtaService>(NovaPoshtaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
