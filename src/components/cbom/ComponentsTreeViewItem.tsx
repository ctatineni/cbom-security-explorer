
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Package, Code, Eye, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ApplicationTreeItem } from './ApplicationTreeItem';
import { useComponentsPagination } from '@/hooks/useComponentsPagination';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ComponentDetailModal } from './ComponentDetailModal';
import { ApplicationDetailModal } from './ApplicationDetailModal';

interface ComponentsTreeViewItemProps {
  component: {
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
  };
  getRiskBadge: (component: any) => React.ReactNode;
}

export const ComponentsTreeViewItem: React.FC<ComponentsTreeViewItemProps> = ({ component, getRiskBadge }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComponentDetail, setShowComponentDetail] = useState(false);
  const [showApplicationDetail, setShowApplicationDetail] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  // Group services by application
  const servicesByApp = component.services.reduce((acc, service) => {
    if (!acc[service.applicationName]) {
      acc[service.applicationName] = [];
    }
    acc[service.applicationName].push(service);
    return acc;
  }, {} as Record<string, typeof component.services>);

  // Convert to array for pagination
  const applicationsArray = Object.entries(servicesByApp).map(([appName, appServices]) => ({
    name: appName,
    services: appServices
  }));

  // Pagination for applications
  const {
    currentPage: currentAppPage,
    totalPages: totalAppPages,
    paginatedItems: paginatedApplications,
    goToPage: goToAppPage,
    goToNextPage: goToNextAppPage,
    goToPreviousPage: goToPreviousAppPage,
    hasNextPage: hasNextAppPage,
    hasPreviousPage: hasPreviousAppPage,
    startIndex: appStartIndex,
    endIndex: appEndIndex,
    totalItems: totalApps
  } = useComponentsPagination({ 
    items: applicationsArray, 
    itemsPerPage: 5 
  });

  const handleApplicationDetailClick = (app: any) => {
    setSelectedApplication(app);
    setShowApplicationDetail(true);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderApplicationPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 3;
    
    let startPage = Math.max(1, currentAppPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalAppPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => goToAppPage(i)}
            isActive={currentAppPage === i}
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
    <>
      <div className="border rounded-lg">
        {/* Component Header - Everything in one line */}
        <div className="p-3 bg-gray-50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Icon */}
              {component.isLibrary ? (
                <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
              ) : (
                <Code className="h-4 w-4 text-purple-600 flex-shrink-0" />
              )}
              
              {/* Component Name */}
              <span className="font-medium text-sm truncate">{component.name}</span>
              
              {/* Type Badge */}
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {component.isLibrary ? 'Library' : 'Language'}
              </Badge>
              
              {/* Version/Language */}
              <span className="text-xs text-gray-500 flex-shrink-0">
                {component.isLibrary 
                  ? `v${component.version || 'N/A'}`
                  : component.language || component.name
                }
              </span>
              
              {/* Risk Badge */}
              <div className="flex-shrink-0">
                {getRiskBadge(component)}
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-gray-600 flex-shrink-0">
                <span>{component.applicationCount} apps</span>
                <span>{component.serviceCount} services</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowComponentDetail(true)}
                className="h-7 px-2 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleExpanded}
                className="h-7 px-2"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Collapsible Applications Section */}
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <div className="p-4 space-y-3 border-t bg-white">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Applications ({component.applicationCount})
                </h4>
                {totalAppPages > 1 && (
                  <span className="text-xs text-gray-500">
                    {appStartIndex}-{appEndIndex} of {totalApps}
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                {paginatedApplications.map((app) => (
                  <ApplicationTreeItem
                    key={app.name}
                    application={app}
                    onApplicationDetailClick={handleApplicationDetailClick}
                  />
                ))}
              </div>

              {/* Applications Pagination */}
              {totalAppPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={goToPreviousAppPage}
                          className={!hasPreviousAppPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {renderApplicationPaginationLinks()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={goToNextAppPage}
                          className={!hasNextAppPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Component Detail Modal */}
      <ComponentDetailModal
        component={component}
        open={showComponentDetail}
        onClose={() => setShowComponentDetail(false)}
      />

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        open={showApplicationDetail}
        onClose={() => setShowApplicationDetail(false)}
      />
    </>
  );
};
