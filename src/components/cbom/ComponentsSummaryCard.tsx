
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface ComponentsSummaryCardProps {
  data: {
    query: string;
    components: any[];
    totalApplications: number;
    totalServices: number;
  };
}

export const ComponentsSummaryCard: React.FC<ComponentsSummaryCardProps> = ({ data }) => {
  const libraryComponents = data.components.filter(comp => comp.isLibrary);
  const languageComponents = data.components.filter(comp => comp.isLanguage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Component Analysis View
        </CardTitle>
        <p className="text-sm text-gray-600">
          Query: "{data.query}"
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.components.length}</div>
            <div className="text-sm text-gray-500">Total Components</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{libraryComponents.length}</div>
            <div className="text-sm text-gray-500">Libraries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{languageComponents.length}</div>
            <div className="text-sm text-gray-500">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.totalApplications}</div>
            <div className="text-sm text-gray-500">Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{data.totalServices}</div>
            <div className="text-sm text-gray-500">Total Services</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
