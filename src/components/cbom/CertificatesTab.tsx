import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Search, ArrowUpDown, Folder, Eye, Calendar, Shield } from 'lucide-react';
import { Certificate } from '@/data/mockCryptoMaterialsData';

interface CertificatesTabProps {
  certificates: Certificate[];
  onFiltersChange?: (filters: any) => void;
}

interface CertificateRow {
  id: string;
  appId: string;
  serviceName: string;
  subject: string;
  issuer: string;
  paths: string[];
  source: string;
  status: string;
  expiryDate: string;
  daysUntilExpiry: number;
  applications: string[];
  isExpired: boolean;
}

const ITEMS_PER_PAGE = 50;

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

export const CertificatesTab: React.FC<CertificatesTabProps> = ({ certificates, onFiltersChange }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [issuerFilter, setIssuerFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof CertificateRow>('appId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Debounce search to prevent excessive filtering
  const debouncedSearchFilter = useDebounce(searchFilter, 300);

  // Memoize certificate rows transformation
  const certificateRows = useMemo((): CertificateRow[] => {
    console.log('Transforming certificate rows...');
    return certificates.map((cert, index) => {
      const paths = [
        `/etc/ssl/certs/${cert.commonName.toLowerCase().replace(/[\s=,]/g, '_')}.crt`,
        `/var/lib/ssl/${cert.commonName.toLowerCase().replace(/[\s=,]/g, '_')}.pem`
      ];
      
      if (cert.issuer.includes('Let\'s Encrypt')) {
        paths.push('/etc/letsencrypt/live/', '/opt/letsencrypt/');
      } else if (cert.issuer.includes('Internal')) {
        paths.push('/etc/internal-ca/', '/opt/ca-certs/');
      }

      return {
        id: cert.id,
        appId: `APP-${String(index + 1).padStart(3, '0')}`,
        serviceName: cert.services && cert.services.length > 0 ? cert.services[0] : 'Unknown Service',
        subject: cert.commonName,
        issuer: cert.issuer,
        paths: paths.slice(0, Math.floor(Math.random() * 3) + 1),
        source: cert.issuer.includes('Let\'s Encrypt') ? 'Let\'s Encrypt' : 
                cert.issuer.includes('DigiCert') ? 'DigiCert' : 
                cert.issuer.includes('Internal') ? 'Internal CA' : 'External CA',
        status: cert.isExpired ? 'expired' : (cert.daysUntilExpiry < 30 ? 'expiring' : 'valid'),
        expiryDate: cert.validTo,
        daysUntilExpiry: cert.daysUntilExpiry,
        applications: cert.applications || [],
        isExpired: cert.isExpired
      };
    });
  }, [certificates]);

  // Optimized filter options calculation
  const filterOptions = useMemo(() => {
    console.log('Calculating filter options...');
    const getUniqueValues = (values: string[]): string[] => {
      return [...new Set(values.filter(value => value && value.trim() !== ''))];
    };

    return {
      statuses: getUniqueValues(certificateRows.map(row => row.status)),
      sources: getUniqueValues(certificateRows.map(row => row.source)),
      applications: getUniqueValues(certificateRows.flatMap(row => row.applications)),
      services: getUniqueValues(certificateRows.map(row => row.serviceName)),
      issuers: getUniqueValues(certificateRows.map(row => row.issuer))
    };
  }, [certificateRows]);

  // Optimized filtering and sorting
  const filteredAndSortedRows = useMemo(() => {
    console.log('Filtering and sorting rows...');
    setIsProcessing(true);
    
    let filtered = certificateRows;

    // Apply search filter
    if (debouncedSearchFilter) {
      filtered = filtered.filter(row => {
        if (searchField === 'all') {
          return Object.values(row).some(value => 
            String(value).toLowerCase().includes(debouncedSearchFilter.toLowerCase()) ||
            (Array.isArray(value) && value.some(v => String(v).toLowerCase().includes(debouncedSearchFilter.toLowerCase())))
          );
        } else {
          const fieldValue = row[searchField as keyof CertificateRow];
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
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(row => row.source === sourceFilter);
    }
    if (applicationFilter !== 'all') {
      filtered = filtered.filter(row => row.applications.includes(applicationFilter));
    }
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(row => row.serviceName === serviceFilter);
    }
    if (issuerFilter !== 'all') {
      filtered = filtered.filter(row => row.issuer.includes(issuerFilter));
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
  }, [certificateRows, debouncedSearchFilter, searchField, statusFilter, sourceFilter, applicationFilter, serviceFilter, issuerFilter, sortField, sortDirection]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchFilter, searchField, statusFilter, sourceFilter, applicationFilter, serviceFilter, issuerFilter]);

  // Notify parent about filter changes
  useEffect(() => {
    if (onFiltersChange) {
      const currentFilters = {
        search: debouncedSearchFilter,
        searchField,
        status: statusFilter,
        source: sourceFilter,
        application: applicationFilter,
        service: serviceFilter,
        issuer: issuerFilter
      };
      onFiltersChange(currentFilters);
    }
  }, [debouncedSearchFilter, searchField, statusFilter, sourceFilter, applicationFilter, serviceFilter, issuerFilter, onFiltersChange]);

  const totalPages = Math.ceil(filteredAndSortedRows.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRows = filteredAndSortedRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const clearFilters = useCallback(() => {
    setSearchFilter('');
    setSearchField('all');
    setStatusFilter('all');
    setSourceFilter('all');
    setApplicationFilter('all');
    setServiceFilter('all');
    setIssuerFilter('all');
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((field: keyof CertificateRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const getSortIcon = useCallback((field: keyof CertificateRow) => {
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

  const renderPaths = useCallback((row: CertificateRow) => {
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

  const getStatusBadge = useCallback((status: string, daysUntilExpiry: number) => {
    if (status === 'expired') {
      return (
        <Badge variant="destructive" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    
    if (status === 'expiring') {
      return (
        <Badge className="text-xs bg-yellow-500">
          <Calendar className="h-3 w-3 mr-1" />
          Expiring ({daysUntilExpiry}d)
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="text-xs">
        <Shield className="h-3 w-3 mr-1" />
        Valid ({daysUntilExpiry}d)
      </Badge>
    );
  }, []);

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
                <SelectItem value="subject">Subject</SelectItem>
                <SelectItem value="issuer">Issuer</SelectItem>
                <SelectItem value="source">Source</SelectItem>
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
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedRows.length)} of {filteredAndSortedRows.length} certificates
            {filteredAndSortedRows.length !== certificates.length && (
              <span className="text-blue-600 ml-1">
                (filtered from {certificates.length} total)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={ITEMS_PER_PAGE.toString()} onValueChange={(value) => {
              // For now, keep fixed at 50, but could be made dynamic
              console.log('Items per page:', value);
            }}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
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
              <TableHead className="cursor-pointer" onClick={() => handleSort('subject')}>
                <div className="flex items-center gap-2">
                  Subject
                  {getSortIcon('subject')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('issuer')}>
                <div className="flex items-center gap-2">
                  Issuer
                  {getSortIcon('issuer')}
                </div>
              </TableHead>
              <TableHead>Paths</TableHead>
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
              <TableHead>Expiry Date</TableHead>
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
                <TableCell className="font-medium max-w-xs truncate" title={row.subject}>
                  {row.subject}
                </TableCell>
                <TableCell className="max-w-xs truncate" title={row.issuer}>
                  {row.issuer}
                </TableCell>
                <TableCell className="max-w-xs">
                  {renderPaths(row)}
                </TableCell>
                <TableCell>{row.source}</TableCell>
                <TableCell>{getStatusBadge(row.status, row.daysUntilExpiry)}</TableCell>
                <TableCell>{row.expiryDate}</TableCell>
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
