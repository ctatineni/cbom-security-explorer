import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Building, Layers, FileKey, Server } from 'lucide-react';
import { CBOMGraph } from '@/components/cbom/CBOMGraph';
import { CBOMSidebar } from '@/components/cbom/CBOMSidebar';
import { NavigationHeader } from '@/components/cbom/NavigationHeader';
import { NaturalLanguageSearch } from '@/components/cbom/NaturalLanguageSearch';
import { CryptoMaterialsSearch } from '@/components/cbom/CryptoMaterialsSearch';
import { VirtualizedServicesGrid } from '@/components/cbom/VirtualizedServicesGrid';
import { ServiceDetailsModal } from '@/components/cbom/ServiceDetailsModal';
import { ApplicationSelector } from '@/components/cbom/ApplicationSelector';
import { ComponentsDrillDown } from '@/components/cbom/ComponentsDrillDown';
import { CryptoMaterialsAnalysis } from '@/components/cbom/CryptoMaterialsAnalysis';
import { SearchSummary } from '@/components/cbom/SearchSummary';
import { MetricsDashboard } from '@/components/cbom/MetricsDashboard';
import { WorkflowGuide } from '@/components/cbom/WorkflowGuide';
import { FlowIndicator } from '@/components/cbom/FlowIndicator';
import { ComponentsViewGuide } from '@/components/cbom/ComponentsViewGuide';
import { GraphControls } from '@/components/cbom/GraphControls';
import { useCBOMViewer } from '@/hooks/useCBOMViewer';
import { getFilteredCBOMData } from '@/utils/cbomDataUtils';
import { filterAlgorithmsAndProtocols } from '@/utils/algorithmFilterUtils';
import { CryptoMaterialsWorkflow } from '@/components/cbom/CryptoMaterialsWorkflow';
import { HostsGrid } from '@/components/cbom/HostsGrid';

const CBOMViewer = () => {
  const { state, handlers } = useCBOMViewer();

  const getCurrentServicesAndHosts = () => {
    if (!state.selectedApplication) return { services: [], hosts: [] };
    return {
      services: state.selectedApplication.services,
      hosts: state.selectedApplication.hosts || []
    };
  };

  const hasDataAvailable = state.cbomData || state.cryptoMaterialsData;

  const getBackButtonProps = () => {
    switch (state.activeTab) {
      case 'applications':
      case 'crypto-materials-results':
        return { onBack: handlers.handleBackToSearch, showBackButton: true };
      case 'services':
        return { onBack: handlers.handleBackToApplications, showBackButton: true };
      case 'overview':
        if (state.selectedService || state.selectedHost) {
          return { onBack: handlers.handleBackToServices, showBackButton: true };
        }
        return { showBackButton: false };
      default:
        return { showBackButton: false };
    }
  };

  const getCurrentWorkflowStep = () => {
    if (state.activeTab === 'search-selection') return 'search';
    if (state.activeTab === 'applications') return 'applications';
    if (state.activeTab === 'services' || state.activeTab === 'hosts') return 'services';
    if (state.activeTab === 'components-analysis') return 'components';
    if (state.activeTab === 'overview') return 'overview';
    return 'search';
  };

  const handleWorkflowStepClick = (step: string) => {
    switch (step) {
      case 'search':
        handlers.setActiveTab('search-selection');
        break;
      case 'applications':
        if (state.cbomData) handlers.setActiveTab('applications');
        break;
      case 'services':
        if (state.selectedApplication) handlers.setActiveTab('services');
        break;
      case 'components':
        if (state.componentsDrillDownData) handlers.setActiveTab('components-analysis');
        break;
      case 'overview':
        if (state.selectedService || state.selectedHost) handlers.setActiveTab('overview');
        break;
    }
  };

  const filteredCBOMData = getFilteredCBOMData(state.selectedService || state.selectedHost, state.cbomData, state.selectedApplication);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader
        activeTab={state.activeTab}
        onTabChange={handlers.setActiveTab}
        {...getBackButtonProps()}
        hasApplicationsData={!!state.cbomData}
        hasComponentsData={!!state.componentsDrillDownData}
        hasCryptoData={!!state.cryptoMaterialsData}
        selectedApplication={state.selectedApplication}
        selectedService={state.selectedService}
        cbomData={state.cbomData}
        cryptoMaterialsData={state.cryptoMaterialsData}
        componentsDrillDownData={state.componentsDrillDownData}
      />
      
      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Workflow Guide Section */}
        {hasDataAvailable && state.activeTab !== 'search-selection' && (
          <>
            {state.searchMode === 'cbom' && (
              <WorkflowGuide
                currentStep={getCurrentWorkflowStep()}
                onStepClick={handleWorkflowStepClick}
                hasApplicationsData={!!state.cbomData}
                hasServicesData={!!state.selectedApplication}
                hasComponentsData={!!state.componentsDrillDownData}
                selectedService={state.selectedService}
                selectedHost={state.selectedHost}
              />
            )}
            {state.searchMode === 'crypto-materials' && (
              <CryptoMaterialsWorkflow
                currentStep={state.activeTab === 'crypto-materials-results' ? 'results' : 'search'}
                onStepClick={(step) => {
                  if (step === 'search') {
                    handlers.setActiveTab('search-selection');
                  } else if (step === 'results' && state.cryptoMaterialsData) {
                    handlers.setActiveTab('crypto-materials-results');
                  }
                }}
              />
            )}
          </>
        )}

        {/* Search Summary Section */}
        {hasDataAvailable && state.lastSearchQuery && state.activeTab !== 'search-selection' && (
          <SearchSummary
            query={state.lastSearchQuery}
            totalApplications={state.cbomData?.applications.length || 0}
            totalComponents={state.componentsDrillDownData?.components.length || 0}
            onNavigateToApplications={() => handlers.setActiveTab('applications')}
            onNavigateToComponents={() => handlers.setActiveTab('components-analysis')}
          />
        )}

        {/* Main Content Area */}
        <div className="min-h-[600px]">
          {state.activeTab === 'search-selection' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Search Mode Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`cursor-pointer transition-all hover:shadow-lg border-2 hover:scale-105 ${state.searchMode === 'cbom' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'}`} 
                      onClick={() => handlers.setSearchMode('cbom')}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      Crypto Bill of Materials (CBOM)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Analyze cryptographic capabilities, algorithms, libraries, and programming languages across your applications.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        Find deprecated algorithms and libraries
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        Analyze component usage across applications
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        Programming language distribution
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        Risk assessment and compliance
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all hover:shadow-lg border-2 hover:scale-105 ${state.searchMode === 'crypto-materials' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:border-green-300'}`} 
                      onClick={() => handlers.setSearchMode('crypto-materials')}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileKey className="h-4 w-4 text-green-600" />
                      </div>
                      Crypto Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Search and analyze certificates, keys, and other cryptographic materials across hundreds of applications and platforms.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Certificate expiration tracking
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Key strength and usage analysis
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Cross-platform material relationships
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Compliance and security monitoring
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search Interface */}
              <div className="max-w-6xl mx-auto">
                {state.searchMode === 'cbom' && (
                  <NaturalLanguageSearch
                    onSearch={handlers.handleNaturalLanguageSearch}
                    onGitHubScan={handlers.handleGitHubScan}
                    loading={state.loading}
                  />
                )}

                {state.searchMode === 'crypto-materials' && (
                  <CryptoMaterialsSearch
                    onSearch={handlers.handleCryptoMaterialsSearch}
                    loading={state.loading}
                  />
                )}
              </div>
            </div>
          )}

          {state.activeTab === 'components-analysis' && state.componentsDrillDownData && (
            <ComponentsDrillDown data={state.componentsDrillDownData} />
          )}

          {state.activeTab === 'crypto-materials-results' && state.cryptoMaterialsData && (
            <CryptoMaterialsAnalysis data={state.cryptoMaterialsData} />
          )}

          {state.activeTab === 'applications' && state.cbomData && (
            <div className="space-y-6">
              {/* Metrics Dashboard */}
              <MetricsDashboard 
                services={state.selectedApplication ? state.selectedApplication.services : state.cbomData.applications.flatMap(app => app.services)} 
                cbomData={state.cbomData} 
              />

              {/* Applications Grid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Applications ({state.cbomData.applications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ApplicationSelector
                    applications={state.cbomData.applications}
                    selectedApplication={state.selectedApplication}
                    onApplicationSelect={handlers.handleApplicationSelect}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {state.activeTab === 'services' && state.selectedApplication && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Services in {state.selectedApplication.name} ({state.selectedApplication.services.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VirtualizedServicesGrid
                    services={getCurrentServicesAndHosts().services}
                    selectedService={state.selectedService}
                    onServiceSelect={handlers.handleServiceSelectAndNavigate}
                    onServiceDetails={handlers.handleServiceDetails}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Hosts in {state.selectedApplication.name} ({state.selectedApplication.hosts?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HostsGrid
                    hosts={getCurrentServicesAndHosts().hosts}
                    selectedHost={state.selectedHost}
                    onHostSelect={handlers.handleHostSelect}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {state.activeTab === 'overview' && (state.selectedService || state.selectedHost) && filteredCBOMData && (
            <div className="space-y-4">
              {/* Graph and Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-500px)]">
                <div className="lg:col-span-3">
                  <Card className="h-full">
                    <CardContent className="h-full p-6">
                      <CBOMGraph 
                        data={filteredCBOMData}
                        onNodeSelect={handlers.handleNodeSelect}
                        selectedNode={state.selectedNode}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <CBOMSidebar 
                    selectedNode={state.selectedNode}
                    cbomData={filteredCBOMData}
                    onNodeSelect={handlers.handleNodeSelect}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {state.selectedService && (
        <ServiceDetailsModal
          service={state.selectedService}
          open={state.showServiceDetails}
          onClose={() => handlers.setShowServiceDetails(false)}
        />
      )}
    </div>
  );
};

export default CBOMViewer;
