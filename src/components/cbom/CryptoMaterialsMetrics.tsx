
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Layers, FileKey, Key, Search, Filter, AlertTriangle, Clock, Shield } from 'lucide-react';
import { CryptoMaterialsData } from '@/data/mockCryptoMaterialsData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CryptoMaterialsMetricsProps {
  data: CryptoMaterialsData;
}

interface ApplicationMetric {
  appId: string;
  appName: string;
  certificateCount: number;
  keyCount: number;
  totalMaterials: number;
  highRiskCount: number;
  expiringCount: number;
  services: ServiceMetric[];
}

interface ServiceMetric {
  serviceName: string;
  certificateCount: number;
  keyCount: number;
  totalMaterials: number;
  highRiskCount: number;
}

interface SourceMetric {
  source: string;
  certificateCount: number;
  keyCount: number;
  totalMaterials: number;
  type: 'certificate' | 'key' | 'mixed';
}

export const CryptoMaterialsMetrics: React.FC<CryptoMaterialsMetricsProps> = ({ data }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [viewType, setViewType] = useState<'applications' | 'sources'>('applications');
  const [riskFilter, setRiskFilter] = useState('all');
  const [expandedApps, setExpandedApps] = useState<Set<string>>(new Set());

  const applicationMetrics = useMemo((): ApplicationMetric[] => {
    const appMap = new Map<string, ApplicationMetric>();
    
    // Process certificates
    data.certificates.forEach((cert, index) => {
      const appId = `APP-${String(index + 1).padStart(3, '0')}`;
      const appName = cert.applications?.[0] || `Application ${index + 1}`;
      const serviceName = cert.services?.[0] || 'Unknown Service';
      
      if (!appMap.has(appId)) {
        appMap.set(appId, {
          appId,
          appName,
          certificateCount: 0,
          keyCount: 0,
          totalMaterials: 0,
          highRiskCount: 0,
          expiringCount: 0,
          services: []
        });
      }
      
      const app = appMap.get(appId)!;
      app.certificateCount++;
      app.totalMaterials++;
      
      if (cert.isExpired || cert.daysUntilExpiry < 30) {
        app.highRiskCount++;
      }
      if (!cert.isExpired && cert.daysUntilExpiry < 90 && cert.daysUntilExpiry >= 30) {
        app.expiringCount++;
      }
      
      // Add to service metrics
      let service = app.services.find(s => s.serviceName === serviceName);
      if (!service) {
        service = {
          serviceName,
          certificateCount: 0,
          keyCount: 0,
          totalMaterials: 0,
          highRiskCount: 0
        };
        app.services.push(service);
      }
      service.certificateCount++;
      service.totalMaterials++;
      if (cert.isExpired || cert.daysUntilExpiry < 30) {
        service.highRiskCount++;
      }
    });
    
    // Process keys
    data.keys.forEach((key, index) => {
      const appId = `APP-${String(index + 1).padStart(3, '0')}`;
      const appName = key.applications?.[0] || `Application ${index + 1}`;
      const serviceName = key.services?.[0] || 'Unknown Service';
      
      if (!appMap.has(appId)) {
        appMap.set(appId, {
          appId,
          appName,
          certificateCount: 0,
          keyCount: 0,
          totalMaterials: 0,
          highRiskCount: 0,
          expiringCount: 0,
          services: []
        });
      }
      
      const app = appMap.get(appId)!;
      app.keyCount++;
      app.totalMaterials++;
      
      if (!key.isActive || key.keySize < 2048) {
        app.highRiskCount++;
      }
      
      // Add to service metrics
      let service = app.services.find(s => s.serviceName === serviceName);
      if (!service) {
        service = {
          serviceName,
          certificateCount: 0,
          keyCount: 0,
          totalMaterials: 0,
          highRiskCount: 0
        };
        app.services.push(service);
      }
      service.keyCount++;
      service.totalMaterials++;
      if (!key.isActive || key.keySize < 2048) {
        service.highRiskCount++;
      }
    });
    
    return Array.from(appMap.values()).sort((a, b) => b.totalMaterials - a.totalMaterials);
  }, [data.certificates, data.keys]);

  const sourceMetrics = useMemo((): SourceMetric[] => {
    const sourceMap = new Map<string, SourceMetric>();
    
    // Process certificate sources
    data.certificates.forEach(cert => {
      const source = cert.issuer.includes('Let\'s Encrypt') ? 'Let\'s Encrypt' : 
                     cert.issuer.includes('DigiCert') ? 'DigiCert' : 
                     cert.issuer.includes('Verisign') ? 'Verisign' : 'Internal CA';
      
      if (!sourceMap.has(source)) {
        sourceMap.set(source, {
          source,
          certificateCount: 0,
          keyCount: 0,
          totalMaterials: 0,
          type: 'certificate'
        });
      }
      
      const sourceMetric = sourceMap.get(source)!;
      sourceMetric.certificateCount++;
      sourceMetric.totalMaterials++;
    });
    
    // Process key sources
    data.keys.forEach(key => {
      const source = key.location || 'Generated';
      
      if (!sourceMap.has(source)) {
        sourceMap.set(source, {
          source,
          certificateCount: 0,
          keyCount: 0,
          totalMaterials: 0,
          type: 'key'
        });
      } else if (sourceMap.get(source)!.certificateCount > 0) {
        sourceMap.get(source)!.type = 'mixed';
      }
      
      const sourceMetric = sourceMap.get(source)!;
      sourceMetric.keyCount++;
      sourceMetric.totalMaterials++;
    });
    
    return Array.from(sourceMap.values()).sort((a, b) => b.totalMaterials - a.totalMaterials);
  }, [data.certificates, data.keys]);

  const filteredApplications = useMemo(() => {
    return applicationMetrics.filter(app => {
      const matchesSearch = !searchFilter || 
        app.appName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        app.appId.toLowerCase().includes(searchFilter.toLowerCase()) ||
        app.services.some(service => service.serviceName.toLowerCase().includes(searchFilter.toLowerCase()));
      
      const matchesRisk = riskFilter === 'all' || 
        (riskFilter === 'high' && app.highRiskCount > 0) ||
        (riskFilter === 'expiring' && app.expiringCount > 0) ||
        (riskFilter === 'safe' && app.highRiskCount === 0 && app.expiringCount === 0);
      
      return matchesSearch && matchesRisk;
    });
  }, [applicationMetrics, searchFilter, riskFilter]);

  const filteredSources = useMemo(() => {
    return sourceMetrics.filter(source => {
      return !searchFilter || source.source.toLowerCase().includes(searchFilter.toLowerCase());
    });
  }, [sourceMetrics, searchFilter]);

  const chartData = useMemo(() => {
    if (viewType === 'applications') {
      return filteredApplications.slice(0, 10).map(app => ({
        name: app.appName.length > 15 ? app.appName.substring(0, 15) + '...' : app.appName,
        certificates: app.certificateCount,
        keys: app.keyCount,
        total: app.totalMaterials
      }));
    } else {
      return filteredSources.map(source => ({
        name: source.source,
        certificates: source.certificateCount,
        keys: source.keyCount,
        total: source.totalMaterials
      }));
    }
  }, [viewType, filteredApplications, filteredSources]);

  const pieData = useMemo(() => {
    const totalCerts = data.certificates.length;
    const totalKeys = data.keys.length;
    return [
      { name: 'Certificates', value: totalCerts, color: '#3b82f6' },
      { name: 'Keys', value: totalKeys, color: '#10b981' }
    ];
  }, [data.certificates.length, data.keys.length]);

  const toggleAppExpansion = (appId: string) => {
    const newExpanded = new Set(expandedApps);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedApps(newExpanded);
  };

  const clearFilters = () => {
    setSearchFilter('');
    setRiskFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Materials Distribution</CardTitle>
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
            <CardTitle>Top {viewType === 'applications' ? 'Applications' : 'Sources'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="certificates" fill="#3b82f6" name="Certificates" />
                <Bar dataKey="keys" fill="#10b981" name="Keys" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Detailed Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">View Type</label>
                <Select value={viewType} onValueChange={(value: 'applications' | 'sources') => setViewType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applications">Applications</SelectItem>
                    <SelectItem value="sources">Sources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search applications, services, or sources..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {viewType === 'applications' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Risk Filter</label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="high">High Risk Only</SelectItem>
                      <SelectItem value="expiring">Expiring Soon</SelectItem>
                      <SelectItem value="safe">Safe Applications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {viewType === 'applications' ? (
                <>Showing {filteredApplications.length} of {applicationMetrics.length} applications</>
              ) : (
                <>Showing {filteredSources.length} of {sourceMetrics.length} sources</>
              )}
            </div>
          </div>

          {viewType === 'applications' ? (
            <div className="space-y-4">
              {filteredApplications.map(app => (
                <Card key={app.appId} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{app.appName}</h3>
                          <Badge variant="outline" className="text-xs font-mono">{app.appId}</Badge>
                          {app.highRiskCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {app.highRiskCount} High Risk
                            </Badge>
                          )}
                          {app.expiringCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {app.expiringCount} Expiring
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FileKey className="h-4 w-4 text-blue-600" />
                            <span>{app.certificateCount} Certificates</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-green-600" />
                            <span>{app.keyCount} Keys</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-gray-600" />
                            <span>{app.services.length} Services</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAppExpansion(app.appId)}
                      >
                        {expandedApps.has(app.appId) ? 'Hide Services' : 'Show Services'}
                      </Button>
                    </div>
                    
                    {expandedApps.has(app.appId) && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-sm text-gray-700">Services:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {app.services.map(service => (
                            <div key={service.serviceName} className="p-3 bg-gray-50 rounded-lg">
                              <div className="font-medium text-sm mb-1">{service.serviceName}</div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                  <span>Certificates:</span>
                                  <span>{service.certificateCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Keys:</span>
                                  <span>{service.keyCount}</span>
                                </div>
                                {service.highRiskCount > 0 && (
                                  <div className="flex justify-between text-red-600">
                                    <span>High Risk:</span>
                                    <span>{service.highRiskCount}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSources.map(source => (
                <Card key={source.source}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{source.source}</h3>
                        <Badge variant={source.type === 'certificate' ? 'default' : source.type === 'key' ? 'secondary' : 'outline'}>
                          {source.type === 'mixed' ? 'Mixed' : source.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {source.certificateCount > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileKey className="h-4 w-4 text-blue-600" />
                              <span>Certificates</span>
                            </div>
                            <span className="font-medium">{source.certificateCount}</span>
                          </div>
                        )}
                        {source.keyCount > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4 text-green-600" />
                              <span>Keys</span>
                            </div>
                            <span className="font-medium">{source.keyCount}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between border-t pt-2">
                          <span className="font-medium">Total Materials</span>
                          <span className="font-bold">{source.totalMaterials}</span>
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
