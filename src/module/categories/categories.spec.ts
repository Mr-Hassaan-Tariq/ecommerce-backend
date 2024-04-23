import { Test, TestingModule } from '@nestjs/testing';
import { CategoryProvider } from './categories.providor';

describe('Category', () => {
  let provider: CategoryProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryProvider],
    }).compile();

    provider = module.get<CategoryProvider>(CategoryProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
