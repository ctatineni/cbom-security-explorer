import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, BarChart3 } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ComponentsMetrics } from './ComponentsMetrics';
import { ComponentsTreeView } from './ComponentsTreeView';
import { ComponentsSummaryCard } from './ComponentsSummaryCard';
import { ComponentsFilters } from './ComponentsFilters';
import { getRiskBadge } from './ComponentsRiskBadge';
import { useComponentsFiltering } from '@/hooks/useComponentsFiltering';
import { useComponentsPagination } from '@/hooks/useComponentsPagination';

interface ComponentsDrillDownProps {
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
}

export const ComponentsDrillDown: React.FC<ComponentsDrillDownProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('metrics');
  
  const {
    searchFilter,
    setSearchFilter,
    minApplicationsFilter,
    setMinApplicationsFilter,
    componentTypeFilter,
    setComponentTypeFilter,
    filteredComponents,
    clearFilters
  } = useComponentsFiltering(data.components);

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedComponents,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    totalItems
  } = useComponentsPagination({ 
    items: filteredComponents, 
    itemsPerPage: 10 
  });

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [searchFilter, minApplicationsFilter, componentTypeFilter, resetPagination]);

  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      links.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => goToPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        links.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => goToPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        links.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      links.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => goToPage(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return links;
  };

  return (
    <div className="space-y-6">
      <ComponentsSummaryCard data={data} />

      <Card>
        <CardHeader>
          <CardTitle>Component Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metrics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Metrics & Impact
              </TabsTrigger>
              <TabsTrigger value="components">
                <Package className="h-4 w-4 mr-2" />
                Component Details
                <Badge variant="secondary" className="ml-2 text-xs">{data.components.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <ComponentsMetrics data={data} />
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <ComponentsFilters
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                componentTypeFilter={componentTypeFilter}
                setComponentTypeFilter={setComponentTypeFilter}
                minApplicationsFilter={minApplicationsFilter}
                setMinApplicationsFilter={setMinApplicationsFilter}
                onClear={clearFilters}
              />

              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>
                  Showing {startIndex}-{endIndex} of {totalItems} components
                </span>
                {totalPages > 1 && (
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {paginatedComponents.map((component) => (
                  <ComponentsTreeView
                    key={component.id}
                    component={component}
                    getRiskBadge={getRiskBadge}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={goToPreviousPage}
                          className={!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {renderPaginationLinks()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={goToNextPage}
                          className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
