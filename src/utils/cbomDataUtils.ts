
import { CBOMData } from '@/data/mockCBOMData';
import { ComponentsDrillDownData } from '@/types/cbom';

export const generateComponentsDrillDown = (
  query: string, 
  componentType: 'libraries' | 'languages',
  cbomData: CBOMData
): ComponentsDrillDownData | null => {
  if (!cbomData) return null;
  
  const componentUsage = new Map();
  
  cbomData.applications.forEach(app => {
    // Process services
    app.services.forEach(service => {
      if (componentType === 'libraries' && service.libraries) {
        service.libraries.forEach(lib => {
          const key = lib.name;
          if (!componentUsage.has(key)) {
            componentUsage.set(key, {
              id: lib.name.toLowerCase().replace(/\s+/g, '-'),
              name: lib.name,
              version: lib.version,
              hasVulnerabilities: lib.algorithms?.includes('deprecated') || false,
              applications: new Set(),
              services: [],
              totalUsages: 0
            });
          }
          
          componentUsage.get(key).applications.add(app.name);
          componentUsage.get(key).services.push({
            serviceName: service.name,
            applicationName: app.name,
            appId: app.id,
            usage: lib.functions || []
          });
          componentUsage.get(key).totalUsages++;
        });
      } else if (componentType === 'languages') {
        const language = service.programmingLanguage;
        if (language) {
          const key = language;
          if (!componentUsage.has(key)) {
            componentUsage.set(key, {
              id: language.toLowerCase().replace(/\s+/g, '-'),
              name: language,
              language: language,
              hasVulnerabilities: false,
              applications: new Set(),
              services: [],
              totalUsages: 0
            });
          }
          
          componentUsage.get(key).applications.add(app.name);
          componentUsage.get(key).services.push({
            serviceName: service.name,
            applicationName: app.name,
            appId: app.id,
            usage: service.libraries?.map(lib => ({
              name: lib.name,
              framework: lib.name,
              purpose: 'Library dependency'
            })) || []
          });
          componentUsage.get(key).totalUsages++;
        }
      }
    });

    // Process hosts (VMs, containers, etc.)
    if (app.hosts) {
      app.hosts.forEach(host => {
        if (componentType === 'libraries' && host.libraries) {
          host.libraries.forEach(lib => {
            const key = lib.name;
            if (!componentUsage.has(key)) {
              componentUsage.set(key, {
                id: lib.name.toLowerCase().replace(/\s+/g, '-'),
                name: lib.name,
                version: lib.version,
                hasVulnerabilities: lib.algorithms?.includes('deprecated') || false,
                applications: new Set(),
                services: [],
                totalUsages: 0
              });
            }
            
            componentUsage.get(key).applications.add(app.name);
            componentUsage.get(key).services.push({
              serviceName: `${host.name} (${host.type})`,
              applicationName: app.name,
              appId: app.id,
              usage: lib.functions || []
            });
            componentUsage.get(key).totalUsages++;
          });
        } else if (componentType === 'languages' && host.programmingLanguage) {
          const language = host.programmingLanguage;
          const key = language;
          if (!componentUsage.has(key)) {
            componentUsage.set(key, {
              id: language.toLowerCase().replace(/\s+/g, '-'),
              name: language,
              language: language,
              hasVulnerabilities: false,
              applications: new Set(),
              services: [],
              totalUsages: 0
            });
          }
          
          componentUsage.get(key).applications.add(app.name);
          componentUsage.get(key).services.push({
            serviceName: `${host.name} (${host.type})`,
            applicationName: app.name,
            appId: app.id,
            usage: host.libraries?.map(lib => ({
              name: lib.name,
              framework: lib.name,
              purpose: 'Host library dependency'
            })) || []
          });
          componentUsage.get(key).totalUsages++;
        }
      });
    }
  });
  
  const components = Array.from(componentUsage.values())
    .map(data => ({
      ...data,
      applicationCount: data.applications.size,
      serviceCount: data.services.length,
      applications: Array.from(data.applications),
      services: data.services
    }))
    .sort((a, b) => b.applicationCount - a.applicationCount);
  
  return {
    query,
    componentType,
    components,
    totalApplications: cbomData.applications.length,
    totalServices: cbomData.applications.reduce((total, app) => total + app.services.length + (app.hosts?.length || 0), 0)
  };
};

export const getFilteredCBOMData = (selectedService: any, cbomData: any, selectedApplication: any) => {
  if (!selectedService || !cbomData || !selectedApplication) return null;
  
  // Handle both services and hosts
  const isHost = selectedService.type && ['vm', 'container', 'bare-metal', 'kubernetes-pod'].includes(selectedService.type);
  
  let cryptoAlgorithms = [];
  let libraries = [];
  
  if (isHost) {
    // For hosts, use their libraries and create mock crypto algorithms
    libraries = selectedService.libraries || [];
    cryptoAlgorithms = libraries.flatMap(lib => 
      lib.algorithms?.map(algoId => ({
        id: algoId,
        name: algoId.toUpperCase(),
        type: 'Unknown',
        keySize: '256-bit',
        riskLevel: 'medium',
        deprecated: false,
        purpose: `Used by ${lib.name}`,
        usageLocations: [{
          file: `${selectedService.name}/${lib.name}`,
          line: 1,
          function: 'main',
          usage: `Host runtime dependency`
        }],
        recommendations: [`Review ${algoId} usage in ${selectedService.name}`]
      })) || []
    );
  } else {
    // For services, use their crypto algorithms and libraries directly
    cryptoAlgorithms = selectedService.cryptoAlgorithms || [];
    libraries = selectedService.libraries || [];
  }
  
  return {
    application: {
      name: selectedService.name,
      version: selectedService.version || '1.0.0',
      riskLevel: selectedService.riskLevel || 'medium'
    },
    cryptoAlgorithms,
    libraries,
    metrics: cbomData.metrics || { secure: 0, warnings: 0, critical: 0 }
  };
};
