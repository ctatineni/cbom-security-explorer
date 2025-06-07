
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, Layers, Clock } from 'lucide-react';
import { CBOMGraph } from '@/components/cbom/CBOMGraph';
import { CBOMSidebar } from '@/components/cbom/CBOMSidebar';
import { CBOMHeader } from '@/components/cbom/CBOMHeader';
import { NaturalLanguageSearch } from '@/components/cbom/NaturalLanguageSearch';
import { VirtualizedServicesGrid } from '@/components/cbom/VirtualizedServicesGrid';
import { DataFormatHandler } from '@/components/cbom/DataFormatHandler';
import { ServiceDetailsModal } from '@/components/cbom/ServiceDetailsModal';
import { CBOMBreadcrumb } from '@/components/cbom/CBOMBreadcrumb';
import { mockCBOMData } from '@/data/mockCBOMData';
import { useToast } from '@/hooks/use-toast';

interface DataSource {
  type: 'single' | 'multiple' | 'github';
  format: string;
  lastUpdated: string;
  serviceCount: number;
  status: 'active' | 'processing' | 'error';
}

// Generate mock data for hundreds of services
const generateMockServices = (count: number) => {
  const services = [];
  const riskLevels = ['low', 'medium', 'high'];
  const serviceTypes = ['Auth', 'Payment', 'Data', 'API', 'Cache', 'Storage', 'Analytics', 'Notification'];
  const languages = ['Java', 'Python', 'JavaScript', 'C#', 'Go', 'Rust', 'C++'];
  
  for (let i = 0; i < count; i++) {
    const type = serviceTypes[i % serviceTypes.length];
    const language = languages[Math.floor(Math.random() * languages.length)];
    const pqcCompatible = Math.random() > 0.4; // 60% are PQC compatible
    
    services.push({
      id: `service-${i + 1}`,
      name: `${type} Service ${Math.floor(i / serviceTypes.length) + 1}`,
      version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      description: `Handles ${type.toLowerCase()} operations for the application`,
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      cryptoAlgorithms: mockCBOMData.cryptoAlgorithms.slice(0, Math.floor(Math.random() * 3) + 1).map(a => a.id),
      libraries: mockCBOMData.libraries.slice(0, Math.floor(Math.random() * 2) + 1).map(l => l.id),
      programmingLanguage: language,
      languageVersion: language === 'Java' ? '11' : language === 'Python' ? '3.9' : '14.0',
      pqcCompatible,
    });
  }
  return services;
};

const CBOMViewer = () => {
  const [cbomData, setCbomData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  
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
    
    // Simulate AI processing
    setTimeout(() => {
      // Generate mock services based on the query
      const serviceCount = Math.floor(Math.random() * 200) + 50;
      const mockServices = generateMockServices(serviceCount);
      
      setCbomData({
        ...mockCBOMData,
        services: mockServices
      });
      setServices(mockServices);
      setSelectedService(null);
      setLoading(false);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${serviceCount} services matching your query.`,
      });
    }, 2000);
  };

  const handleGitHubScan = async (url: string) => {
    toast({
      title: "GitHub Scan Initiated",
      description: "Your repository is being analyzed. Results will be available in approximately 30 minutes.",
      duration: 5000,
    });
    
    // Here you would normally make an API call to start the GitHub scanning process
    console.log('Starting GitHub scan for:', url);
  };

  const handleNodeSelect = (nodeData) => {
    setSelectedNode(nodeData);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedNode(null);
  };

  const handleServiceDetails = (service) => {
    setSelectedService(service);
    setShowServiceDetails(true);
  };

  const getFilteredCBOMData = () => {
    if (!selectedService || !cbomData) return cbomData;
    
    const serviceCryptoAlgorithms = cbomData.cryptoAlgorithms.filter(algo => 
      selectedService.cryptoAlgorithms.includes(algo.id)
    );
    
    const serviceLibraries = cbomData.libraries.filter(lib => 
      selectedService.libraries.includes(lib.id)
    );

    return {
      ...cbomData,
      cryptoAlgorithms: serviceCryptoAlgorithms,
      libraries: serviceLibraries,
      application: {
        ...cbomData.application,
        name: selectedService.name,
        version: selectedService.version,
        riskLevel: selectedService.riskLevel
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CBOMHeader />
      
      <div className="container mx-auto p-6">
        {/* AI Search Interface */}
        <div className="mb-6">
          <NaturalLanguageSearch
            onSearch={handleNaturalLanguageSearch}
            onGitHubScan={handleGitHubScan}
            loading={loading}
          />
        </div>

        {/* Main Content */}
        {cbomData && (
          <div className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
                <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Metrics Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                        <div className="text-sm text-gray-500">Total Services</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{cbomData.metrics.secure}</div>
                        <div className="text-sm text-gray-500">Secure</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{cbomData.metrics.warnings}</div>
                        <div className="text-sm text-gray-500">Warnings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{cbomData.metrics.critical}</div>
                        <div className="text-sm text-gray-500">Critical</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Graph Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-500px)]">
                  <div className="lg:col-span-3">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>
                            Cryptographic Dependencies
                            {selectedService && (
                              <span className="text-sm font-normal text-gray-600 ml-2">
                                - {selectedService.name}
                              </span>
                            )}
                          </span>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{cbomData.metrics.secure}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              <span>{cbomData.metrics.warnings}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span>{cbomData.metrics.critical}</span>
                            </div>
                          </div>
                        </CardTitle>
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
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Application Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VirtualizedServicesGrid
                      services={services}
                      selectedService={selectedService}
                      onServiceSelect={handleServiceSelect}
                      onServiceDetails={handleServiceDetails}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data-sources" className="space-y-6">
                <DataFormatHandler
                  dataSources={dataSources}
                  selectedSource={selectedDataSource}
                  onSourceSelect={setSelectedDataSource}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* No Data State */}
        {!cbomData && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Ready for AI-Powered Analysis
              </h3>
              <p className="text-gray-500">
                Ask a natural language question about your cryptographic dependencies or scan a GitHub repository
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Analyzing Dependencies
              </h3>
              <p className="text-gray-500">
                AI is processing your request and analyzing cryptographic patterns...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Service Details Modal */}
        {selectedService && (
          <ServiceDetailsModal
            service={selectedService}
            isOpen={showServiceDetails}
            onClose={() => setShowServiceDetails(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CBOMViewer;
