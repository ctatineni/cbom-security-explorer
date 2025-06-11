
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileKey, Key, AlertTriangle, CheckCircle, Calendar, Building, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { CryptoMaterialsData } from '@/data/mockCryptoMaterialsData';

interface CryptoMaterialsAnalysisProps {
  data: CryptoMaterialsData;
}

interface FilterState {
  search: string;
  issuer: string;
  environment: string;
  keyType: string;
  minKeySize: string;
  expiryStatus: string;
  applications: string;
}

export const CryptoMaterialsAnalysis: React.FC<CryptoMaterialsAnalysisProps> = ({ data }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    issuer: '',
    environment: '',
    keyType: '',
    minKeySize: '',
    expiryStatus: '',
    applications: ''
  });

  const [selectedTab, setSelectedTab] = useState('overview');

  const analytics = useMemo(() => {
    const expiringSoon = data.certificates.filter(cert => cert.daysUntilExpiry > 0 && cert.daysUntilExpiry <= 30);
    const expired = data.certificates.filter(cert => cert.isExpired);
    const selfSigned = data.certificates.filter(cert => cert.isSelfSigned);
    const weakKeys = data.keys.filter(key => 
      (key.type === 'RSA' && key.keySize < 2048) || 
      (key.type === 'AES' && key.keySize < 128)
    );
    
    // Application usage analysis with detailed breakdown
    const appUsage = new Map();
    data.certificates.forEach(cert => {
      cert.applications.forEach(app => {
        if (!appUsage.has(app)) {
          appUsage.set(app, { 
            certificates: 0, 
            keys: 0, 
            services: new Set(),
            environments: new Set(),
            riskScore: 0
          });
        }
        appUsage.get(app).certificates++;
        cert.services?.forEach(service => appUsage.get(app).services.add(service));
        appUsage.get(app).environments.add(cert.environment);
        if (cert.isExpired || cert.daysUntilExpiry <= 30) {
          appUsage.get(app).riskScore += 10;
        }
      });
    });
    
    data.keys.forEach(key => {
      key.applications.forEach(app => {
        if (!appUsage.has(app)) {
          appUsage.set(app, { 
            certificates: 0, 
            keys: 0, 
            services: new Set(),
            environments: new Set(),
            riskScore: 0
          });
        }
        appUsage.get(app).keys++;
        key.services?.forEach(service => appUsage.get(app).services.add(service));
        appUsage.get(app).environments.add(key.environment);
        if (!key.isActive || ((key.type === 'RSA' && key.keySize < 2048) || (key.type === 'AES' && key.keySize < 128))) {
          appUsage.get(app).riskScore += 5;
        }
      });
    });
    
    return {
      expiringSoon,
      expired,
      selfSigned,
      weakKeys,
      appUsage: Array.from(appUsage.entries()).map(([app, usage]) => ({ 
        app, 
        ...usage,
        services: Array.from(usage.services),
        environments: Array.from(usage.environments)
      })).sort((a, b) => b.riskScore - a.riskScore)
    };
  }, [data]);

  const filteredCertificates = useMemo(() => {
    return data.certificates.filter(cert => {
      const matchesSearch = !filters.search || 
        cert.commonName.toLowerCase().includes(filters.search.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(filters.search.toLowerCase()) ||
        cert.applications.some(app => app.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesIssuer = !filters.issuer || cert.issuer === filters.issuer;
      const matchesEnvironment = !filters.environment || cert.environment === filters.environment;
      const matchesKeySize = !filters.minKeySize || cert.keySize >= parseInt(filters.minKeySize);
      const matchesApplications = !filters.applications || 
        cert.applications.some(app => app.toLowerCase().includes(filters.applications.toLowerCase()));
      
      let matchesExpiryStatus = true;
      if (filters.expiryStatus === 'expired') {
        matchesExpiryStatus = cert.isExpired;
      } else if (filters.expiryStatus === 'expiring-soon') {
        matchesExpiryStatus = !cert.isExpired && cert.daysUntilExpiry <= 30;
      } else if (filters.expiryStatus === 'valid') {
        matchesExpiryStatus = !cert.isExpired && cert.daysUntilExpiry > 30;
      }
      
      return matchesSearch && matchesIssuer && matchesEnvironment && 
             matchesKeySize && matchesExpiryStatus && matchesApplications;
    });
  }, [data.certificates, filters]);

  const filteredKeys = useMemo(() => {
    return data.keys.filter(key => {
      const matchesSearch = !filters.search || 
        key.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        key.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        key.applications.some(app => app.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesKeyType = !filters.keyType || key.type === filters.keyType;
      const matchesEnvironment = !filters.environment || key.environment === filters.environment;
      const matchesKeySize = !filters.minKeySize || key.keySize >= parseInt(filters.minKeySize);
      const matchesApplications = !filters.applications || 
        key.applications.some(app => app.toLowerCase().includes(filters.applications.toLowerCase()));
      
      return matchesSearch && matchesKeyType && matchesEnvironment && 
             matchesKeySize && matchesApplications;
    });
  }, [data.keys, filters]);

  const clearFilters = () => {
    setFilters({
      search: '',
      issuer: '',
      environment: '',
      keyType: '',
      minKeySize: '',
      expiryStatus: '',
      applications: ''
    });
  };

  const getStatusBadge = (isExpired: boolean, daysUntilExpiry: number) => {
    if (isExpired) {
      return <Badge variant="destructive" className="text-xs">Expired</Badge>;
    }
    if (daysUntilExpiry <= 30) {
      return <Badge variant="destructive" className="text-xs">Expiring Soon</Badge>;
    }
    if (daysUntilExpiry <= 90) {
      return <Badge className="text-xs bg-yellow-500">Warning</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Valid</Badge>;
  };

  const getKeyStrengthBadge = (key: any) => {
    const isWeak = (key.type === 'RSA' && key.keySize < 2048) || 
                   (key.type === 'AES' && key.keySize < 128);
    
    return isWeak ? (
      <Badge variant="destructive" className="text-xs">Weak</Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">Strong</Badge>
    );
  };

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 20) {
      return <Badge variant="destructive" className="text-xs">High Risk</Badge>;
    } else if (riskScore >= 10) {
      return <Badge className="text-xs bg-yellow-500">Medium Risk</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Low Risk</Badge>;
  };

  // Get unique values for filter dropdowns
  const uniqueIssuers = [...new Set(data.certificates.map(cert => cert.issuer))];
  const uniqueEnvironments = [...new Set([...data.certificates.map(cert => cert.environment), ...data.keys.map(key => key.environment)])];
  const uniqueKeyTypes = [...new Set(data.keys.map(key => key.type))];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{analytics.expired.length}</div>
            <div className="text-sm text-red-700">Expired Certificates</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{analytics.expiringSoon.length}</div>
            <div className="text-sm text-yellow-700">Expiring Soon</div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{analytics.weakKeys.length}</div>
            <div className="text-sm text-orange-700">Weak Keys</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.appUsage.length}</div>
            <div className="text-sm text-blue-700">Applications</div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search certificates, keys, apps..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Issuer</label>
              <Select value={filters.issuer} onValueChange={(value) => setFilters({...filters, issuer: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All issuers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All issuers</SelectItem>
                  {uniqueIssuers.map(issuer => (
                    <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Environment</label>
              <Select value={filters.environment} onValueChange={(value) => setFilters({...filters, environment: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All environments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All environments</SelectItem>
                  {uniqueEnvironments.map(env => (
                    <SelectItem key={env} value={env}>{env}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Key Type</label>
              <Select value={filters.keyType} onValueChange={(value) => setFilters({...filters, keyType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All key types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All key types</SelectItem>
                  {uniqueKeyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Min Key Size</label>
              <Input
                type="number"
                placeholder="e.g., 2048"
                value={filters.minKeySize}
                onChange={(e) => setFilters({...filters, minKeySize: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Expiry Status</label>
              <Select value={filters.expiryStatus} onValueChange={(value) => setFilters({...filters, expiryStatus: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="valid">Valid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Applications</label>
              <Input
                placeholder="Filter by application..."
                value={filters.applications}
                onChange={(e) => setFilters({...filters, applications: e.target.value})}
              />
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Building className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <FileKey className="h-4 w-4 mr-2" />
            Certificates ({filteredCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            Keys ({filteredKeys.length})
          </TabsTrigger>
          <TabsTrigger value="applications">
            <Building className="h-4 w-4 mr-2" />
            Applications ({analytics.appUsage.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>High-Risk Applications</CardTitle>
              <p className="text-sm text-gray-600">Applications with the highest security risk scores</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.appUsage.slice(0, 10).map((usage, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{usage.app}</div>
                        <div className="text-sm text-gray-600">
                          {usage.certificates} certificates, {usage.keys} keys across {usage.services.length} services
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRiskBadge(usage.riskScore)}
                      <div className="text-sm text-gray-500">Score: {usage.riskScore}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Certificate Inventory</CardTitle>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Common Name</TableHead>
                    <TableHead>Issuer</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Key Size</TableHead>
                    <TableHead>App ID</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-mono text-sm">{cert.commonName}</TableCell>
                      <TableCell className="text-sm">{cert.issuer}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {cert.validTo}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{cert.keySize} bits</TableCell>
                      <TableCell className="text-xs font-mono">{cert.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cert.applications.slice(0, 2).map((app, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                          {cert.applications.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{cert.applications.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cert.services?.slice(0, 2).map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {cert.services && cert.services.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{cert.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {cert.environment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(cert.isExpired, cert.daysUntilExpiry)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cryptographic Keys</CardTitle>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>App ID</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-mono text-sm">{key.name}</TableCell>
                      <TableCell className="text-sm">{key.type}</TableCell>
                      <TableCell className="text-sm">{key.keySize} bits</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {key.usage.slice(0, 2).map((usage, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {usage}
                            </Badge>
                          ))}
                          {key.usage.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{key.usage.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{key.location}</TableCell>
                      <TableCell className="text-xs font-mono">{key.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {key.applications.slice(0, 2).map((app, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                          {key.applications.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{key.applications.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {key.services?.slice(0, 2).map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {key.services && key.services.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{key.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {key.environment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {getKeyStrengthBadge(key)}
                          {key.isActive ? (
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Security Overview</CardTitle>
              <p className="text-sm text-gray-600">Detailed view of crypto materials usage across all applications</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.appUsage.map((usage, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{usage.app}</h4>
                          <div className="text-sm text-gray-600">
                            {usage.services.length} services across {usage.environments.length} environments
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getRiskBadge(usage.riskScore)}
                        <div className="text-right text-sm text-gray-600">
                          <div>{usage.certificates} certificates</div>
                          <div>{usage.keys} keys</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Services</h5>
                        <div className="flex flex-wrap gap-1">
                          {usage.services.map((service, serviceIndex) => (
                            <Badge key={serviceIndex} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Environments</h5>
                        <div className="flex flex-wrap gap-1">
                          {usage.environments.map((env, envIndex) => (
                            <Badge key={envIndex} variant="outline" className="text-xs">
                              {env}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
