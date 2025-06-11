
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronRight, Package, Building, Layers, AlertTriangle, CheckCircle } from 'lucide-react';

interface LibrariesDrillDownProps {
  data: {
    query: string;
    libraries: Array<{
      id: string;
      name: string;
      version: string;
      applicationCount: number;
      serviceCount: number;
      applications: string[];
      services: Array<{
        serviceName: string;
        applicationName: string;
        usage: Array<{
          name: string;
          usedIn: string[];
          purpose: string;
        }>;
      }>;
      hasVulnerabilities: boolean;
    }>;
    totalApplications: number;
    totalServices: number;
  };
}

export const LibrariesDrillDown: React.FC<LibrariesDrillDownProps> = ({ data }) => {
  const [expandedLibraries, setExpandedLibraries] = useState<Set<string>>(new Set());
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  const toggleLibrary = (libraryId: string) => {
    const newExpanded = new Set(expandedLibraries);
    if (newExpanded.has(libraryId)) {
      newExpanded.delete(libraryId);
    } else {
      newExpanded.add(libraryId);
    }
    setExpandedLibraries(newExpanded);
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

  const getRiskBadge = (hasVulnerabilities: boolean) => {
    return hasVulnerabilities ? (
      <Badge variant="destructive" className="text-xs">
        <AlertTriangle className="h-3 w-3 mr-1" />
        High Risk
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        Low Risk
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Libraries Analysis Results
          </CardTitle>
          <p className="text-sm text-gray-600">
            Query: "{data.query}"
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.libraries.length}</div>
              <div className="text-sm text-gray-500">Unique Libraries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.totalApplications}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.totalServices}</div>
              <div className="text-sm text-gray-500">Total Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {data.libraries.filter(lib => lib.hasVulnerabilities).length}
              </div>
              <div className="text-sm text-gray-500">Vulnerable Libraries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Libraries Ranked by Usage</CardTitle>
          <p className="text-sm text-gray-600">
            Sorted by number of applications using each library
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.libraries.map((library) => (
              <div key={library.id} className="border rounded-lg">
                <Collapsible
                  open={expandedLibraries.has(library.id)}
                  onOpenChange={() => toggleLibrary(library.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {expandedLibraries.has(library.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <Package className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">{library.name}</div>
                            <div className="text-sm text-gray-500">Version {library.version}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getRiskBadge(library.hasVulnerabilities)}
                          <div className="text-right">
                            <div className="text-sm font-medium">{library.applicationCount} apps</div>
                            <div className="text-xs text-gray-500">{library.serviceCount} services</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-2 border-t bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Applications ({library.applicationCount})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {library.applications.map((app, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {app}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            Services Usage ({library.serviceCount})
                          </h4>
                          <div className="space-y-2">
                            {library.services.map((service, serviceIndex) => {
                              const serviceKey = `${library.id}-${serviceIndex}`;
                              return (
                                <div key={serviceIndex} className="border rounded bg-white">
                                  <Collapsible
                                    open={expandedServices.has(serviceKey)}
                                    onOpenChange={() => toggleService(serviceKey)}
                                  >
                                    <CollapsibleTrigger asChild>
                                      <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            {expandedServices.has(serviceKey) ? (
                                              <ChevronDown className="h-3 w-3" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3" />
                                            )}
                                            <span className="font-medium text-sm">{service.serviceName}</span>
                                            <Badge variant="outline" className="text-xs">
                                              {service.applicationName}
                                            </Badge>
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {service.usage.length} functions
                                          </div>
                                        </div>
                                      </div>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent>
                                      <div className="px-3 pb-3 border-t">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="text-xs">Function</TableHead>
                                              <TableHead className="text-xs">Used In</TableHead>
                                              <TableHead className="text-xs">Purpose</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {service.usage.map((func, funcIndex) => (
                                              <TableRow key={funcIndex}>
                                                <TableCell className="text-xs font-mono">{func.name}</TableCell>
                                                <TableCell className="text-xs">
                                                  {func.usedIn.join(', ')}
                                                </TableCell>
                                                <TableCell className="text-xs">{func.purpose}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
