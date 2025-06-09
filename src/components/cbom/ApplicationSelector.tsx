
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Calendar, Layers, CheckCircle, AlertTriangle } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  version: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastAnalyzed: string;
  services: any[];
}

interface ApplicationSelectorProps {
  applications: Application[];
  selectedApplication: Application | null;
  onApplicationSelect: (application: Application) => void;
}

export const ApplicationSelector: React.FC<ApplicationSelectorProps> = ({
  applications,
  selectedApplication,
  onApplicationSelect
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Shield className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getServiceRiskCounts = (services: any[]) => {
    const counts = { low: 0, medium: 0, high: 0 };
    services.forEach(service => {
      counts[service.riskLevel] = (counts[service.riskLevel] || 0) + 1;
    });
    return counts;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app) => {
          const riskCounts = getServiceRiskCounts(app.services);
          
          return (
            <Card 
              key={app.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedApplication?.id === app.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onApplicationSelect(app)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg truncate">{app.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>v{app.version}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{app.lastAnalyzed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getRiskIcon(app.riskLevel)}
                    <Badge variant={getRiskColor(app.riskLevel)}>
                      {app.riskLevel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      {app.services.length} services
                    </span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant={selectedApplication?.id === app.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplicationSelect(app);
                    }}
                  >
                    {selectedApplication?.id === app.id ? 'Selected' : 'Select'}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div>
                    <div className="font-medium text-green-600">
                      {riskCounts.low}
                    </div>
                    <div className="text-gray-500">Low Risk</div>
                  </div>
                  <div>
                    <div className="font-medium text-yellow-600">
                      {riskCounts.medium}
                    </div>
                    <div className="text-gray-500">Medium</div>
                  </div>
                  <div>
                    <div className="font-medium text-red-600">
                      {riskCounts.high}
                    </div>
                    <div className="text-gray-500">High Risk</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
