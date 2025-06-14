import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { Shield, AlertTriangle, CheckCircle, Layers, Clock, ArrowRight, Search, Building, Key, FileKey, Code, Package } from 'lucide-react';
import { CBOMGraph } from '@/components/cbom/CBOMGraph';
import { CBOMSidebar } from '@/components/cbom/CBOMSidebar';
import { NavigationHeader } from '@/components/cbom/NavigationHeader';
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
import { mockCBOMData, CBOMData, Application, Service } from '@/data/mockCBOMData';
import { mockCryptoMaterialsData, CryptoMaterialsData } from '@/data/mockCryptoMaterialsData';
import { useToast } from '@/hooks/use-toast';
import { MetricsDashboard } from '@/components/cbom/MetricsDashboard';
import { WorkflowGuide } from '@/components/cbom/WorkflowGuide';
import { FlowIndicator } from '@/components/cbom/FlowIndicator';
import { ComponentsViewGuide } from '@/components/cbom/ComponentsViewGuide';

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

      // Enhanced components drill down generation with better language detection
      setTimeout(() => {
        const librariesData = generateComponentsDrillDown(query, 'libraries');
        const languagesData = generateComponentsDrillDown(query, 'languages');
        
        // Improved component filtering based on query intent
        let filteredLibraries = librariesData?.components || [];
        let filteredLanguages = languagesData?.components || [];
        
        // Enhanced language-specific filtering
        if (query.toLowerCase().includes('java')) {
          filteredLanguages = languagesData?.components.filter(comp => 
            comp.name.toLowerCase().includes('java')) || [];
          // Also filter libraries used by Java services
          filteredLibraries = librariesData?.components.filter(comp =>
            comp.services.some(service => 
              mockCBOMData.applications.some(app => 
                app.services.some(s => 
                  s.name === service.serviceName && s.programmingLanguage?.toLowerCase().includes('java')
                )
              )
            )
          ) || [];
        }
        
        if (query.toLowerCase().includes('python')) {
          filteredLanguages = languagesData?.components.filter(comp => 
            comp.name.toLowerCase().includes('python')) || [];
        }
        
        if (query.toLowerCase().includes('node') || query.toLowerCase().includes('javascript')) {
          filteredLanguages = languagesData?.components.filter(comp => 
            comp.name.toLowerCase().includes('javascript') || comp.name.toLowerCase().includes('node')) || [];
        }
        
        // Combine filtered data
        const allComponents = [
          ...filteredLibraries.map(comp => ({ ...comp, isLibrary: true, isLanguage: false })),
          ...filteredLanguages.map(comp => ({ ...comp, isLibrary: false, isLanguage: true }))
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
        
        toast({
          title: "Components Analysis Complete",
          description: `Found ${filteredLibraries.length} relevant libraries and ${filteredLanguages.length} languages matching your query.`,
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

  // Navigation handlers
  const handleBackToSearch = () => {
    setActiveTab('search-selection');
    setSelectedApplication(null);
    setSelectedService(null);
    setSelectedNode(null);
  };

  const handleBackToApplications = () => {
    setActiveTab('applications');
    setSelectedService(null);
    setSelectedNode(null);
  };

  const handleBackToServices = () => {
    setActiveTab('services');
    setSelectedService(null);
    setSelectedNode(null);
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

  const hasDataAvailable = cbomData || cryptoMaterialsData;

  // Determine which back button to show based on current tab
  const getBackButtonProps = () => {
    switch (activeTab) {
      case 'applications':
      case 'crypto-materials-results':
      case 'components-analysis':
        return { onBack: handleBackToSearch, showBackButton: true };
      case 'services':
        return { onBack: handleBackToApplications, showBackButton: true };
      case 'overview':
        return { onBack: handleBackToServices, showBackButton: true };
      default:
        return { showBackButton: false };
    }
  };

  const getCurrentWorkflowStep = () => {
    if (activeTab === 'search-selection') return 'search';
    if (activeTab === 'applications') return 'applications';
    if (activeTab === 'components-analysis') return 'components';
    if (activeTab === 'services') return 'services';
    if (activeTab === 'overview') return 'overview';
    return 'search';
  };

  const handleWorkflowStepClick = (step: string) => {
    switch (step) {
      case 'search':
        setActiveTab('search-selection');
        break;
      case 'applications':
        if (cbomData) setActiveTab('applications');
        break;
      case 'components':
        if (componentsDrillDownData) setActiveTab('components-analysis');
        break;
      case 'services':
        if (selectedApplication) setActiveTab('services');
        break;
      case 'overview':
        if (selectedService) setActiveTab('overview');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <NavigationHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          {...getBackButtonProps()}
          hasApplicationsData={!!cbomData}
          hasComponentsData={!!componentsDrillDownData}
          hasCryptoData={!!cryptoMaterialsData}
          selectedApplication={selectedApplication}
          selectedService={selectedService}
          cbomData={cbomData}
          cryptoMaterialsData={cryptoMaterialsData}
          componentsDrillDownData={componentsDrillDownData}
        />
        
        <div className="flex-1 p-6 overflow-auto">
          {/* Workflow Guide - show when data is available */}
          {hasDataAvailable && activeTab !== 'search-selection' && (
            <div className="mb-6">
              <WorkflowGuide
                currentStep={getCurrentWorkflowStep()}
                onStepClick={handleWorkflowStepClick}
              />
            </div>
          )}

          {/* Show search summary when data is available */}
          {hasDataAvailable && lastSearchQuery && activeTab !== 'search-selection' && (
            <div className="mb-6">
              <SearchSummary
                query={lastSearchQuery}
                totalApplications={cbomData?.applications.length || 0}
                totalComponents={componentsDrillDownData?.components.length || 0}
                onNavigateToApplications={() => setActiveTab('applications')}
                onNavigateToComponents={() => setActiveTab('components-analysis')}
              />
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'search-selection' && (
            <div className="space-y-6">
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
                      Search and analyze certificates, keys, and other cryptographic materials across hundreds of applications and platforms.
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
            </div>
          )}

          {activeTab === 'components-analysis' && componentsDrillDownData && (
            <ComponentsDrillDown data={componentsDrillDownData} />
          )}

          {activeTab === 'crypto-materials-results' && cryptoMaterialsData && (
            <CryptoMaterialsAnalysis data={cryptoMaterialsData} />
          )}

          {activeTab === 'applications' && cbomData && (
            <div className="space-y-6">
              <MetricsDashboard 
                services={selectedApplication ? selectedApplication.services : cbomData.applications.flatMap(app => app.services)} 
                cbomData={cbomData} 
              />
              
              {/* Flow Indicator for Applications */}
              <FlowIndicator
                title="Applications Overview Complete"
                description="You've analyzed all applications and their risk levels. Explore components or dive into specific services."
                nextStep="Analyze Components"
                nextStepDescription="View library and language usage patterns"
                onNextStep={() => setActiveTab('components-analysis')}
                stats={[
                  { label: 'Applications', value: cbomData.applications.length, color: 'text-blue-600' },
                  { label: 'Services', value: cbomData.applications.reduce((total, app) => total + app.services.length, 0), color: 'text-green-600' },
                  { label: 'Components', value: componentsDrillDownData?.components.length || 0, color: 'text-purple-600' }
                ]}
              />

              {/* Components View Guide */}
              {componentsDrillDownData && (
                <ComponentsViewGuide
                  totalComponents={componentsDrillDownData.components.length}
                  totalLibraries={componentsDrillDownData.components.filter(c => c.isLibrary).length}
                  totalLanguages={componentsDrillDownData.components.filter(c => c.isLanguage).length}
                  onViewComponents={() => setActiveTab('components-analysis')}
                />
              )}

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
            </div>
          )}

          {activeTab === 'services' && selectedApplication && (
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

          {activeTab === 'overview' && selectedService && getFilteredCBOMData() && (
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

          {selectedService && (
            <ServiceDetailsModal
              service={selectedService}
              open={showServiceDetails}
              onClose={() => setShowServiceDetails(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CBOMViewer;
