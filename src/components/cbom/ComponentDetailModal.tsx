
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Code, Building, Layers, AlertTriangle, CheckCircle } from 'lucide-react';

interface ComponentDetailModalProps {
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
  } | null;
  open: boolean;
  onClose: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  component,
  open,
  onClose
}) => {
  if (!component) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {component.isLibrary ? (
              <Package className="h-5 w-5 text-blue-600" />
            ) : (
              <Code className="h-5 w-5 text-purple-600" />
            )}
            {component.name}
            <Badge variant="outline" className="text-xs">
              {component.isLibrary ? 'Library' : 'Language'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Component Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium">
                      {component.isLibrary ? 'Library' : 'Language'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Version:</span>
                    <span className="text-sm font-medium">
                      {component.version || 'N/A'}
                    </span>
                  </div>
                  {component.language && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Language:</span>
                      <span className="text-sm font-medium">{component.language}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Applications:</span>
                    <span className="text-sm font-medium">{component.applicationCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Services:</span>
                    <span className="text-sm font-medium">{component.serviceCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Security:</span>
                    <div className="flex items-center gap-2">
                      {component.hasVulnerabilities ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">
                        {component.hasVulnerabilities ? 'Has Issues' : 'Clean'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {component.riskLevel && (
                <div className={`p-3 rounded-lg border ${getRiskColor(component.riskLevel)}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{component.riskLevel} Risk</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Applications Using This Component */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building className="h-4 w-4" />
                Applications ({component.applicationCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {component.applications.map((app, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {app}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services Details */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
