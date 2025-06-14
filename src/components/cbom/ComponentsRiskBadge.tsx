
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const getRiskBadge = (component: any) => {
  if (component.hasVulnerabilities) {
    return (
      <Badge variant="destructive" className="text-xs">
        <AlertTriangle className="h-3 w-3 mr-1" />
        High Risk
      </Badge>
    );
  }
  
  if (component.riskLevel === 'medium') {
    return (
      <Badge className="text-xs bg-yellow-500">
        Medium Risk
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="text-xs">
      <CheckCircle className="h-3 w-3 mr-1" />
      Low Risk
    </Badge>
  );
};
