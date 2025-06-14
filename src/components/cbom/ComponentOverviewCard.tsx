
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ComponentOverviewCardProps {
  component: {
    isLibrary?: boolean;
    version?: string;
    language?: string;
    applicationCount: number;
    serviceCount: number;
    hasVulnerabilities?: boolean;
    riskLevel?: string;
  };
}

export const ComponentOverviewCard: React.FC<ComponentOverviewCardProps> = ({ component }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
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
  );
};
