import { Test, TestingModule } from '@nestjs/testing';
import { ProductUpdateService } from './product-update.service';

describe('ProductUpdateService', () => {
  let service: ProductUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductUpdateService],
    }).compile();

    service = module.get<ProductUpdateService>(ProductUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
