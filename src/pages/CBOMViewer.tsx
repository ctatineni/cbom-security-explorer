import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { Shield, AlertTriangle, CheckCircle, Layers, Clock, ArrowRight, Search, Building, Key, FileKey, Code, Package } from 'lucide-react';
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
import { ComponentsDrillDown } from '@/components/cbom/ComponentsDrillDown';
import { CryptoMaterialsAnalysis } from '@/components/cbom/CryptoMaterialsAnalysis';
import { SearchSummary } from '@/components/cbom/SearchSummary';
import { TabNavigationHelper } from '@/components/cbom/TabNavigationHelper';
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
  const [componentsDrillDownData, setComponentsDrillDownData] = useState(null);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  
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
    setLastSearchQuery(query);
    
    // Simulate search - always load mock data first
    setTimeout(() => {
      setCbomData(mockCBOMData);
      setLoading(false);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${mockCBOMData.applications.length} applications with ${mockCBOMData.applications.reduce((total, app) => total + app.services.length, 0)} total services.`,
      });

      // Always generate components drill down data for both libraries and languages
      setTimeout(() => {
        const librariesData = generateComponentsDrillDown(query, 'libraries');
        const languagesData = generateComponentsDrillDown(query, 'languages');
        
        // Combine both libraries and languages into a single components array with backend flags
        const allComponents = [
          ...(librariesData?.components.map(comp => ({ ...comp, isLibrary: true, isLanguage: false })) || []),
          ...(languagesData?.components.map(comp => ({ ...comp, isLibrary: false, isLanguage: true })) || [])
        ];
        
        const combinedData = {
          query,
          componentType: 'libraries' as const,
          components: allComponents,
          totalApplications: mockCBOMData.applications.length,
          totalServices: mockCBOMData.applications.reduce((total, app) => total + app.services.length, 0)
        };
        
        setComponentsDrillDownData(combinedData);
        
        // Auto-navigate to applications tab after search completion
        setActiveTab('applications');
        
        const totalComponents = allComponents.length;
        toast({
          title: "Components Analysis Complete",
          description: `Found ${librariesData?.components.length || 0} libraries and ${languagesData?.components.length || 0} languages across ${combinedData.totalApplications} applications.`,
        });
      }, 500);
    }, 2000);
  };

  const handleCryptoMaterialsSearch = async (query: string) => {
    setLoading(true);
    setLastSearchQuery(query);
    
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

  const generateComponentsDrillDown = (query: string, componentType: 'libraries' | 'languages') => {
    if (!cbomData) return null;
    
    const componentUsage = new Map();
    
    cbomData.applications.forEach(app => {
      app.services.forEach(service => {
        if (componentType === 'libraries' && service.libraries) {
          service.libraries.forEach(lib => {
            const key = lib.name;
            if (!componentUsage.has(key)) {
              componentUsage.set(key, {
                id: lib.name.toLowerCase().replace(/\s+/g, '-'),
                name: lib.name,
                version: lib.version,
                hasVulnerabilities: lib.algorithms?.includes('deprecated') || false,
                applications: new Set(),
                services: [],
                totalUsages: 0
              });
            }
            
            componentUsage.get(key).applications.add(app.name);
            componentUsage.get(key).services.push({
              serviceName: service.name,
              applicationName: app.name,
              appId: app.id,
              usage: lib.functions || []
            });
            componentUsage.get(key).totalUsages++;
          });
        } else if (componentType === 'languages') {
          const language = service.programmingLanguage;
          if (language) {
            const key = language;
            if (!componentUsage.has(key)) {
              componentUsage.set(key, {
                id: language.toLowerCase().replace(/\s+/g, '-'),
                name: language,
                language: language,
                hasVulnerabilities: false,
                applications: new Set(),
                services: [],
                totalUsages: 0
              });
            }
            
            componentUsage.get(key).applications.add(app.name);
            componentUsage.get(key).services.push({
              serviceName: service.name,
              applicationName: app.name,
              appId: app.id,
              usage: service.libraries?.map(lib => ({
                name: lib.name,
                framework: lib.name,
                purpose: 'Library dependency'
              })) || []
            });
            componentUsage.get(key).totalUsages++;
          }
        }
      });
    });
    
    const components = Array.from(componentUsage.values())
      .map(data => ({
        ...data,
        applicationCount: data.applications.size,
        serviceCount: data.services.length,
        applications: Array.from(data.applications),
        services: data.services
      }))
      .sort((a, b) => b.applicationCount - a.applicationCount);
    
    return {
      query,
      componentType,
      components,
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

  const hasDataAvailable = cbomData || cryptoMaterialsData;

  return (
    <div className="min-h-screen bg-gray-50">
      <CBOMHeader />
      
      <div className="container mx-auto p-6">
        {/* Show search summary and navigation helper when data is available */}
        {hasDataAvailable && lastSearchQuery && activeTab !== 'search-selection' && (
          <div className="space-y-4 mb-6">
            <SearchSummary
              query={lastSearchQuery}
              totalApplications={cbomData?.applications.length || 0}
              totalComponents={componentsDrillDownData?.components.length || 0}
              onNavigateToApplications={() => setActiveTab('applications')}
              onNavigateToComponents={() => setActiveTab('components-analysis')}
            />
            
            <TabNavigationHelper
              activeTab={activeTab}
              hasApplicationsData={!!cbomData}
              hasComponentsData={!!componentsDrillDownData}
              hasCryptoData={!!cryptoMaterialsData}
              selectedApplication={selectedApplication}
              selectedService={selectedService}
              onTabChange={setActiveTab}
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Only show tab list when we have data or are on search */}
          {(hasDataAvailable || activeTab === 'search-selection') && (
            <TabsList className={`grid w-full ${hasDataAvailable ? 'grid-cols-6' : 'grid-cols-1'}`}>
              <TabsTrigger value="search-selection">
                <Search className="h-4 w-4 mr-2" />
                Search
              </TabsTrigger>
              {hasDataAvailable && (
                <>
                  <TabsTrigger value="applications" disabled={!cbomData}>
                    <Building className="h-4 w-4 mr-2" />
                    Applications
                    {cbomData && <Badge variant="secondary" className="ml-2 text-xs">{cbomData.applications.length}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="services" disabled={!selectedApplication}>
                    <Layers className="h-4 w-4 mr-2" />
                    Services
                    {selectedApplication && <Badge variant="secondary" className="ml-2 text-xs">{selectedApplication.services.length}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="overview" disabled={!selectedService}>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="components-analysis" disabled={!componentsDrillDownData}>
                    <Package className="h-4 w-4 mr-2" />
                    Components
                    {componentsDrillDownData && <Badge variant="secondary" className="ml-2 text-xs">{componentsDrillDownData.components.length}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="crypto-materials-results" disabled={!cryptoMaterialsData}>
                    <Key className="h-4 w-4 mr-2" />
                    Materials
                    {cryptoMaterialsData && <Badge variant="secondary" className="ml-2 text-xs">{cryptoMaterialsData.certificates.length + cryptoMaterialsData.keys.length}</Badge>}
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          )}

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
                    Analyze cryptographic capabilities, algorithms, libraries, and programming languages across your applications.
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>• Find deprecated algorithms and libraries</div>
                    <div>• Analyze component usage across applications</div>
                    <div>• Programming language distribution</div>
                    <div>• Risk assessment and compliance</div>
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
                    Search and analyze certificates, keys, and cryptographic materials across hundreds of applications and platforms.
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>• Certificate expiration tracking</div>
                    <div>• Key strength and usage analysis</div>
                    <div>• Cross-platform material relationships</div>
                    <div>• Compliance and security monitoring</div>
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

          <TabsContent value="components-analysis" className="space-y-6">
            {componentsDrillDownData && (
              <ComponentsDrillDown data={componentsDrillDownData} />
            )}
          </TabsContent>

          <TabsContent value="crypto-materials-results" className="space-y-6">
            {cryptoMaterialsData && (
              <CryptoMaterialsAnalysis data={cryptoMaterialsData} />
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
