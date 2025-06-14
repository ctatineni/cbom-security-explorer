
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ComponentsHeaderProps {
  componentsCount: number;
}

export const ComponentsHeader: React.FC<ComponentsHeaderProps> = ({ componentsCount }) => {
  return (
    <CardHeader>
      <CardTitle>Component Analysis</CardTitle>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="metrics">
          <BarChart3 className="h-4 w-4 mr-2" />
          Metrics & Impact
        </TabsTrigger>
        <TabsTrigger value="components">
          <Package className="h-4 w-4 mr-2" />
          Component Details
          <Badge variant="secondary" className="ml-2 text-xs">{componentsCount}</Badge>
        </TabsTrigger>
      </TabsList>
    </CardHeader>
  );
};
