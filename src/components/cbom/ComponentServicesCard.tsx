
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';

interface ComponentServicesCardProps {
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

export const ComponentServicesCard: React.FC<ComponentServicesCardProps> = ({ component }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Services ({component.serviceCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {component.services.map((service, index) => (
            <div key={index} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">{service.serviceName}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {service.applicationName}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-gray-600 mb-2">
                  Library Usage ({service.usage.length} functions):
                </div>
                <div className="flex flex-wrap gap-1">
                  {service.usage.slice(0, 5).map((usage, usageIndex) => (
                    <Badge key={usageIndex} variant="secondary" className="text-xs">
                      {usage.name}
                    </Badge>
                  ))}
                  {service.usage.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.usage.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
