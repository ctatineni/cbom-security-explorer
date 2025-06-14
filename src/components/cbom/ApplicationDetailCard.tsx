
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Building, ChevronDown, ChevronRight, Layers } from 'lucide-react';

interface ApplicationDetailCardProps {
  component: {
    serviceCount: number;
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
  };
}

export const ApplicationDetailCard: React.FC<ApplicationDetailCardProps> = ({ component }) => {
  // Group services by application
  const servicesByApp = component.services.reduce((acc, service) => {
    if (!acc[service.applicationName]) {
      acc[service.applicationName] = [];
    }
    acc[service.applicationName].push(service);
    return acc;
  }, {} as Record<string, typeof component.services>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Building className="h-4 w-4" />
          Applications ({Object.keys(servicesByApp).length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(servicesByApp).map(([appName, appServices]) => (
            <ApplicationItem 
              key={appName} 
              applicationName={appName} 
              services={appServices} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ApplicationItem: React.FC<{
  applicationName: string;
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
}> = ({ applicationName, services }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border rounded-lg bg-gray-50">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Building className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-sm truncate">{applicationName}</span>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {services.length} services
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleExpanded}
            className="h-6 px-2 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <div className="space-y-2 mt-3 pl-6">
              {services.map((service, serviceIndex) => (
                <ServiceItem key={serviceIndex} service={service} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

const ServiceItem: React.FC<{
  service: {
    serviceName: string;
    applicationName: string;
    appId: string;
    usage: Array<{
      name: string;
      usedIn?: string[];
      purpose?: string;
      framework?: string;
    }>;
  };
}> = ({ service }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border rounded bg-white">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Layers className="h-3 w-3 text-green-600 flex-shrink-0" />
            <span className="text-sm truncate">{service.serviceName}</span>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {service.usage.length} library functions
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleExpanded}
            className="h-6 px-2 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <div className="border-t mt-2 pt-2">
              <div className="space-y-1">
                {service.usage.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center text-xs p-1 bg-gray-50 rounded">
                    <span className="font-mono truncate">{item.name}</span>
                    <span className="text-gray-500 flex-shrink-0 ml-2">
                      {item.purpose || 'Library'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
