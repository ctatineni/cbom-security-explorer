
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, BarChart3 } from 'lucide-react';
import { ComponentsMetrics } from './ComponentsMetrics';
import { ComponentsTreeView } from './ComponentsTreeView';
import { ComponentsSummaryCard } from './ComponentsSummaryCard';
import { ComponentsFilters } from './ComponentsFilters';
import { getRiskBadge } from './ComponentsRiskBadge';
import { useComponentsFiltering } from '@/hooks/useComponentsFiltering';

interface ComponentsDrillDownProps {
  data: {
    query: string;
    componentType: 'libraries' | 'languages';
    components: Array<{
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
    }>;
    totalApplications: number;
    totalServices: number;
  };
}

export const ComponentsDrillDown: React.FC<ComponentsDrillDownProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('metrics');
  
  const {
    searchFilter,
    setSearchFilter,
    minApplicationsFilter,
    setMinApplicationsFilter,
    componentTypeFilter,
    setComponentTypeFilter,
    filteredComponents,
    clearFilters
  } = useComponentsFiltering(data.components);

  return (
    <div className="space-y-6">
      <ComponentsSummaryCard data={data} />

      <Card>
        <CardHeader>
          <CardTitle>Component Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metrics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Metrics & Impact
              </TabsTrigger>
              <TabsTrigger value="components">
                <Package className="h-4 w-4 mr-2" />
                Component Details
                <Badge variant="secondary" className="ml-2 text-xs">{data.components.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <ComponentsMetrics data={data} />
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <ComponentsFilters
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                componentTypeFilter={componentTypeFilter}
                setComponentTypeFilter={setComponentTypeFilter}
                minApplicationsFilter={minApplicationsFilter}
                setMinApplicationsFilter={setMinApplicationsFilter}
                onClear={clearFilters}
              />

              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>
                  Showing {filteredComponents.length} components
                </span>
              </div>

              <div className="space-y-4">
                {filteredComponents.map((component) => (
                  <ComponentsTreeView
                    key={component.id}
                    component={component}
                    getRiskBadge={getRiskBadge}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
