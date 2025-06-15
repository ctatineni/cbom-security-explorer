
import { Application, Host, Service, CBOMData } from './types';
import { sampleCryptoAlgorithms } from './sampleCryptoAlgorithms';
import { sampleLibraries } from './sampleLibraries';
import { sampleProgrammingLanguages } from './sampleProgrammingLanguages';
import { sampleCodePatterns, sampleRecommendations } from './sampleCodePatterns';

const generateMockHosts = (applicationId: string, appIndex: number): Host[] => {
  const hosts: Host[] = [];
  const hostCount = Math.floor(Math.random() * 5) + 2;
  const hostTypes = ['vm', 'container', 'bare-metal', 'kubernetes-pod'] as const;
  const osTypes = ['Ubuntu 20.04', 'CentOS 8', 'Alpine Linux', 'Windows Server 2019', 'RHEL 8'];
  
  for (let i = 0; i < hostCount; i++) {
    const hostType = hostTypes[Math.floor(Math.random() * hostTypes.length)];
    const riskLevels = ['low', 'medium', 'high'] as const;
    
    const hostLibraries = sampleLibraries
      .filter(() => Math.random() > 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    // Use language name string instead of object
    const hostLanguage = Math.random() > 0.3 ? 
      sampleProgrammingLanguages[Math.floor(Math.random() * sampleProgrammingLanguages.length)].name : 
      undefined;
    
    const host: Host = {
      id: `host-${applicationId}-${i}`,
      name: `${hostType}-${i + 1}`,
      type: hostType,
      description: `${hostType.charAt(0).toUpperCase() + hostType.slice(1)} hosting application components`,
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      applicationId,
      libraries: hostLibraries,
      lastScanned: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ipAddress: `192.168.${appIndex + 1}.${i + 10}`,
      operatingSystem: osTypes[Math.floor(Math.random() * osTypes.length)],
      programmingLanguage: hostLanguage
    };
    
    if (hostType === 'container') {
      host.containerImage = `app-${appIndex}:${Math.floor(Math.random() * 10) + 1}.0`;
    }
    
    if (hostType === 'kubernetes-pod') {
      host.kubernetesNamespace = `app-${appIndex}-ns`;
    }
    
    hosts.push(host);
  }
  
  return hosts;
};

export const generateMockApplications = (): Application[] => {
  const applications: Application[] = [];
  const appNames = ['E-Commerce Platform', 'Banking System', 'Healthcare Portal', 'IoT Management'];
  const riskLevels = ['low', 'medium', 'high'] as const;
  
  appNames.forEach((appName, appIndex) => {
    const serviceCount = Math.floor(Math.random() * 8) + 3;
    const services: Service[] = [];
    
    for (let i = 0; i < serviceCount; i++) {
      const serviceTypes = ['Auth', 'Payment', 'Data', 'API', 'Cache', 'Storage', 'Analytics', 'Notification'];
      const type = serviceTypes[i % serviceTypes.length];
      const pqcCompatible = Math.random() > 0.4;
      
      // Use language name string instead of object
      const serviceLanguage = sampleProgrammingLanguages[Math.floor(Math.random() * sampleProgrammingLanguages.length)].name;
      
      const serviceCryptoAlgorithms = sampleCryptoAlgorithms
        .filter(() => Math.random() > 0.3)
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      const serviceLibraries = sampleLibraries
        .filter(() => Math.random() > 0.4)
        .slice(0, Math.floor(Math.random() * 2) + 1);
      
      const serviceCodePatterns = sampleCodePatterns
        .filter(() => Math.random() > 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 1);
      
      const serviceRecommendations = sampleRecommendations
        .filter(() => Math.random() > 0.4)
        .slice(0, Math.floor(Math.random() * 2) + 1);
      
      services.push({
        id: `app-${appIndex}-service-${i}`,
        name: `${type} Service ${Math.floor(i / serviceTypes.length) + 1}`,
        version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        description: `${appName} ${type.toLowerCase()} service handling critical operations`,
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        programmingLanguage: serviceLanguage,
        pqcCompatible,
        applicationId: `app-${appIndex}`,
        cryptoAlgorithms: serviceCryptoAlgorithms,
        libraries: serviceLibraries,
        codePatterns: serviceCodePatterns,
        recommendations: serviceRecommendations
      });
    }
    
    const hosts = generateMockHosts(`app-${appIndex}`, appIndex);
    
    applications.push({
      id: `app-${appIndex}`,
      name: appName,
      version: `${Math.floor(Math.random() * 3) + 1}.0.0`,
      description: `Enterprise ${appName.toLowerCase()} with comprehensive security features`,
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      lastAnalyzed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      services,
      hosts
    });
  });
  
  return applications;
};
