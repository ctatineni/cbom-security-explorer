
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ComponentsMetrics } from './ComponentsMetrics';
import { ComponentsSummaryCard } from './ComponentsSummaryCard';
import { ComponentsHeader } from './ComponentsHeader';
import { ComponentsTabContent } from './ComponentsTabContent';

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

  return (
    <div className="space-y-6">
      <ComponentsSummaryCard data={data} />

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ComponentsHeader componentsCount={data.components.length} />

          <CardContent>
            <TabsContent value="metrics" className="space-y-4">
              <ComponentsMetrics data={data} />
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <ComponentsTabContent components={data.components} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};
