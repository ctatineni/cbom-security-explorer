
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Layers, Package } from 'lucide-react';

interface ApplicationDetailModalProps {
  application: {
    name: string;
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
  } | null;
  open: boolean;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  open,
  onClose
}) => {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            {application.name}
            <Badge variant="outline" className="text-xs">
              Application
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Application Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Application Name:</span>
                    <span className="text-sm font-medium">{application.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Services:</span>
                    <span className="text-sm font-medium">{application.services.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Library Functions:</span>
                    <span className="text-sm font-medium">
                      {application.services.reduce((total, service) => total + service.usage.length, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Services ({application.services.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {application.services.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm">{service.serviceName}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {service.usage.length} library functions
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600 mb-2">Library Functions:</div>
                      <div className="grid grid-cols-1 gap-2">
                        {service.usage.map((usage, usageIndex) => (
                          <div key={usageIndex} className="flex justify-between items-center text-xs p-2 bg-white rounded border">
                            <span className="font-mono font-medium">{usage.name}</span>
                            <span className="text-gray-500">
                              {usage.purpose || usage.framework || 'N/A'}
                            </span>
                          </div>
                        ))}
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
