import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, Clock, Eye, Filter, Search, FileKey, Key, Shield, ArrowUpDown, Folder } from 'lucide-react';
import { CryptoMaterialsKnowledgeGraph } from './CryptoMaterialsKnowledgeGraph';
import { CryptoMaterialsData, Certificate, CryptoKey } from '@/data/mockCryptoMaterialsData';

interface CryptoMaterialsAnalysisProps {
  data: CryptoMaterialsData;
  streamingData?: boolean;
  onDataUpdate?: (newData: CryptoMaterialsData) => void;
}

interface UnifiedMaterial {
  id: string;
  type: 'certificate' | 'key';
  name: string;
  appId: string;
  serviceName: string;
  paths: string[];
  status: string;
  riskLevel: string;
  size: string;
  issuerOrSource: string;
  expiry?: string;
  daysUntilExpiry?: number;
  applications?: string[];
  isActive?: boolean;
  keyType?: string;
  certType?: string;
  createdDate?: string;
}

export const CryptoMaterialsAnalysis: React.FC<CryptoMaterialsAnalysisProps> = ({ 
  data, 
  streamingData = false, 
  onDataUpdate 
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [issuerFilter, setIssuerFilter] = useState('all');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [materialTypeFilter, setMaterialTypeFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof UnifiedMaterial>('appId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  // Handle streaming data updates
  useEffect(() => {
    if (streamingData && onDataUpdate) {
      // Simulate streaming data updates
      const interval = setInterval(() => {
        // This would be replaced with actual streaming logic
        console.log('Streaming data update available');
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [streamingData, onDataUpdate]);

  const unifiedMaterials = useMemo((): UnifiedMaterial[] => {
    const materials: UnifiedMaterial[] = [];
    
    // Transform certificates with enhanced path handling
    data.certificates.forEach((cert, index) => {
      // Generate multiple paths for demonstration
      const paths = [
        `/opt/certificates/${cert.commonName.toLowerCase().replace(/\s+/g, '_')}.crt`,
        `/etc/ssl/certs/${cert.commonName.toLowerCase().replace(/\s+/g, '_')}.pem`
      ];
      
      // Add additional paths based on certificate type
      if (cert.certificateType === 'SSL/TLS') {
        paths.push('/var/www/ssl/', '/nginx/ssl/');
      } else if (cert.certificateType === 'Code Signing') {
        paths.push('/usr/local/share/ca-certificates/');
      }

      materials.push({
        id: cert.id,
        type: 'certificate',
        name: cert.commonName,
        appId: `APP-${String(index + 1).padStart(3, '0')}`,
        serviceName: cert.services && cert.services.length > 0 ? cert.services[0] : 'Unknown Service',
        paths: paths.slice(0, Math.floor(Math.random() * 3) + 1), // Random 1-3 paths
        status: cert.isExpired ? 'expired' : (cert.daysUntilExpiry < 30 ? 'expiring' : 'active'),
        riskLevel: cert.isExpired || cert.daysUntilExpiry < 30 ? 'high' : (cert.daysUntilExpiry < 90 ? 'medium' : 'low'),
        size: `${cert.keySize} bits`,
        issuerOrSource: cert.issuer,
        expiry: cert.validTo,
        daysUntilExpiry: cert.daysUntilExpiry,
        applications: cert.applications,
        certType: cert.certificateType
      });
    });
    
    // Transform keys with enhanced path handling
    data.keys.forEach((key, index) => {
      // Generate multiple paths for keys
      const paths = [
        `/home/user/.ssh/${key.name.toLowerCase().replace(/\s+/g, '_')}`,
        `/etc/keys/${key.name.toLowerCase().replace(/\s+/g, '_')}.key`
      ];
      
      // Add paths based on key type
      if (key.type === 'RSA') {
        paths.push('/opt/rsa-keys/', '/var/lib/keys/rsa/');
      } else if (key.type === 'ECDSA') {
        paths.push('/opt/ecdsa-keys/', '/var/lib/keys/ecdsa/');
      }

      materials.push({
        id: key.id,
        type: 'key',
        name: key.name,
        appId: `APP-${String(index + 1).padStart(3, '0')}`,
        serviceName: key.services && key.services.length > 0 ? key.services[0] : 'Unknown Service',
        paths: paths.slice(0, Math.floor(Math.random() * 4) + 1), // Random 1-4 paths
        status: key.isActive ? 'active' : 'inactive',
        riskLevel: !key.isActive || key.keySize < 2048 ? 'high' : (key.keySize < 4096 ? 'medium' : 'low'),
        size: `${key.keySize} bits`,
        issuerOrSource: key.location || 'Unknown',
        applications: key.applications,
        isActive: key.isActive,
        keyType: key.type,
        createdDate: key.createdDate
      });
    });
    
    return materials;
  }, [data.certificates, data.keys]);

  const filterOptions = useMemo(() => {
    const getUniqueValues = (values: string[]): string[] => {
      return [...new Set(values.filter(value => value && value.trim() !== ''))];
    };

    return {
      statuses: getUniqueValues(unifiedMaterials.map(material => material.status)),
      types: getUniqueValues([
        ...unifiedMaterials.filter(m => m.certType).map(m => m.certType!),
        ...unifiedMaterials.filter(m => m.keyType).map(m => m.keyType!)
      ]),
      riskLevels: getUniqueValues(unifiedMaterials.map(material => material.riskLevel)),
      issuers: getUniqueValues(unifiedMaterials.map(material => material.issuerOrSource)),
      applications: getUniqueValues(unifiedMaterials.flatMap(material => material.applications || [])),
      services: getUniqueValues(unifiedMaterials.map(material => material.serviceName))
    };
  }, [unifiedMaterials]);

  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = unifiedMaterials.filter(material => {
      const matchesSearch = !searchFilter || 
        material.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        material.issuerOrSource.toLowerCase().includes(searchFilter.toLowerCase()) ||
        material.appId.toLowerCase().includes(searchFilter.toLowerCase()) ||
        material.serviceName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        material.paths.some(path => path.toLowerCase().includes(searchFilter.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || material.status === statusFilter;
      const matchesType = typeFilter === 'all' || material.certType === typeFilter || material.keyType === typeFilter;
      const matchesRiskLevel = riskLevelFilter === 'all' || material.riskLevel === riskLevelFilter;
      const matchesIssuer = issuerFilter === 'all' || material.issuerOrSource === issuerFilter;
      const matchesApplication = applicationFilter === 'all' || 
        (material.applications && material.applications.includes(applicationFilter));
      const matchesMaterialType = materialTypeFilter === 'all' || material.type === materialTypeFilter;
      const matchesService = serviceFilter === 'all' || material.serviceName === serviceFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesRiskLevel && 
             matchesIssuer && matchesApplication && matchesMaterialType && matchesService;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [unifiedMaterials, searchFilter, statusFilter, typeFilter, riskLevelFilter, issuerFilter, applicationFilter, materialTypeFilter, serviceFilter, sortField, sortDirection]);

  const clearFilters = () => {
    setSearchFilter('');
    setStatusFilter('all');
    setTypeFilter('all');
    setRiskLevelFilter('all');
    setIssuerFilter('all');
    setApplicationFilter('all');
    setMaterialTypeFilter('all');
    setServiceFilter('all');
  };

  const handleSort = (field: keyof UnifiedMaterial) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof UnifiedMaterial) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'}`} />;
  };

  const togglePathExpansion = (materialId: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(materialId)) {
      newExpanded.delete(materialId);
    } else {
      newExpanded.add(materialId);
    }
    setExpandedPaths(newExpanded);
  };

  const renderPaths = (material: UnifiedMaterial) => {
    const isExpanded = expandedPaths.has(material.id);
    const visiblePaths = isExpanded ? material.paths : material.paths.slice(0, 1);
    
    return (
      <div className="space-y-1">
        {visiblePaths.map((path, index) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <Folder className="h-3 w-3 text-gray-400" />
            <code className="bg-gray-100 px-1 rounded text-xs">{path}</code>
          </div>
        ))}
        {material.paths.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePathExpansion(material.id)}
            className="text-xs p-1 h-6"
          >
            {isExpanded ? `Show less` : `+${material.paths.length - 1} more`}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Streaming Status */}
      {streamingData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live data streaming enabled</span>
            </div>
          </CardContent>
        </Card>
      )}

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
                  {unifiedMaterials.filter(item => item.riskLevel === 'high').length}
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
                  {unifiedMaterials.filter(item => item.status === 'expiring').length}
                </div>
                <div className="text-sm text-gray-500">Expiring Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Cryptographic Materials Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Enhanced Filters */}
          <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search all fields..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Material Type</label>
                <Select value={materialTypeFilter} onValueChange={setMaterialTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="certificate">Certificates</SelectItem>
                    <SelectItem value="key">Keys</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Service</label>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {filterOptions.services.map(service => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <label className="text-sm font-medium mb-2 block">Crypto Type</label>
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
                <label className="text-sm font-medium mb-2 block">Issuer/Source</label>
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
                Showing {filteredAndSortedMaterials.length} of {unifiedMaterials.length} materials
                ({data.certificates.length} certificates, {data.keys.length} keys)
              </div>
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Enhanced Materials Table with prioritized columns */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('appId')}>
                    <div className="flex items-center gap-2 font-semibold">
                      App ID
                      {getSortIcon('appId')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('serviceName')}>
                    <div className="flex items-center gap-2 font-semibold">
                      Service Name
                      {getSortIcon('serviceName')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                    <div className="flex items-center gap-2">
                      Type
                      {getSortIcon('type')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead>Paths</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('size')}>
                    <div className="flex items-center gap-2">
                      Size
                      {getSortIcon('size')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('issuerOrSource')}>
                    <div className="flex items-center gap-2">
                      Issuer/Source
                      {getSortIcon('issuerOrSource')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('riskLevel')}>
                    <div className="flex items-center gap-2">
                      Risk
                      {getSortIcon('riskLevel')}
                    </div>
                  </TableHead>
                  <TableHead>Expiry/Created</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedMaterials.map((material) => (
                  <TableRow key={`${material.type}-${material.id}`}>
                    <TableCell className="font-semibold">
                      <Badge variant="outline" className="text-xs font-mono">
                        {material.appId}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{material.serviceName}</TableCell>
                    <TableCell>
                      <Badge variant={material.type === 'certificate' ? 'default' : 'secondary'} className="text-xs">
                        {material.type === 'certificate' ? (
                          <><FileKey className="h-3 w-3 mr-1" />Cert</>
                        ) : (
                          <><Key className="h-3 w-3 mr-1" />Key</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell className="max-w-xs">
                      {renderPaths(material)}
                    </TableCell>
                    <TableCell>{material.size}</TableCell>
                    <TableCell>{material.issuerOrSource}</TableCell>
                    <TableCell>{getRiskBadge(material.riskLevel)}</TableCell>
                    <TableCell>
                      {material.type === 'certificate' ? material.expiry : material.createdDate}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {material.applications?.slice(0, 2).map((app, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                        {material.applications && material.applications.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{material.applications.length - 2}
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
    </div>
  );
};

// Helper functions
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
