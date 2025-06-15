
import { CBOMData } from './types';
import { generateMockApplications } from './mockDataGenerators';

export * from './types';

export const mockCBOMData: CBOMData = {
  applications: generateMockApplications(),
  metrics: {
    secure: 8,
    warnings: 3,
    critical: 2,
  }
};
