
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, Eye, Filter, Search, FileKey, Key, Shield, Building, Layers, Calendar, Download } from 'lucide-react';
import { CryptoMaterialsKnowledgeGraph } from './CryptoMaterialsKnowledgeGraph';
import { CryptoMaterialsData, Certificate, CryptoKey } from '@/data/mockCryptoMaterialsData';

interface CryptoMaterialsAnalysisProps {
  data: CryptoMaterialsData;
}

interface TransformedCertificate extends Certificate {
  appId: string;
  serviceName: string;
  status: string;
  riskLevel: string;
}

interface TransformedKey extends CryptoKey {
  appId: string;
  serviceName: string;
  keyLength: string;
  keySource: string;
  status: string;
  riskLevel: string;
}

export const CryptoMaterialsAnalysis: React.FC<CryptoMaterialsAnalysisProps> = ({ data }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [issuerFilter, setIssuerFilter] = useState('all');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const getTransformedCertificates = (): TransformedCertificate[] => {
    return data.certificates.map((cert, index) => ({
      ...cert,
      appId: `APP-${String(index + 1).padStart(3, '0')}`,
      serviceName: cert.services && cert.services.length > 0 ? cert.services[0] : 'Unknown Service',
      status: cert.isExpired ? 'expired' : (cert.daysUntilExpiry < 30 ? 'expiring' : 'active'),
      riskLevel: cert.isExpired || cert.daysUntilExpiry < 30 ? 'high' : (cert.daysUntilExpiry < 90 ? 'medium' : 'low')
    }));
  };

  const getTransformedKeys = (): TransformedKey[] => {
    return data.keys.map((key, index) => ({
      ...key,
      appId: `APP-${String(index + 1).padStart(3, '0')}`,
      serviceName: key.services && key.services.length > 0 ? key.services[0] : 'Unknown Service',
      keyLength: `${key.keySize} bits`,
      keySource: key.location || 'Unknown',
      status: key.isActive ? 'active' : 'inactive',
      riskLevel: !key.isActive || key.keySize < 2048 ? 'high' : (key.keySize < 4096 ? 'medium' : 'low')
    }));
  };

  const transformedCertificates = useMemo(() => getTransformedCertificates(), [data.certificates]);
  const transformedKeys = useMemo(() => getTransformedKeys(), [data.keys]);

  const filterOptions = useMemo(() => {
    const allMaterials = [...transformedCertificates, ...transformedKeys];
    
    const getUniqueValues = (values: string[]): string[] => {
      return [...new Set(values.filter(value => value && value.trim() !== ''))];
    };

    return {
      statuses: getUniqueValues([
        ...transformedCertificates.map(cert => cert.status),
        ...transformedKeys.map(key => key.status)
      ]),
      types: getUniqueValues([
        ...transformedCertificates.map(cert => cert.certificateType),
        ...transformedKeys.map(key => key.type)
      ]),
      riskLevels: getUniqueValues([
        ...transformedCertificates.map(cert => cert.riskLevel),
        ...transformedKeys.map(key => key.riskLevel)
      ]),
      issuers: getUniqueValues([
        ...transformedCertificates.map(cert => cert.issuer),
        ...transformedKeys.map(key => key.keySource)
      ]),
      applications: getUniqueValues([
        ...transformedCertificates.flatMap(cert => cert.applications || []),
        ...transformedKeys.flatMap(key => key.applications || [])
      ])
    };
  }, [transformedCertificates, transformedKeys]);

  const filteredCertificates = useMemo(() => {
    return transformedCertificates.filter(cert => {
      const matchesSearch = !searchFilter || 
        cert.commonName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchFilter.toLowerCase()) ||
        cert.appId.toLowerCase().includes(searchFilter.toLowerCase()) ||
        cert.serviceName.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
      const matchesType = typeFilter === 'all' || cert.certificateType === typeFilter;
      const matchesRiskLevel = riskLevelFilter === 'all' || cert.riskLevel === riskLevelFilter;
      const matchesIssuer = issuerFilter === 'all' || cert.issuer === issuerFilter;
      const matchesApplication = applicationFilter === 'all' || 
        (cert.applications && cert.applications.includes(applicationFilter));
      
      return matchesSearch && matchesStatus && matchesType && matchesRiskLevel && matchesIssuer && matchesApplication;
    });
  }, [transformedCertificates, searchFilter, statusFilter, typeFilter, riskLevelFilter, issuerFilter, applicationFilter]);

  const filteredKeys = useMemo(() => {
    return transformedKeys.filter(key => {
      const matchesSearch = !searchFilter || 
        key.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        key.keySource.toLowerCase().includes(searchFilter.toLowerCase()) ||
        key.appId.toLowerCase().includes(searchFilter.toLowerCase()) ||
        key.serviceName.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
      const matchesType = typeFilter === 'all' || key.type === typeFilter;
      const matchesRiskLevel = riskLevelFilter === 'all' || key.riskLevel === riskLevelFilter;
      const matchesIssuer = issuerFilter === 'all' || key.keySource === issuerFilter;
      const matchesApplication = applicationFilter === 'all' || 
        (key.applications && key.applications.includes(applicationFilter));
      
      return matchesSearch && matchesStatus && matchesType && matchesRiskLevel && matchesIssuer && matchesApplication;
    });
  }, [transformedKeys, searchFilter, statusFilter, typeFilter, riskLevelFilter, issuerFilter, applicationFilter]);

  const clearFilters = () => {
    setSearchFilter('');
    setStatusFilter('all');
    setTypeFilter('all');
    setRiskLevelFilter('all');
    setIssuerFilter('all');
    setApplicationFilter('all');
  };

  const allMaterials = [...transformedCertificates, ...transformedKeys];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileKey className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{data.certificates.length}</div>
                <div className="text-sm text-gray-500">Certificates</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{data.keys.length}</div>
                <div className="text-sm text-gray-500">Keys</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {allMaterials.filter(item => item.riskLevel === 'high').length}
                </div>
                <div className="text-sm text-gray-500">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {transformedCertificates.filter(cert => cert.status === 'expiring').length}
                </div>
                <div className="text-sm text-gray-500">Expiring Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="keys">Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CryptoMaterialsKnowledgeGraph data={data} />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileKey className="h-5 w-5" />
                Certificates Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Advanced Filters */}
              <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search certificates..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {filterOptions.statuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {filterOptions.types.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Risk Level</label>
                    <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Risk Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk Levels</SelectItem>
                        {filterOptions.riskLevels.map(risk => (
                          <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Issuer</label>
                    <Select value={issuerFilter} onValueChange={setIssuerFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Issuers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Issuers</SelectItem>
                        {filterOptions.issuers.map(issuer => (
                          <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Application</label>
                    <Select value={applicationFilter} onValueChange={setApplicationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Applications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        {filterOptions.applications.map(app => (
                          <SelectItem key={app} value={app}>{app}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing {filteredCertificates.length} of {data.certificates.length} certificates
                  </div>
                  <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Certificates Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Common Name</TableHead>
                      <TableHead>App ID</TableHead>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Issuer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-medium">{cert.commonName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {cert.appId}
                          </Badge>
                        </TableCell>
                        <TableCell>{cert.serviceName}</TableCell>
                        <TableCell>{cert.certificateType}</TableCell>
                        <TableCell>{cert.issuer}</TableCell>
                        <TableCell>{getStatusBadge(cert.status)}</TableCell>
                        <TableCell>{getRiskBadge(cert.riskLevel)}</TableCell>
                        <TableCell>{cert.validTo}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {cert.applications?.slice(0, 2).map((app, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {app}
                              </Badge>
                            ))}
                            {cert.applications && cert.applications.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{cert.applications.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Keys Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Advanced Filters - similar structure as certificates */}
              <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search keys..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {filterOptions.statuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {filterOptions.types.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Risk Level</label>
                    <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Risk Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk Levels</SelectItem>
                        {filterOptions.riskLevels.map(risk => (
                          <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Source</label>
                    <Select value={issuerFilter} onValueChange={setIssuerFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {filterOptions.issuers.map(issuer => (
                          <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Application</label>
                    <Select value={applicationFilter} onValueChange={setApplicationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Applications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        {filterOptions.applications.map(app => (
                          <SelectItem key={app} value={app}>{app}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing {filteredKeys.length} of {data.keys.length} keys
                  </div>
                  <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Keys Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key ID</TableHead>
                      <TableHead>App ID</TableHead>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Key Length</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium font-mono text-sm">{key.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {key.appId}
                          </Badge>
                        </TableCell>
                        <TableCell>{key.serviceName}</TableCell>
                        <TableCell>{key.type}</TableCell>
                        <TableCell>{key.keyLength}</TableCell>
                        <TableCell>{key.keySource}</TableCell>
                        <TableCell>{getStatusBadge(key.status)}</TableCell>
                        <TableCell>{getRiskBadge(key.riskLevel)}</TableCell>
                        <TableCell>{key.createdDate}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {key.applications?.slice(0, 2).map((app, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {app}
                              </Badge>
                            ))}
                            {key.applications && key.applications.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{key.applications.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper functions
const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
    expiring: { variant: 'destructive' as const, icon: Clock, color: 'text-yellow-600' },
    expired: { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' },
    revoked: { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' },
    inactive: { variant: 'secondary' as const, icon: AlertTriangle, color: 'text-gray-600' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  const IconComponent = config.icon;
  
  return (
    <Badge variant={config.variant} className="text-xs">
      <IconComponent className={`h-3 w-3 mr-1 ${config.color}`} />
      {status}
    </Badge>
  );
};

const getRiskBadge = (riskLevel: string) => {
  const riskConfig = {
    low: { variant: 'secondary' as const, color: 'text-green-600' },
    medium: { variant: 'default' as const, color: 'text-yellow-600' },
    high: { variant: 'destructive' as const, color: 'text-red-600' }
  };
  
  const config = riskConfig[riskLevel as keyof typeof riskConfig] || riskConfig.low;
  
  return (
    <Badge variant={config.variant} className="text-xs">
      <Shield className={`h-3 w-3 mr-1 ${config.color}`} />
      {riskLevel}
    </Badge>
  );
};
