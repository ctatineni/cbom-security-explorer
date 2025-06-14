
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Building, Info } from 'lucide-react';
import { ServiceTreeItem } from './ServiceTreeItem';
import { useComponentsPagination } from '@/hooks/useComponentsPagination';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ApplicationTreeItemProps {
  application: {
    name: string;
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
  };
  onApplicationDetailClick: (app: any) => void;
}

export const ApplicationTreeItem: React.FC<ApplicationTreeItemProps> = ({ 
  application, 
  onApplicationDetailClick 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [servicePaginationPage, setServicePaginationPage] = useState(1);

  // Pagination for services within the application
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedServices,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    totalItems
  } = useComponentsPagination({ 
    items: application.services, 
    itemsPerPage: 10 
  });

  const toggleApplication = () => {
    setIsExpanded(!isExpanded);
  };

  const renderServicePaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 3;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => goToPage(i)}
            isActive={currentPage === i}
            className="text-xs px-2 py-1"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return links;
  };

  return (
    <div className="border rounded">
      <div className="p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <Building className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-sm truncate">{application.name}</span>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {application.services.length} services
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {totalPages > 1 && (
              <span className="text-xs text-gray-500">
                {startIndex}-{endIndex} of {totalItems}
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onApplicationDetailClick(application)}
              className="h-6 px-2"
            >
              <Info className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleApplication}
              className="h-6 px-2"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <div className="space-y-2 mt-2">
              {paginatedServices.map((service, serviceIndex) => (
                <ServiceTreeItem
                  key={serviceIndex}
                  service={service}
                  serviceIndex={serviceIndex}
                />
              ))}
            </div>

            {/* Services Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-3">
                <Pagination>
                  <PaginationContent className="text-xs">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={goToPreviousPage}
                        className={`text-xs px-2 py-1 ${!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                      />
                    </PaginationItem>
                    
                    {renderServicePaginationLinks()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={goToNextPage}
                        className={`text-xs px-2 py-1 ${!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
