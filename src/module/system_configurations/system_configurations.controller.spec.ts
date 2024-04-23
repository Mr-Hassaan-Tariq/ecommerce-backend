import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigurationsController } from './system_configurations.controller';

describe('SystemConfigurationsController', () => {
  let controller: SystemConfigurationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemConfigurationsController],
    }).compile();

    controller = module.get<SystemConfigurationsController>(SystemConfigurationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
