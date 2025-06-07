import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, Layers, Clock, ArrowRight, Search } from 'lucide-react';
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
import { MetricsDashboard } from '@/components/cbom/MetricsDashboard';

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
  const [activeTab, setActiveTab] = useState('services'); // Start with services tab
  
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

  const handleServiceSelectAndNavigate = (service) => {
    setSelectedService(service);
    setSelectedNode(null);
    setActiveTab('overview'); // Automatically switch to overview when service is selected
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
            {/* High-level Metrics Dashboard */}
            <MetricsDashboard services={services} cbomData={cbomData} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services" className="relative">
                  Services ({services.length})
                  {!selectedService && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="overview" disabled={!selectedService}>
                  Overview
                  {selectedService && (
                    <span className="ml-2 text-xs text-blue-600">({selectedService.name})</span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="space-y-6">
                {/* Step 1: Service Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-bold">1</div>
                      <Layers className="h-5 w-5" />
                      Select a Service to Analyze
                      {selectedService && (
                        <div className="flex items-center gap-2 ml-auto">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">
                            {selectedService.name} selected
                          </span>
                          <Button 
                            size="sm" 
                            className="ml-2"
                            onClick={() => setActiveTab('overview')}
                          >
                            View Analysis <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!selectedService && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0">
                            <Search className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Choose a service to get started</h4>
                            <p className="text-sm text-blue-700">
                              Select any service below to analyze its cryptographic dependencies and view detailed security insights.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <VirtualizedServicesGrid
                      services={services}
                      selectedService={selectedService}
                      onServiceSelect={handleServiceSelectAndNavigate}
                      onServiceDetails={handleServiceDetails}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                {!selectedService ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Layers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No Service Selected
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Please select a service from the Services tab to view its cryptographic analysis.
                      </p>
                      <Button onClick={() => setActiveTab('services')}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Go to Services
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Breadcrumb */}
                    <CBOMBreadcrumb 
                      items={[
                        { label: 'Services', onClick: () => setActiveTab('services') },
                        { label: selectedService.name, active: true }
                      ]} 
                    />

                    {/* Step 2: Analysis Results */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold">2</div>
                          <Shield className="h-5 w-5" />
                          Security Analysis for {selectedService.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{getFilteredCBOMData()?.cryptoAlgorithms?.length || 0}</div>
                            <div className="text-sm text-gray-500">Crypto Algorithms</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{getFilteredCBOMData()?.libraries?.length || 0}</div>
                            <div className="text-sm text-gray-500">Libraries</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${
                              selectedService.riskLevel === 'high' ? 'text-red-600' :
                              selectedService.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {selectedService.riskLevel.toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-500">Risk Level</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${
                              selectedService.pqcCompatible ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {selectedService.pqcCompatible ? 'READY' : 'MIGRATION'}
                            </div>
                            <div className="text-sm text-gray-500">PQC Status</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Graph Visualization */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-600px)]">
                      <div className="lg:col-span-3">
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>Cryptographic Dependencies - {selectedService.name}</span>
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
                  </>
                )}
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
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-bold">1</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Start Your Analysis
              </h3>
              <p className="text-gray-500 mb-4">
                Ask a natural language question about your cryptographic dependencies or scan a GitHub repository to begin.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                <span>Step 1: Generate data</span>
                <ArrowRight className="h-4 w-4" />
                <span>Step 2: Select service</span>
                <ArrowRight className="h-4 w-4" />
                <span>Step 3: View analysis</span>
              </div>
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
            open={showServiceDetails}
            onClose={() => setShowServiceDetails(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CBOMViewer;
