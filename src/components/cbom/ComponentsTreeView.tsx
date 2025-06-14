
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Building, Layers, Package, Code, Eye, Info } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useComponentsPagination } from '@/hooks/useComponentsPagination';
import { ComponentDetailModal } from './ComponentDetailModal';
import { ApplicationDetailModal } from './ApplicationDetailModal';

interface ComponentsTreeViewProps {
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

export const ComponentsTreeView: React.FC<ComponentsTreeViewProps> = ({ component, getRiskBadge }) => {
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
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

  // Pagination for services within each application
  const [servicePaginationState, setServicePaginationState] = useState<Record<string, number>>({});

  const getServicePagination = (appName: string, services: any[]) => {
    const currentPage = servicePaginationState[appName] || 1;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(services.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedServices = services.slice(startIndex, endIndex);

    return {
      currentPage,
      totalPages,
      paginatedServices,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, services.length),
      totalServices: services.length,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      goToPage: (page: number) => {
        if (page >= 1 && page <= totalPages) {
          setServicePaginationState(prev => ({ ...prev, [appName]: page }));
        }
      },
      goToNextPage: () => {
        if (currentPage < totalPages) {
          setServicePaginationState(prev => ({ ...prev, [appName]: currentPage + 1 }));
        }
      },
      goToPreviousPage: () => {
        if (currentPage > 1) {
          setServicePaginationState(prev => ({ ...prev, [appName]: currentPage - 1 }));
        }
      }
    };
  };

  const toggleApplication = (appName: string) => {
    const newExpanded = new Set(expandedApplications);
    if (newExpanded.has(appName)) {
      newExpanded.delete(appName);
    } else {
      newExpanded.add(appName);
    }
    setExpandedApplications(newExpanded);
  };

  const toggleService = (serviceKey: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceKey)) {
      newExpanded.delete(serviceKey);
    } else {
      newExpanded.add(serviceKey);
    }
    setExpandedServices(newExpanded);
  };

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

  const renderServicePaginationLinks = (appName: string, pagination: any) => {
    const links = [];
    const maxVisiblePages = 3;
    
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => pagination.goToPage(i)}
            isActive={pagination.currentPage === i}
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
            {paginatedApplications.map((app) => {
              const servicePagination = getServicePagination(app.name, app.services);
              const isExpanded = expandedApplications.has(app.name);
              
              return (
                <div key={app.name} className="border rounded">
                  <div className="p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <Building className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-sm truncate">{app.name}</span>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {app.services.length} services
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {servicePagination.totalPages > 1 && (
                          <span className="text-xs text-gray-500">
                            {servicePagination.startIndex}-{servicePagination.endIndex} of {servicePagination.totalServices}
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApplicationDetailClick(app)}
                          className="h-6 px-2"
                        >
                          <Info className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleApplication(app.name)}
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
                          {servicePagination.paginatedServices.map((service, serviceIndex) => {
                            const serviceKey = `${app.name}-${serviceIndex}`;
                            const isServiceExpanded = expandedServices.has(serviceKey);
                            return (
                              <div key={serviceIndex} className="border rounded bg-white">
                                <div className="p-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1">
                                      <Layers className="h-3 w-3 text-green-600 flex-shrink-0" />
                                      <span className="text-sm truncate">{service.serviceName}</span>
                                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                                        {service.usage.length} library functions
                                      </Badge>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => toggleService(serviceKey)}
                                      className="h-6 px-2 flex-shrink-0"
                                    >
                                      {isServiceExpanded ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                  
                                  <Collapsible open={isServiceExpanded}>
                                    <CollapsibleContent>
                                      <div className="border-t mt-2 pt-2">
                                        <div className="space-y-1">
                                          {service.usage.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex justify-between items-center text-xs p-1 bg-gray-50 rounded">
                                              <span className="font-mono truncate">{item.name}</span>
                                              <span className="text-gray-500 flex-shrink-0 ml-2">
                                                {item.purpose || item.framework || 'N/A'}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Services Pagination */}
                        {servicePagination.totalPages > 1 && (
                          <div className="flex justify-center mt-3">
                            <Pagination>
                              <PaginationContent className="text-xs">
                                <PaginationItem>
                                  <PaginationPrevious 
                                    onClick={servicePagination.goToPreviousPage}
                                    className={`text-xs px-2 py-1 ${!servicePagination.hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                                  />
                                </PaginationItem>
                                
                                {renderServicePaginationLinks(app.name, servicePagination)}
                                
                                <PaginationItem>
                                  <PaginationNext 
                                    onClick={servicePagination.goToNextPage}
                                    className={`text-xs px-2 py-1 ${!servicePagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
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
            })}
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
