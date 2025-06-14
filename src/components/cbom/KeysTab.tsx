import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Search, ArrowUpDown, Folder, Eye, Shield } from 'lucide-react';
import { CryptoKey } from '@/data/mockCryptoMaterialsData';

interface KeysTabProps {
  keys: CryptoKey[];
  onFiltersChange?: (filters: any) => void;
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
  status: string;
  createdDate: string;
  applications: string[];
  isActive: boolean;
}

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const KeysTab: React.FC<KeysTabProps> = ({ keys, onFiltersChange }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [keyTypeFilter, setKeyTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof KeyRow>('appId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);

  // Debounce search to prevent excessive filtering
  const debouncedSearchFilter = useDebounce(searchFilter, 300);

  // Memoize key rows transformation
  const keyRows = useMemo((): KeyRow[] => {
    console.log('Transforming key rows...');
    return keys.map((key, index) => {
      const paths = [
        `/home/user/.ssh/${key.name.toLowerCase().replace(/\s+/g, '_')}`,
        `/etc/keys/${key.name.toLowerCase().replace(/\s+/g, '_')}.key`,
        `/var/lib/keys/${key.name.toLowerCase().replace(/\s+/g, '_')}.pem`
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
        createdDate: key.createdDate || 'Unknown',
        applications: key.applications || [],
        isActive: key.isActive
      };
    });
  }, [keys]);

  // Optimized filter options calculation
  const filterOptions = useMemo(() => {
    console.log('Calculating filter options...');
    const getUniqueValues = (values: string[]): string[] => {
      return [...new Set(values.filter(value => value && value.trim() !== ''))];
    };

    return {
      statuses: getUniqueValues(keyRows.map(row => row.status)),
      keyTypes: getUniqueValues(keyRows.map(row => row.keyType)),
      sources: getUniqueValues(keyRows.map(row => row.source)),
      applications: getUniqueValues(keyRows.flatMap(row => row.applications)),
      services: getUniqueValues(keyRows.map(row => row.serviceName))
    };
  }, [keyRows]);

  // Optimized filtering and sorting
  const filteredAndSortedRows = useMemo(() => {
    console.log('Filtering and sorting rows...');
    setIsProcessing(true);
    
    let filtered = keyRows;

    // Apply search filter
    if (debouncedSearchFilter) {
      filtered = filtered.filter(row => {
        if (searchField === 'all') {
          return Object.values(row).some(value => 
            String(value).toLowerCase().includes(debouncedSearchFilter.toLowerCase()) ||
            (Array.isArray(value) && value.some(v => String(v).toLowerCase().includes(debouncedSearchFilter.toLowerCase())))
          );
        } else {
          const fieldValue = row[searchField as keyof KeyRow];
          if (Array.isArray(fieldValue)) {
            return fieldValue.some(v => String(v).toLowerCase().includes(debouncedSearchFilter.toLowerCase()));
          }
          return String(fieldValue).toLowerCase().includes(debouncedSearchFilter.toLowerCase());
        }
      });
    }

    // Apply other filters
    if (statusFilter !== 'all') {
      filtered = filtered.filter(row => row.status === statusFilter);
    }
    if (keyTypeFilter !== 'all') {
      filtered = filtered.filter(row => row.keyType === keyTypeFilter);
    }
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(row => row.source === sourceFilter);
    }
    if (applicationFilter !== 'all') {
      filtered = filtered.filter(row => row.applications.includes(applicationFilter));
    }
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(row => row.serviceName === serviceFilter);
    }

    // Sort
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

    setTimeout(() => setIsProcessing(false), 100);
    return filtered;
  }, [keyRows, debouncedSearchFilter, searchField, statusFilter, keyTypeFilter, sourceFilter, applicationFilter, serviceFilter, sortField, sortDirection]);

  // Reset to page 1 when filters change or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchFilter, searchField, statusFilter, keyTypeFilter, sourceFilter, applicationFilter, serviceFilter, itemsPerPage]);

  // Notify parent about filter changes
  useEffect(() => {
    if (onFiltersChange) {
      const currentFilters = {
        search: debouncedSearchFilter,
        searchField,
        status: statusFilter,
        keyType: keyTypeFilter,
        source: sourceFilter,
        application: applicationFilter,
        service: serviceFilter
      };
      onFiltersChange(currentFilters);
    }
  }, [debouncedSearchFilter, searchField, statusFilter, keyTypeFilter, sourceFilter, applicationFilter, serviceFilter, onFiltersChange]);

  const totalPages = Math.ceil(filteredAndSortedRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRows = filteredAndSortedRows.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = useCallback(() => {
    setSearchFilter('');
    setSearchField('all');
    setStatusFilter('all');
    setKeyTypeFilter('all');
    setSourceFilter('all');
    setApplicationFilter('all');
    setServiceFilter('all');
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((field: keyof KeyRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const getSortIcon = useCallback((field: keyof KeyRow) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'}`} />;
  }, [sortField, sortDirection]);

  const togglePathExpansion = useCallback((rowId: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedPaths(newExpanded);
  }, [expandedPaths]);

  const renderPaths = useCallback((row: KeyRow) => {
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
  }, [expandedPaths, togglePathExpansion]);

  // Enhanced pagination with ellipsis for large datasets
  const renderPaginationItems = useCallback(() => {
    const items = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        />
      </PaginationItem>
    );

    // First page if not in visible range
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Visible page range
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => setCurrentPage(page)}
            isActive={currentPage === page}
            className="cursor-pointer"
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page if not in visible range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        />
      </PaginationItem>
    );

    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-4">
      {/* Processing indicator */}
      {isProcessing && (
        <div className="text-center text-sm text-gray-500 py-2">
          Processing filters...
        </div>
      )}

      {/* Enhanced Filters */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedRows.length)} of {filteredAndSortedRows.length} keys
            {filteredAndSortedRows.length !== keys.length && (
              <span className="text-blue-600 ml-1">
                (filtered from {keys.length} total)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              Clear Filters
            </Button>
          </div>
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
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.map((row) => (
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
                <TableCell>
                  <Badge variant={row.status === 'active' ? 'secondary' : 'destructive'} className="text-xs">
                    {row.status}
                  </Badge>
                </TableCell>
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

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <Pagination>
            <PaginationContent>
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
          <div className="text-sm text-gray-500">
            {filteredAndSortedRows.length} results
          </div>
        </div>
      )}
    </div>
  );
};
