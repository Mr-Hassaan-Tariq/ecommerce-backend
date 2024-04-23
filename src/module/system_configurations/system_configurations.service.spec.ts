import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigurationsService } from './system_configurations.service';

describe('SystemConfigurationsService', () => {
  let service: SystemConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemConfigurationsService],
    }).compile();

    service = module.get<SystemConfigurationsService>(SystemConfigurationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
