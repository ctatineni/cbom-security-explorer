
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronRight, Package, Building, Layers, AlertTriangle, CheckCircle, Search, Code, Filter, BarChart3 } from 'lucide-react';
import { ComponentsMetrics } from './ComponentsMetrics';

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
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [searchFilter, setSearchFilter] = useState('');
  const [minApplicationsFilter, setMinApplicationsFilter] = useState('');
  const [componentTypeFilter, setComponentTypeFilter] = useState<'all' | 'libraries' | 'languages'>('all');

  const toggleComponent = (componentId: string) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(componentId)) {
      newExpanded.delete(componentId);
    } else {
      newExpanded.add(componentId);
    }
    setExpandedComponents(newExpanded);
  };

  const toggleService = (serviceKey: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceKey)) {
      newExpanded.delete(serviceKey);
    } else {
      newExpanded.add(serviceKey);
    }
    setExpandedServices(newExpanded);
  };

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
                  <div key={component.id} className="border rounded-lg">
                    <Collapsible
                      open={expandedComponents.has(component.id)}
                      onOpenChange={() => toggleComponent(component.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="p-4 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {expandedComponents.has(component.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              {component.isLibrary ? (
                                <Package className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Code className="h-5 w-5 text-purple-600" />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{component.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {component.isLibrary ? 'Library' : 'Language'}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {component.isLibrary 
                                    ? `Version ${component.version || 'N/A'}`
                                    : `Language: ${component.language || component.name}`
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {getRiskBadge(component)}
                              <div className="text-right">
                                <div className="text-sm font-medium">{component.applicationCount} apps</div>
                                <div className="text-xs text-gray-500">{component.serviceCount} services</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-2 border-t bg-gray-50">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Applications ({component.applicationCount})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {component.applications.map((app, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {app}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Services Usage ({component.serviceCount})
                              </h4>
                              <div className="space-y-2">
                                {component.services.map((service, serviceIndex) => {
                                  const serviceKey = `${component.id}-${serviceIndex}`;
                                  return (
                                    <div key={serviceIndex} className="border rounded bg-white">
                                      <Collapsible
                                        open={expandedServices.has(serviceKey)}
                                        onOpenChange={() => toggleService(serviceKey)}
                                      >
                                        <CollapsibleTrigger asChild>
                                          <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                {expandedServices.has(serviceKey) ? (
                                                  <ChevronDown className="h-3 w-3" />
                                                ) : (
                                                  <ChevronRight className="h-3 w-3" />
                                                )}
                                                <span className="font-medium text-sm">{service.serviceName}</span>
                                                <Badge variant="outline" className="text-xs">
                                                  {service.applicationName}
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs">
                                                  ID: {service.appId}
                                                </Badge>
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                {service.usage.length} {component.isLibrary ? 'functions' : 'frameworks'}
                                              </div>
                                            </div>
                                          </div>
                                        </CollapsibleTrigger>
                                        
                                        <CollapsibleContent>
                                          <div className="px-3 pb-3 border-t">
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead className="text-xs">
                                                    {component.isLibrary ? 'Function' : 'Framework/Tool'}
                                                  </TableHead>
                                                  <TableHead className="text-xs">Used In</TableHead>
                                                  <TableHead className="text-xs">Purpose</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {service.usage.map((item, itemIndex) => (
                                                  <TableRow key={itemIndex}>
                                                    <TableCell className="text-xs font-mono">{item.name}</TableCell>
                                                    <TableCell className="text-xs">
                                                      {item.usedIn?.join(', ') || 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                      {item.purpose || item.framework || 'N/A'}
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
