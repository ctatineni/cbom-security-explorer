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
  activeFilters?: {
    certificates?: any;
    keys?: any;
  };
}

interface ApplicationMetric {
  appId: string;
  appName: string;
  certificateCount: number;
  keyCount: number;
  totalMaterials: number;
  highRiskCount: number;
  expiringCount: number;
  selfSignedCount: number;
  services: ServiceMetric[];
}

interface ServiceMetric {
  serviceName: string;
  certificateCount: number;
  keyCount: number;
  totalMaterials: number;
  highRiskCount: number;
  selfSignedCount: number;
}

interface SourceMetric {
  source: string;
  certificateCount: number;
  keyCount: number;
  totalMaterials: number;
  type: 'certificate' | 'key' | 'mixed';
}

interface ImpactAnalysis {
  totalApplicationsAffected: number;
  totalServicesAffected: number;
  highRiskApplications: number;
  highRiskServices: number;
  selfSignedApplications: number;
  selfSignedServices: number;
  expiringApplications: number;
  expiringServices: number;
}

export const CryptoMaterialsMetrics: React.FC<CryptoMaterialsMetricsProps> = ({ data, activeFilters }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [viewType, setViewType] = useState<'applications' | 'sources' | 'impact'>('impact');
  const [riskFilter, setRiskFilter] = useState('all');
  const [expandedApps, setExpandedApps] = useState<Set<string>>(new Set());

  // Filter data based on active filters from tabs
  const filteredData = useMemo(() => {
    let filteredCertificates = data.certificates;
    let filteredKeys = data.keys;

    // Apply certificate filters if they exist
    if (activeFilters?.certificates) {
      const certFilters = activeFilters.certificates;
      filteredCertificates = data.certificates.filter(cert => {
        if (certFilters.search && certFilters.searchField) {
          const searchValue = certFilters.search.toLowerCase();
          if (certFilters.searchField === 'all') {
            const searchableText = `${cert.subject} ${cert.issuer} ${cert.services?.join(' ') || ''} ${cert.applications?.join(' ') || ''}`.toLowerCase();
            if (!searchableText.includes(searchValue)) return false;
          }
        }
        if (certFilters.status !== 'all') {
          const status = cert.isExpired ? 'expired' : (cert.daysUntilExpiry < 30 ? 'expiring' : 'valid');
          if (status !== certFilters.status) return false;
        }
        if (certFilters.source !== 'all') {
          const source = cert.issuer.includes('Let\'s Encrypt') ? 'Let\'s Encrypt' : 
                         cert.issuer.includes('DigiCert') ? 'DigiCert' : 
                         cert.issuer.includes('Internal') ? 'Internal CA' : 'External CA';
          if (source !== certFilters.source) return false;
        }
        return true;
      });
    }

    // Apply key filters if they exist
    if (activeFilters?.keys) {
      const keyFilters = activeFilters.keys;
      filteredKeys = data.keys.filter(key => {
        if (keyFilters.search && keyFilters.searchField) {
          const searchValue = keyFilters.search.toLowerCase();
          if (keyFilters.searchField === 'all') {
            const searchableText = `${key.name} ${key.type} ${key.services?.join(' ') || ''} ${key.applications?.join(' ') || ''}`.toLowerCase();
            if (!searchableText.includes(searchValue)) return false;
          }
        }
        if (keyFilters.status !== 'all') {
          const status = key.isActive ? 'active' : 'inactive';
          if (status !== keyFilters.status) return false;
        }
        if (keyFilters.keyType !== 'all' && key.type !== keyFilters.keyType) return false;
        return true;
      });
    }

    return {
      certificates: filteredCertificates,
      keys: filteredKeys
    };
  }, [data, activeFilters]);

  const impactAnalysis = useMemo((): ImpactAnalysis => {
    const appSet = new Set<string>();
    const serviceSet = new Set<string>();
    const highRiskAppSet = new Set<string>();
    const highRiskServiceSet = new Set<string>();
    const selfSignedAppSet = new Set<string>();
    const selfSignedServiceSet = new Set<string>();
    const expiringAppSet = new Set<string>();
    const expiringServiceSet = new Set<string>();

    // Analyze certificates
    filteredData.certificates.forEach((cert, index) => {
      const appId = `APP-${String(index + 1).padStart(3, '0')}`;
      const serviceName = cert.services?.[0] || 'Unknown Service';
      
      appSet.add(appId);
      serviceSet.add(`${appId}-${serviceName}`);

      if (cert.isExpired || cert.daysUntilExpiry < 30) {
        highRiskAppSet.add(appId);
        highRiskServiceSet.add(`${appId}-${serviceName}`);
      }

      if (cert.issuer.includes('Internal') || cert.issuer.includes('Self')) {
        selfSignedAppSet.add(appId);
        selfSignedServiceSet.add(`${appId}-${serviceName}`);
      }

      if (!cert.isExpired && cert.daysUntilExpiry < 90) {
        expiringAppSet.add(appId);
        expiringServiceSet.add(`${appId}-${serviceName}`);
      }
    });

    // Analyze keys
    filteredData.keys.forEach((key, index) => {
      const appId = `APP-${String(index + 1).padStart(3, '0')}`;
      const serviceName = key.services?.[0] || 'Unknown Service';
      
      appSet.add(appId);
      serviceSet.add(`${appId}-${serviceName}`);

      if (!key.isActive || key.keySize < 2048) {
        highRiskAppSet.add(appId);
        highRiskServiceSet.add(`${appId}-${serviceName}`);
      }
    });

    return {
      totalApplicationsAffected: appSet.size,
      totalServicesAffected: serviceSet.size,
      highRiskApplications: highRiskAppSet.size,
      highRiskServices: highRiskServiceSet.size,
      selfSignedApplications: selfSignedAppSet.size,
      selfSignedServices: selfSignedServiceSet.size,
      expiringApplications: expiringAppSet.size,
      expiringServices: expiringServiceSet.size
    };
  }, [filteredData]);

  const applicationMetrics = useMemo((): ApplicationMetric[] => {
    const appMap = new Map<string, ApplicationMetric>();
    
    // Process certificates
    filteredData.certificates.forEach((cert, index) => {
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
          selfSignedCount: 0,
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
      if (cert.issuer.includes('Internal') || cert.issuer.includes('Self')) {
        app.selfSignedCount++;
      }
      
      // Add to service metrics
      let service = app.services.find(s => s.serviceName === serviceName);
      if (!service) {
        service = {
          serviceName,
          certificateCount: 0,
          keyCount: 0,
          totalMaterials: 0,
          highRiskCount: 0,
          selfSignedCount: 0
        };
        app.services.push(service);
      }
      service.certificateCount++;
      service.totalMaterials++;
      if (cert.isExpired || cert.daysUntilExpiry < 30) {
        service.highRiskCount++;
      }
      if (cert.issuer.includes('Internal') || cert.issuer.includes('Self')) {
        service.selfSignedCount++;
      }
    });
    
    // Process keys
    filteredData.keys.forEach((key, index) => {
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
          selfSignedCount: 0,
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
          highRiskCount: 0,
          selfSignedCount: 0
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
  }, [filteredData]);

  const sourceMetrics = useMemo((): SourceMetric[] => {
    const sourceMap = new Map<string, SourceMetric>();
    
    // Process certificate sources
    filteredData.certificates.forEach(cert => {
      const source = cert.issuer.includes('Let\'s Encrypt') ? 'Let\'s Encrypt' : 
                     cert.issuer.includes('DigiCert') ? 'DigiCert' : 
                     cert.issuer.includes('Verisign') ? 'Verisign' : 
                     cert.issuer.includes('Internal') ? 'Internal CA' : 'External CA';
      
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
    filteredData.keys.forEach(key => {
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
  }, [filteredData]);

  const filteredApplications = useMemo(() => {
    return applicationMetrics.filter(app => {
      const matchesSearch = !searchFilter || 
        app.appName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        app.appId.toLowerCase().includes(searchFilter.toLowerCase()) ||
        app.services.some(service => service.serviceName.toLowerCase().includes(searchFilter.toLowerCase()));
      
      const matchesRisk = riskFilter === 'all' || 
        (riskFilter === 'high' && app.highRiskCount > 0) ||
        (riskFilter === 'expiring' && app.expiringCount > 0) ||
        (riskFilter === 'self-signed' && app.selfSignedCount > 0) ||
        (riskFilter === 'safe' && app.highRiskCount === 0 && app.expiringCount === 0);
      
      return matchesSearch && matchesRisk;
    });
  }, [applicationMetrics, searchFilter, riskFilter]);

  const chartData = useMemo(() => {
    if (viewType === 'applications') {
      return filteredApplications.slice(0, 10).map(app => ({
        name: app.appName.length > 12 ? app.appName.substring(0, 12) + '...' : app.appName,
        fullName: app.appName,
        certificates: app.certificateCount,
        keys: app.keyCount,
        total: app.totalMaterials,
        highRisk: app.highRiskCount,
        selfSigned: app.selfSignedCount
      }));
    } else {
      return sourceMetrics.slice(0, 10).map(source => ({
        name: source.source.length > 12 ? source.source.substring(0, 12) + '...' : source.source,
        fullName: source.source,
        certificates: source.certificateCount,
        keys: source.keyCount,
        total: source.totalMaterials
      }));
    }
  }, [viewType, filteredApplications, sourceMetrics]);

  const pieData = useMemo(() => {
    const totalCerts = filteredData.certificates.length;
    const totalKeys = filteredData.keys.length;
    return [
      { name: 'Certificates', value: totalCerts, color: '#3b82f6' },
      { name: 'Keys', value: totalKeys, color: '#10b981' }
    ];
  }, [filteredData]);

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
                <div className="text-2xl font-bold text-red-600">{impactAnalysis.highRiskApplications}</div>
                <div className="text-sm text-gray-500">High Risk Apps</div>
                <div className="text-xs text-gray-400">{impactAnalysis.highRiskServices} services</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{impactAnalysis.selfSignedApplications}</div>
                <div className="text-sm text-gray-500">Self-Signed Apps</div>
                <div className="text-xs text-gray-400">{impactAnalysis.selfSignedServices} services</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
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
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [value, name]}
                  labelFormatter={(label) => {
                    const item = chartData.find(d => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Bar dataKey="certificates" fill="#3b82f6" name="Certificates" />
                <Bar dataKey="keys" fill="#10b981" name="Keys" />
                {viewType === 'applications' && (
                  <>
                    <Bar dataKey="highRisk" fill="#ef4444" name="High Risk" />
                    <Bar dataKey="selfSigned" fill="#f59e0b" name="Self-Signed" />
                  </>
                )}
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
            Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">View Type</label>
                <Select value={viewType} onValueChange={(value: 'applications' | 'sources' | 'impact') => setViewType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impact">Impact Analysis</SelectItem>
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
                    placeholder="Search applications or services..."
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
                      <SelectItem value="self-signed">Self-Signed Only</SelectItem>
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
              {viewType === 'impact' ? (
                <>Impact analysis based on current filters</>
              ) : viewType === 'applications' ? (
                <>Showing {filteredApplications.length} of {applicationMetrics.length} applications</>
              ) : (
                <>Showing {sourceMetrics.length} sources</>
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
                          {app.selfSignedCount > 0 && (
                            <Badge variant="yellow" className="text-xs bg-yellow-500">
                              Self-Signed
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
                                {service.selfSignedCount > 0 && (
                                  <div className="flex justify-between text-yellow-600">
                                    <span>Self-Signed:</span>
                                    <span>{service.selfSignedCount}</span>
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
          ) : viewType === 'sources' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sourceMetrics.map(source => (
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
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
