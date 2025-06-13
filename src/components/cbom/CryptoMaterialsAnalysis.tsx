
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, Clock, Eye, Filter, Search, FileKey, Key, Shield, ArrowUpDown } from 'lucide-react';
import { CryptoMaterialsKnowledgeGraph } from './CryptoMaterialsKnowledgeGraph';
import { CryptoMaterialsData, Certificate, CryptoKey } from '@/data/mockCryptoMaterialsData';

interface CryptoMaterialsAnalysisProps {
  data: CryptoMaterialsData;
}

interface UnifiedMaterial {
  id: string;
  type: 'certificate' | 'key';
  name: string;
  appId: string;
  serviceName: string;
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

export const CryptoMaterialsAnalysis: React.FC<CryptoMaterialsAnalysisProps> = ({ data }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [issuerFilter, setIssuerFilter] = useState('all');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [materialTypeFilter, setMaterialTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof UnifiedMaterial>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const unifiedMaterials = useMemo((): UnifiedMaterial[] => {
    const materials: UnifiedMaterial[] = [];
    
    // Transform certificates
    data.certificates.forEach((cert, index) => {
      materials.push({
        id: cert.id,
        type: 'certificate',
        name: cert.commonName,
        appId: `APP-${String(index + 1).padStart(3, '0')}`,
        serviceName: cert.services && cert.services.length > 0 ? cert.services[0] : 'Unknown Service',
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
    
    // Transform keys
    data.keys.forEach((key, index) => {
      materials.push({
        id: key.id,
        type: 'key',
        name: key.name,
        appId: `APP-${String(index + 1).padStart(3, '0')}`,
        serviceName: key.services && key.services.length > 0 ? key.services[0] : 'Unknown Service',
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
      applications: getUniqueValues(unifiedMaterials.flatMap(material => material.applications || []))
    };
  }, [unifiedMaterials]);

  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = unifiedMaterials.filter(material => {
      const matchesSearch = !searchFilter || 
        material.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        material.issuerOrSource.toLowerCase().includes(searchFilter.toLowerCase()) ||
        material.appId.toLowerCase().includes(searchFilter.toLowerCase()) ||
        material.serviceName.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || material.status === statusFilter;
      const matchesType = typeFilter === 'all' || material.certType === typeFilter || material.keyType === typeFilter;
      const matchesRiskLevel = riskLevelFilter === 'all' || material.riskLevel === riskLevelFilter;
      const matchesIssuer = issuerFilter === 'all' || material.issuerOrSource === issuerFilter;
      const matchesApplication = applicationFilter === 'all' || 
        (material.applications && material.applications.includes(applicationFilter));
      const matchesMaterialType = materialTypeFilter === 'all' || material.type === materialTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesRiskLevel && 
             matchesIssuer && matchesApplication && matchesMaterialType;
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
  }, [unifiedMaterials, searchFilter, statusFilter, typeFilter, riskLevelFilter, issuerFilter, applicationFilter, materialTypeFilter, sortField, sortDirection]);

  const clearFilters = () => {
    setSearchFilter('');
    setStatusFilter('all');
    setTypeFilter('all');
    setRiskLevelFilter('all');
    setIssuerFilter('all');
    setApplicationFilter('all');
    setMaterialTypeFilter('all');
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
            Crypto Materials Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Advanced Filters */}
          <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search materials..."
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

          {/* Unified Materials Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort('appId')}>
                    <div className="flex items-center gap-2">
                      App ID
                      {getSortIcon('appId')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('serviceName')}>
                    <div className="flex items-center gap-2">
                      Service
                      {getSortIcon('serviceName')}
                    </div>
                  </TableHead>
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-2">
                      Status
                      {getSortIcon('status')}
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
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {material.appId}
                      </Badge>
                    </TableCell>
                    <TableCell>{material.serviceName}</TableCell>
                    <TableCell>{material.size}</TableCell>
                    <TableCell>{material.issuerOrSource}</TableCell>
                    <TableCell>{getStatusBadge(material.status)}</TableCell>
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
