
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ArrowUpDown, Folder, Eye, Shield } from 'lucide-react';
import { CryptoKey } from '@/data/mockCryptoMaterialsData';

interface KeysTabProps {
  keys: CryptoKey[];
}

interface KeyRow {
  id: string;
  appId: string;
  serviceName: string;
  name: string;
  paths: string[];
  size: string;
  source: string;
  keyType: string;
  riskLevel: string;
  status: string;
  createdDate: string;
  applications: string[];
  isActive: boolean;
}

export const KeysTab: React.FC<KeysTabProps> = ({ keys }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [keyTypeFilter, setKeyTypeFilter] = useState('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof KeyRow>('appId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const keyRows = useMemo((): KeyRow[] => {
    return keys.map((key, index) => {
      const paths = [
        `/home/user/.ssh/${key.name.toLowerCase().replace(/\s+/g, '_')}`,
        `/etc/keys/${key.name.toLowerCase().replace(/\s+/g, '_')}.key`
      ];
      
      if (key.type === 'RSA') {
        paths.push('/opt/rsa-keys/', '/var/lib/keys/rsa/');
      } else if (key.type === 'ECDSA') {
        paths.push('/opt/ecdsa-keys/', '/var/lib/keys/ecdsa/');
      }

      return {
        id: key.id,
        appId: `APP-${String(index + 1).padStart(3, '0')}`,
        serviceName: key.services && key.services.length > 0 ? key.services[0] : 'Unknown Service',
        name: key.name,
        paths: paths.slice(0, Math.floor(Math.random() * 4) + 1),
        size: `${key.keySize} bits`,
        source: key.location || 'Generated',
        keyType: key.type,
        status: key.isActive ? 'active' : 'inactive',
        riskLevel: !key.isActive || key.keySize < 2048 ? 'high' : (key.keySize < 4096 ? 'medium' : 'low'),
        createdDate: key.createdDate || 'Unknown',
        applications: key.applications || [],
        isActive: key.isActive
      };
    });
  }, [keys]);

  const filterOptions = useMemo(() => {
    const getUniqueValues = (values: string[]): string[] => {
      return [...new Set(values.filter(value => value && value.trim() !== ''))];
    };

    const filtered = keyRows.filter(row => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (keyTypeFilter !== 'all' && row.keyType !== keyTypeFilter) return false;
      if (riskLevelFilter !== 'all' && row.riskLevel !== riskLevelFilter) return false;
      if (sourceFilter !== 'all' && row.source !== sourceFilter) return false;
      if (applicationFilter !== 'all' && !row.applications.includes(applicationFilter)) return false;
      if (serviceFilter !== 'all' && row.serviceName !== serviceFilter) return false;
      return true;
    });

    return {
      statuses: getUniqueValues(filtered.map(row => row.status)),
      keyTypes: getUniqueValues(filtered.map(row => row.keyType)),
      riskLevels: getUniqueValues(filtered.map(row => row.riskLevel)),
      sources: getUniqueValues(filtered.map(row => row.source)),
      applications: getUniqueValues(filtered.flatMap(row => row.applications)),
      services: getUniqueValues(filtered.map(row => row.serviceName))
    };
  }, [keyRows, statusFilter, keyTypeFilter, riskLevelFilter, sourceFilter, applicationFilter, serviceFilter]);

  const filteredAndSortedRows = useMemo(() => {
    let filtered = keyRows.filter(row => {
      if (!searchFilter) return true;
      
      if (searchField === 'all') {
        return Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchFilter.toLowerCase()) ||
          (Array.isArray(value) && value.some(v => String(v).toLowerCase().includes(searchFilter.toLowerCase())))
        );
      } else {
        const fieldValue = row[searchField as keyof KeyRow];
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(v => String(v).toLowerCase().includes(searchFilter.toLowerCase()));
        }
        return String(fieldValue).toLowerCase().includes(searchFilter.toLowerCase());
      }
    }).filter(row => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (keyTypeFilter !== 'all' && row.keyType !== keyTypeFilter) return false;
      if (riskLevelFilter !== 'all' && row.riskLevel !== riskLevelFilter) return false;
      if (sourceFilter !== 'all' && row.source !== sourceFilter) return false;
      if (applicationFilter !== 'all' && !row.applications.includes(applicationFilter)) return false;
      if (serviceFilter !== 'all' && row.serviceName !== serviceFilter) return false;
      return true;
    });

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
  }, [keyRows, searchFilter, searchField, statusFilter, keyTypeFilter, riskLevelFilter, sourceFilter, applicationFilter, serviceFilter, sortField, sortDirection]);

  const clearFilters = () => {
    setSearchFilter('');
    setSearchField('all');
    setStatusFilter('all');
    setKeyTypeFilter('all');
    setRiskLevelFilter('all');
    setSourceFilter('all');
    setApplicationFilter('all');
    setServiceFilter('all');
  };

  const handleSort = (field: keyof KeyRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof KeyRow) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'}`} />;
  };

  const togglePathExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedPaths(newExpanded);
  };

  const renderPaths = (row: KeyRow) => {
    const isExpanded = expandedPaths.has(row.id);
    const visiblePaths = isExpanded ? row.paths : row.paths.slice(0, 1);
    
    return (
      <div className="space-y-1">
        {visiblePaths.map((path, index) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <Folder className="h-3 w-3 text-gray-400" />
            <code className="bg-gray-100 px-1 rounded text-xs">{path}</code>
          </div>
        ))}
        {row.paths.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePathExpansion(row.id)}
            className="text-xs p-1 h-6"
          >
            {isExpanded ? `Show less` : `+${row.paths.length - 1} more`}
          </Button>
        )}
      </div>
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

  return (
    <div className="space-y-4">
      {/* Enhanced Filters */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Search Field</label>
            <Select value={searchField} onValueChange={setSearchField}>
              <SelectTrigger>
                <SelectValue placeholder="All Fields" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="appId">App ID</SelectItem>
                <SelectItem value="serviceName">Service Name</SelectItem>
                <SelectItem value="name">Key Name</SelectItem>
                <SelectItem value="source">Source</SelectItem>
                <SelectItem value="keyType">Key Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${searchField === 'all' ? 'all fields' : searchField}...`}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <label className="text-sm font-medium mb-2 block">Key Type</label>
            <Select value={keyTypeFilter} onValueChange={setKeyTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {filterOptions.keyTypes.map(type => (
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
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {filterOptions.sources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
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
            Showing {filteredAndSortedRows.length} of {keyRows.length} keys
          </div>
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Keys Table */}
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
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">
                  Key Name
                  {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead>Paths</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('keyType')}>
                <div className="flex items-center gap-2">
                  Key Type
                  {getSortIcon('keyType')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('size')}>
                <div className="flex items-center gap-2">
                  Key Size
                  {getSortIcon('size')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('source')}>
                <div className="flex items-center gap-2">
                  Source
                  {getSortIcon('source')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('riskLevel')}>
                <div className="flex items-center gap-2">
                  Risk
                  {getSortIcon('riskLevel')}
                </div>
              </TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-semibold">
                  <Badge variant="outline" className="text-xs font-mono">
                    {row.appId}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{row.serviceName}</TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="max-w-xs">
                  {renderPaths(row)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {row.keyType}
                  </Badge>
                </TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>{row.source}</TableCell>
                <TableCell>{getRiskBadge(row.riskLevel)}</TableCell>
                <TableCell>{row.createdDate}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {row.applications?.slice(0, 2).map((app, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {app}
                      </Badge>
                    ))}
                    {row.applications && row.applications.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{row.applications.length - 2}
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
    </div>
  );
};
