
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';

interface ComponentApplicationsCardProps {
  component: {
    applicationCount: number;
    applications: string[];
  };
}

export const ComponentApplicationsCard: React.FC<ComponentApplicationsCardProps> = ({ component }) => {
  return (
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
  );
};
