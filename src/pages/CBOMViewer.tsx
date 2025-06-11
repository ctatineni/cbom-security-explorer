import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, Layers, Clock, ArrowRight, Search, Building, Key, FileKey } from 'lucide-react';
import { CBOMGraph } from '@/components/cbom/CBOMGraph';
import { CBOMSidebar } from '@/components/cbom/CBOMSidebar';
import { CBOMHeader } from '@/components/cbom/CBOMHeader';
import { NaturalLanguageSearch } from '@/components/cbom/NaturalLanguageSearch';
import { CryptoMaterialsSearch } from '@/components/cbom/CryptoMaterialsSearch';
import { VirtualizedServicesGrid } from '@/components/cbom/VirtualizedServicesGrid';
import { DataFormatHandler } from '@/components/cbom/DataFormatHandler';
import { ServiceDetailsModal } from '@/components/cbom/ServiceDetailsModal';
import { CBOMBreadcrumb } from '@/components/cbom/CBOMBreadcrumb';
import { ApplicationSelector } from '@/components/cbom/ApplicationSelector';
import { LibrariesDrillDown } from '@/components/cbom/LibrariesDrillDown';
import { CryptoMaterialsKnowledgeGraph } from '@/components/cbom/CryptoMaterialsKnowledgeGraph';
import { mockCBOMData, CBOMData, Application, Service } from '@/data/mockCBOMData';
import { mockCryptoMaterialsData, CryptoMaterialsData } from '@/data/mockCryptoMaterialsData';
import { useToast } from '@/hooks/use-toast';
import { MetricsDashboard } from '@/components/cbom/MetricsDashboard';

interface DataSource {
  type: 'single' | 'multiple' | 'github';
  format: string;
  lastUpdated: string;
  serviceCount: number;
  status: 'active' | 'processing' | 'error';
}

const CBOMViewer = () => {
  const [searchMode, setSearchMode] = useState<'cbom' | 'crypto-materials'>('cbom');
  const [cbomData, setCbomData] = useState<CBOMData | null>(null);
  const [cryptoMaterialsData, setCryptoMaterialsData] = useState<CryptoMaterialsData | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('search-selection');
  const [librariesDrillDownData, setLibrariesDrillDownData] = useState(null);
  
  const [dataSources] = useState<DataSource[]>([
    {
      type: 'multiple' as const,
      format: 'Combined CBOM Report',
      lastUpdated: '2 hours ago',
      serviceCount: 156,
      status: 'active' as const
    },
    {
      type: 'single' as const,
      format: 'Per-Service Reports',
      lastUpdated: '1 day ago',
      serviceCount: 89,
      status: 'active' as const
    },
    {
      type: 'github' as const,
      format: 'GitHub Scan Results',
      lastUpdated: '3 days ago',
      serviceCount: 234,
      status: 'processing' as const
    }
  ]);
  
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>(dataSources[0]);
  const { toast } = useToast();

  const handleNaturalLanguageSearch = async (query: string) => {
    setLoading(true);
    
    // Check if query is asking for libraries analysis
    if (query.toLowerCase().includes('libraries') && query.toLowerCase().includes('rsa-2048')) {
      setTimeout(() => {
        const drillDownData = generateLibrariesDrillDown(query);
        setLibrariesDrillDownData(drillDownData);
        setActiveTab('libraries-analysis');
        setLoading(false);
        
        toast({
          title: "Libraries Analysis Complete",
          description: `Found ${drillDownData.libraries.length} unique libraries using RSA-2048 across ${drillDownData.totalApplications} applications.`,
        });
      }, 2000);
    } else {
      setTimeout(() => {
        setCbomData(mockCBOMData);
        setSelectedApplication(null);
        setSelectedService(null);
        setActiveTab('applications');
        setLoading(false);
        
        toast({
          title: "Analysis Complete",
          description: `Found ${mockCBOMData.applications.length} applications with ${mockCBOMData.applications.reduce((total, app) => total + app.services.length, 0)} total services.`,
        });
      }, 2000);
    }
  };

  const handleCryptoMaterialsSearch = async (query: string) => {
    setLoading(true);
    
    setTimeout(() => {
      setCryptoMaterialsData(mockCryptoMaterialsData);
      setActiveTab('crypto-materials-results');
      setLoading(false);
      
      toast({
        title: "Crypto Materials Analysis Complete",
        description: `Found ${mockCryptoMaterialsData.certificates.length} certificates and ${mockCryptoMaterialsData.keys.length} keys matching your criteria.`,
      });
    }, 2000);
  };

  const generateLibrariesDrillDown = (query: string) => {
    if (!cbomData) return null;
    
    // Extract all libraries using RSA-2048 and aggregate data
    const libraryUsage = new Map();
    
    cbomData.applications.forEach(app => {
      app.services.forEach(service => {
        service.libraries?.forEach(lib => {
          if (lib.algorithms?.includes('rsa-2048')) {
            const key = lib.name;
            if (!libraryUsage.has(key)) {
              libraryUsage.set(key, {
                library: lib,
                applications: new Set(),
                services: [],
                totalUsages: 0
              });
            }
            
            libraryUsage.get(key).applications.add(app.name);
            libraryUsage.get(key).services.push({
              serviceName: service.name,
              applicationName: app.name,
              usage: lib.functions || []
            });
            libraryUsage.get(key).totalUsages++;
          }
        });
      });
    });
    
    // Convert to sorted array
    const libraries = Array.from(libraryUsage.values())
      .map(data => ({
        ...data.library,
        applicationCount: data.applications.size,
        serviceCount: data.services.length,
        applications: Array.from(data.applications),
        services: data.services
      }))
      .sort((a, b) => b.applicationCount - a.applicationCount);
    
    return {
      query,
      libraries,
      totalApplications: cbomData.applications.length,
      totalServices: cbomData.applications.reduce((total, app) => total + app.services.length, 0)
    };
  };

  const handleGitHubScan = async (url: string) => {
    toast({
      title: "GitHub Scan Initiated",
      description: "Your repository is being analyzed. Results will be available in approximately 30 minutes.",
      duration: 5000,
    });
    
    console.log('Starting GitHub scan for:', url);
  };

  const handleApplicationSelect = (application: Application) => {
    setSelectedApplication(application);
    setSelectedService(null);
    setSelectedNode(null);
    setActiveTab('services');
  };

  const handleNodeSelect = (nodeData) => {
    setSelectedNode(nodeData);
  };

  const handleServiceSelectAndNavigate = (service: Service) => {
    setSelectedService(service);
    setSelectedNode(null);
    setActiveTab('overview');
  };

  const handleServiceDetails = (service: Service) => {
    setSelectedService(service);
    setShowServiceDetails(true);
  };

  const getFilteredCBOMData = (): any => {
    if (!selectedService || !cbomData || !selectedApplication) return null;
    
    // Create a compatible structure for the graph component
    return {
      application: {
        name: selectedService.name,
        version: selectedService.version || '1.0.0',
        riskLevel: selectedService.riskLevel
      },
      cryptoAlgorithms: selectedService.cryptoAlgorithms,
      libraries: selectedService.libraries,
      metrics: cbomData.metrics
    };
  };

  const getCurrentServices = (): Service[] => {
    if (!selectedApplication) return [];
    return selectedApplication.services;
  };

  const getBreadcrumbItems = () => {
    const items = [];
    
    if (selectedApplication) {
      items.push({ 
        label: 'Applications', 
        onClick: () => {
          setActiveTab('applications');
          setSelectedApplication(null);
          setSelectedService(null);
        }
      });
      items.push({ 
        label: selectedApplication.name, 
        onClick: () => {
          setActiveTab('services');
          setSelectedService(null);
        }
      });
    }
    
    if (selectedService) {
      items.push({ label: selectedService.name, active: true });
    }
    
    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CBOMHeader />
      
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="search-selection">
              <Search className="h-4 w-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="applications" disabled={!cbomData}>
              <Building className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="services" disabled={!selectedApplication}>
              <Layers className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="overview" disabled={!selectedService}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="libraries-analysis" disabled={!librariesDrillDownData}>
              Libraries
            </TabsTrigger>
            <TabsTrigger value="crypto-materials-results" disabled={!cryptoMaterialsData}>
              <Key className="h-4 w-4 mr-2" />
              Materials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search-selection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`cursor-pointer transition-all hover:shadow-lg ${searchMode === 'cbom' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`} 
                    onClick={() => setSearchMode('cbom')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    Crypto Bill of Materials (CBOM)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Analyze cryptographic capabilities, algorithms, and libraries across your applications and services.
                  </p>
                  <div className="text-sm text-gray-500">
                    • Find deprecated algorithms
                    • Analyze library usage across applications
                    • Risk assessment and compliance
                  </div>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all hover:shadow-lg ${searchMode === 'crypto-materials' ? 'ring-2 ring-green-500 bg-green-50' : ''}`} 
                    onClick={() => setSearchMode('crypto-materials')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileKey className="h-6 w-6 text-green-600" />
                    Crypto Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Search and analyze certificates, keys, and other cryptographic materials across your infrastructure.
                  </p>
                  <div className="text-sm text-gray-500">
                    • Certificate expiration tracking
                    • Key strength analysis
                    • Usage patterns and relationships
                  </div>
                </CardContent>
              </Card>
            </div>

            {searchMode === 'cbom' && (
              <NaturalLanguageSearch
                onSearch={handleNaturalLanguageSearch}
                onGitHubScan={handleGitHubScan}
                loading={loading}
              />
            )}

            {searchMode === 'crypto-materials' && (
              <CryptoMaterialsSearch
                onSearch={handleCryptoMaterialsSearch}
                loading={loading}
              />
            )}
          </TabsContent>

          <TabsContent value="libraries-analysis" className="space-y-6">
            {librariesDrillDownData && (
              <LibrariesDrillDown data={librariesDrillDownData} />
            )}
          </TabsContent>

          <TabsContent value="crypto-materials-results" className="space-y-6">
            {cryptoMaterialsData && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Crypto Materials Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{cryptoMaterialsData.certificates.length}</div>
                        <div className="text-sm text-gray-500">Certificates</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{cryptoMaterialsData.keys.length}</div>
                        <div className="text-sm text-gray-500">Keys</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{cryptoMaterialsData.relationships.length}</div>
                        <div className="text-sm text-gray-500">Relationships</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <CryptoMaterialsKnowledgeGraph data={cryptoMaterialsData} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            {cbomData && (
              <>
                <MetricsDashboard 
                  services={selectedApplication ? selectedApplication.services : cbomData.applications.flatMap(app => app.services)} 
                  cbomData={cbomData} 
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ApplicationSelector
                      applications={cbomData.applications}
                      selectedApplication={selectedApplication}
                      onApplicationSelect={handleApplicationSelect}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {selectedApplication && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Services in {selectedApplication.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VirtualizedServicesGrid
                    services={getCurrentServices()}
                    selectedService={selectedService}
                    onServiceSelect={handleServiceSelectAndNavigate}
                    onServiceDetails={handleServiceDetails}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            {selectedService && getFilteredCBOMData() && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
                <div className="lg:col-span-3">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Cryptographic Dependencies - {selectedService.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-80px)]">
                      <CBOMGraph 
                        data={getFilteredCBOMData()}
                        onNodeSelect={handleNodeSelect}
                        selectedNode={selectedNode}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <CBOMSidebar 
                    selectedNode={selectedNode}
                    cbomData={getFilteredCBOMData()}
                    onNodeSelect={handleNodeSelect}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedService && (
          <ServiceDetailsModal
            service={selectedService}
            open={showServiceDetails}
            onClose={() => setShowServiceDetails(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CBOMViewer;
