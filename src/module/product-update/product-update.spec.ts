import { Test, TestingModule } from '@nestjs/testing';
import { ProductUpdate } from './product-update.provider';

describe('ProductUpdate', () => {
  let provider: ProductUpdate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductUpdate],
    }).compile();

    provider = module.get<ProductUpdate>(ProductUpdate);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
