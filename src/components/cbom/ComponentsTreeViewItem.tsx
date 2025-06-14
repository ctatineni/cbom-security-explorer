
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Package, Code, Eye } from 'lucide-react';
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
        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {component.isLibrary ? (
                <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
              ) : (
                <Code className="h-5 w-5 text-purple-600 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium truncate">{component.name}</span>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {component.isLibrary ? 'Library' : 'Language'}
                  </Badge>
                  <span className="text-sm text-gray-500 flex-shrink-0">
                    {component.isLibrary 
                      ? `Version ${component.version || 'N/A'}`
                      : `Language: ${component.language || component.name}`
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {getRiskBadge(component)}
              <div className="text-right">
                <div className="text-sm font-medium">{component.applicationCount} apps</div>
                <div className="text-xs text-gray-500">{component.serviceCount} services</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowComponentDetail(true)}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                Details
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
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
