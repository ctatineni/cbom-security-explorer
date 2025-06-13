
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Layers, Package, Code, Search, Filter, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ComponentsMetricsProps {
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
  activeFilters?: any;
}

interface ComponentMetric {
  name: string;
  type: 'library' | 'language';
  applicationCount: number;
  serviceCount: number;
  hasVulnerabilities: boolean;
  riskLevel: string;
  version?: string;
  isDeprecated: boolean;
}

interface ImpactAnalysis {
  totalApplicationsAffected: number;
  totalServicesAffected: number;
  vulnerableApplications: number;
  vulnerableServices: number;
  deprecatedApplications: number;
  deprecatedServices: number;
  outdatedApplications: number;
  outdatedServices: number;
}

export const ComponentsMetrics: React.FC<ComponentsMetricsProps> = ({ data, activeFilters }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [viewType, setViewType] = useState<'impact' | 'libraries' | 'languages'>('impact');
  const [riskFilter, setRiskFilter] = useState('all');

  const componentMetrics = useMemo((): ComponentMetric[] => {
    return data.components.map(component => ({
      name: component.name,
      type: component.isLibrary ? 'library' : 'language',
      applicationCount: component.applicationCount,
      serviceCount: component.serviceCount,
      hasVulnerabilities: component.hasVulnerabilities || false,
      riskLevel: component.riskLevel || 'low',
      version: component.version,
      isDeprecated: component.version ? 
        (component.name.includes('jQuery') && parseFloat(component.version) < 3.0) ||
        (component.name.includes('Angular') && parseFloat(component.version) < 12.0) ||
        (component.name.includes('React') && parseFloat(component.version) < 16.0) ||
        (component.name.includes('Java') && component.version.includes('8')) : false
    }));
  }, [data.components]);

  const impactAnalysis = useMemo((): ImpactAnalysis => {
    const appSet = new Set<string>();
    const serviceSet = new Set<string>();
    const vulnerableAppSet = new Set<string>();
    const vulnerableServiceSet = new Set<string>();
    const deprecatedAppSet = new Set<string>();
    const deprecatedServiceSet = new Set<string>();
    const outdatedAppSet = new Set<string>();
    const outdatedServiceSet = new Set<string>();

    data.components.forEach(component => {
      component.applications.forEach(app => appSet.add(app));
      component.services.forEach(service => {
        serviceSet.add(`${service.appId}-${service.serviceName}`);
        
        if (component.hasVulnerabilities) {
          vulnerableAppSet.add(service.applicationName);
          vulnerableServiceSet.add(`${service.appId}-${service.serviceName}`);
        }

        const isDeprecated = component.version ? 
          (component.name.includes('jQuery') && parseFloat(component.version) < 3.0) ||
          (component.name.includes('Angular') && parseFloat(component.version) < 12.0) ||
          (component.name.includes('React') && parseFloat(component.version) < 16.0) ||
          (component.name.includes('Java') && component.version.includes('8')) : false;

        if (isDeprecated) {
          deprecatedAppSet.add(service.applicationName);
          deprecatedServiceSet.add(`${service.appId}-${service.serviceName}`);
        }

        if (component.riskLevel === 'medium' || component.riskLevel === 'high') {
          outdatedAppSet.add(service.applicationName);
          outdatedServiceSet.add(`${service.appId}-${service.serviceName}`);
        }
      });
    });

    return {
      totalApplicationsAffected: appSet.size,
      totalServicesAffected: serviceSet.size,
      vulnerableApplications: vulnerableAppSet.size,
      vulnerableServices: vulnerableServiceSet.size,
      deprecatedApplications: deprecatedAppSet.size,
      deprecatedServices: deprecatedServiceSet.size,
      outdatedApplications: outdatedAppSet.size,
      outdatedServices: outdatedServiceSet.size
    };
  }, [data.components]);

  const libraryMetrics = useMemo(() => {
    return componentMetrics.filter(c => c.type === 'library').sort((a, b) => b.applicationCount - a.applicationCount);
  }, [componentMetrics]);

  const languageMetrics = useMemo(() => {
    return componentMetrics.filter(c => c.type === 'language').sort((a, b) => b.applicationCount - a.applicationCount);
  }, [componentMetrics]);

  const filteredComponents = useMemo(() => {
    let filtered = componentMetrics;

    if (viewType === 'libraries') {
      filtered = libraryMetrics;
    } else if (viewType === 'languages') {
      filtered = languageMetrics;
    }

    return filtered.filter(component => {
      const matchesSearch = !searchFilter || 
        component.name.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchesRisk = riskFilter === 'all' || 
        (riskFilter === 'vulnerable' && component.hasVulnerabilities) ||
        (riskFilter === 'deprecated' && component.isDeprecated) ||
        (riskFilter === 'high-risk' && (component.riskLevel === 'high' || component.hasVulnerabilities)) ||
        (riskFilter === 'safe' && !component.hasVulnerabilities && !component.isDeprecated && component.riskLevel === 'low');
      
      return matchesSearch && matchesRisk;
    });
  }, [componentMetrics, libraryMetrics, languageMetrics, searchFilter, riskFilter, viewType]);

  const chartData = useMemo(() => {
    return filteredComponents.slice(0, 10).map(component => ({
      name: component.name.length > 15 ? component.name.substring(0, 15) + '...' : component.name,
      fullName: component.name,
      applications: component.applicationCount,
      services: component.serviceCount,
      vulnerable: component.hasVulnerabilities ? component.applicationCount : 0,
      deprecated: component.isDeprecated ? component.applicationCount : 0
    }));
  }, [filteredComponents]);

  const pieData = useMemo(() => {
    const librariesCount = libraryMetrics.length;
    const languagesCount = languageMetrics.length;
    return [
      { name: 'Libraries', value: librariesCount, color: '#3b82f6' },
      { name: 'Languages', value: languagesCount, color: '#10b981' }
    ];
  }, [libraryMetrics.length, languageMetrics.length]);

  const clearFilters = () => {
    setSearchFilter('');
    setRiskFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Impact Analysis Overview */}
      {viewType === 'impact' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{impactAnalysis.totalApplicationsAffected}</div>
                <div className="text-sm text-gray-500">Applications Affected</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{impactAnalysis.totalServicesAffected}</div>
                <div className="text-sm text-gray-500">Services Affected</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{impactAnalysis.vulnerableApplications}</div>
                <div className="text-sm text-gray-500">Vulnerable Apps</div>
                <div className="text-xs text-gray-400">{impactAnalysis.vulnerableServices} services</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{impactAnalysis.deprecatedApplications}</div>
                <div className="text-sm text-gray-500">Deprecated Apps</div>
                <div className="text-xs text-gray-400">{impactAnalysis.deprecatedServices} services</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Component Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Components by Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => {
                    const item = chartData.find(d => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                <Bar dataKey="services" fill="#10b981" name="Services" />
                <Bar dataKey="vulnerable" fill="#ef4444" name="Vulnerable" />
                <Bar dataKey="deprecated" fill="#f59e0b" name="Deprecated" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Component Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">View Type</label>
                <Select value={viewType} onValueChange={(value: 'impact' | 'libraries' | 'languages') => setViewType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impact">Impact Analysis</SelectItem>
                    <SelectItem value="libraries">Libraries</SelectItem>
                    <SelectItem value="languages">Languages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search components..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Risk Filter</label>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Components</SelectItem>
                    <SelectItem value="vulnerable">Vulnerable Only</SelectItem>
                    <SelectItem value="deprecated">Deprecated Only</SelectItem>
                    <SelectItem value="high-risk">High Risk</SelectItem>
                    <SelectItem value="safe">Safe Components</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {viewType === 'impact' ? (
                <>Impact analysis for {data.components.length} components</>
              ) : (
                <>Showing {filteredComponents.length} of {componentMetrics.length} components</>
              )}
            </div>
          </div>

          {/* Component List */}
          {viewType !== 'impact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComponents.map(component => (
                <Card key={component.name} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{component.name}</h3>
                        <div className="flex gap-1">
                          <Badge variant={component.type === 'library' ? 'default' : 'secondary'} className="text-xs">
                            {component.type}
                          </Badge>
                          {component.hasVulnerabilities && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Vulnerable
                            </Badge>
                          )}
                          {component.isDeprecated && (
                            <Badge className="text-xs bg-yellow-500">
                              Deprecated
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {component.version && (
                        <div className="text-xs text-gray-600">
                          Version: {component.version}
                        </div>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-600" />
                            <span>Applications</span>
                          </div>
                          <span className="font-medium">{component.applicationCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-green-600" />
                            <span>Services</span>
                          </div>
                          <span className="font-medium">{component.serviceCount}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
