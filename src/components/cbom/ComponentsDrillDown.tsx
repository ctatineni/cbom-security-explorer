
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Building, AlertTriangle, CheckCircle, Search, Filter, BarChart3 } from 'lucide-react';
import { ComponentsMetrics } from './ComponentsMetrics';
import { ComponentsTreeView } from './ComponentsTreeView';

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
  const [searchFilter, setSearchFilter] = useState('');
  const [minApplicationsFilter, setMinApplicationsFilter] = useState('');
  const [componentTypeFilter, setComponentTypeFilter] = useState<'all' | 'libraries' | 'languages'>('all');

  const filteredComponents = data.components.filter(component => {
    const matchesSearch = !searchFilter || 
      component.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      component.applications.some(app => app.toLowerCase().includes(searchFilter.toLowerCase()));
    
    const matchesMinApps = !minApplicationsFilter || 
      component.applicationCount >= parseInt(minApplicationsFilter);
    
    const matchesComponentType = componentTypeFilter === 'all' || 
      (componentTypeFilter === 'libraries' && component.isLibrary) ||
      (componentTypeFilter === 'languages' && component.isLanguage);
    
    return matchesSearch && matchesMinApps && matchesComponentType;
  });

  const getRiskBadge = (component: any) => {
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

  const libraryComponents = data.components.filter(comp => comp.isLibrary);
  const languageComponents = data.components.filter(comp => comp.isLanguage);

  return (
    <div className="space-y-6">
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
              <div className="text-2xl font-bold text-red-600">
                {data.components.filter(comp => comp.hasVulnerabilities).length}
              </div>
              <div className="text-sm text-gray-500">High Risk Items</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              {/* Filters */}
              <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Search Components</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search components or applications..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <label className="text-sm font-medium mb-2 block">Component Type</label>
                  <select
                    value={componentTypeFilter}
                    onChange={(e) => setComponentTypeFilter(e.target.value as 'all' | 'libraries' | 'languages')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Components</option>
                    <option value="libraries">Libraries Only</option>
                    <option value="languages">Languages Only</option>
                  </select>
                </div>
                <div className="w-48">
                  <label className="text-sm font-medium mb-2 block">Min Applications</label>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    value={minApplicationsFilter}
                    onChange={(e) => setMinApplicationsFilter(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchFilter('');
                      setMinApplicationsFilter('');
                      setComponentTypeFilter('all');
                    }}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Showing {filteredComponents.length} of {data.components.length} components
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
