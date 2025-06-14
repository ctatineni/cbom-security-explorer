
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Building, Layers, Package, Code } from 'lucide-react';

interface ComponentsTreeViewProps {
  component: {
    id: string;
    name: string;
    version?: string;
    language?: string;
    applicationCount: number;
    serviceCount: number;
    applications: string[];
    services: Array<{
      serviceName: string;
      applicationName: string;
      appId: string;
      usage: Array<{
        name: string;
        usedIn?: string[];
        purpose?: string;
        framework?: string;
      }>;
    }>;
    hasVulnerabilities?: boolean;
    riskLevel?: string;
    isLibrary?: boolean;
    isLanguage?: boolean;
  };
  getRiskBadge: (component: any) => React.ReactNode;
}

export const ComponentsTreeView: React.FC<ComponentsTreeViewProps> = ({ component, getRiskBadge }) => {
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  const toggleApplication = (appName: string) => {
    const newExpanded = new Set(expandedApplications);
    if (newExpanded.has(appName)) {
      newExpanded.delete(appName);
    } else {
      newExpanded.add(appName);
    }
    setExpandedApplications(newExpanded);
  };

  const toggleService = (serviceKey: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceKey)) {
      newExpanded.delete(serviceKey);
    } else {
      newExpanded.add(serviceKey);
    }
    setExpandedServices(newExpanded);
  };

  // Group services by application
  const servicesByApp = component.services.reduce((acc, service) => {
    if (!acc[service.applicationName]) {
      acc[service.applicationName] = [];
    }
    acc[service.applicationName].push(service);
    return acc;
  }, {} as Record<string, typeof component.services>);

  return (
    <div className="border rounded-lg">
      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {component.isLibrary ? (
              <Package className="h-5 w-5 text-blue-600" />
            ) : (
              <Code className="h-5 w-5 text-purple-600" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{component.name}</span>
                <Badge variant="outline" className="text-xs">
                  {component.isLibrary ? 'Library' : 'Language'}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                {component.isLibrary 
                  ? `Version ${component.version || 'N/A'}`
                  : `Language: ${component.language || component.name}`
                }
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {getRiskBadge(component)}
            <div className="text-right">
              <div className="text-sm font-medium">{component.applicationCount} apps</div>
              <div className="text-xs text-gray-500">{component.serviceCount} services</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h4 className="font-medium flex items-center gap-2">
          <Building className="h-4 w-4" />
          Applications ({component.applicationCount})
        </h4>
        
        <div className="space-y-2">
          {Object.entries(servicesByApp).map(([appName, appServices]) => (
            <div key={appName} className="border rounded">
              <Collapsible
                open={expandedApplications.has(appName)}
                onOpenChange={() => toggleApplication(appName)}
              >
                <CollapsibleTrigger asChild>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {expandedApplications.has(appName) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">{appName}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {appServices.length} services
                      </Badge>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-3 pb-3 border-t bg-gray-50">
                    <div className="space-y-2 mt-3">
                      {appServices.map((service, serviceIndex) => {
                        const serviceKey = `${appName}-${serviceIndex}`;
                        return (
                          <div key={serviceIndex} className="border rounded bg-white">
                            <Collapsible
                              open={expandedServices.has(serviceKey)}
                              onOpenChange={() => toggleService(serviceKey)}
                            >
                              <CollapsibleTrigger asChild>
                                <div className="p-2 hover:bg-gray-50 cursor-pointer">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {expandedServices.has(serviceKey) ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                      <Layers className="h-3 w-3 text-green-600" />
                                      <span className="text-sm">{service.serviceName}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {service.usage.length} {component.isLibrary ? 'functions' : 'frameworks'}
                                    </Badge>
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent>
                                <div className="px-2 pb-2 border-t">
                                  <div className="space-y-1 mt-2">
                                    {service.usage.map((item, itemIndex) => (
                                      <div key={itemIndex} className="flex justify-between items-center text-xs p-1 bg-gray-50 rounded">
                                        <span className="font-mono">{item.name}</span>
                                        <span className="text-gray-500">
                                          {item.purpose || item.framework || 'N/A'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
