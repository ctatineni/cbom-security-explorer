import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Building, Layers, FileKey } from 'lucide-react';
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
import { useCBOMViewer } from '@/hooks/useCBOMViewer';
import { getFilteredCBOMData } from '@/utils/cbomDataUtils';

const CBOMViewer = () => {
  const { state, handlers } = useCBOMViewer();

  const getCurrentServices = () => {
    if (!state.selectedApplication) return [];
    return state.selectedApplication.services;
  };

  const hasDataAvailable = state.cbomData || state.cryptoMaterialsData;

  const getBackButtonProps = () => {
    switch (state.activeTab) {
      case 'applications':
      case 'crypto-materials-results':
      case 'components-analysis':
        return { onBack: handlers.handleBackToSearch, showBackButton: true };
      case 'services':
        return { onBack: handlers.handleBackToApplications, showBackButton: true };
      case 'overview':
        return { onBack: handlers.handleBackToServices, showBackButton: true };
      default:
        return { showBackButton: false };
    }
  };

  const getCurrentWorkflowStep = () => {
    if (state.activeTab === 'search-selection') return 'search';
    if (state.activeTab === 'applications') return 'applications';
    if (state.activeTab === 'components-analysis') return 'components';
    if (state.activeTab === 'services') return 'services';
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
      case 'components':
        if (state.componentsDrillDownData) handlers.setActiveTab('components-analysis');
        break;
      case 'services':
        if (state.selectedApplication) handlers.setActiveTab('services');
        break;
      case 'overview':
        if (state.selectedService) handlers.setActiveTab('overview');
        break;
    }
  };

  const filteredCBOMData = getFilteredCBOMData(state.selectedService, state.cbomData, state.selectedApplication);

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
          <WorkflowGuide
            currentStep={getCurrentWorkflowStep()}
            onStepClick={handleWorkflowStepClick}
          />
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
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Search Mode Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`cursor-pointer transition-all hover:shadow-lg border-2 ${state.searchMode === 'cbom' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'}`} 
                      onClick={() => handlers.setSearchMode('cbom')}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="h-6 w-6 text-blue-600" />
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

                <Card className={`cursor-pointer transition-all hover:shadow-lg border-2 ${state.searchMode === 'crypto-materials' ? 'border-green-500 bg-green-50/50' : 'border-gray-200'}`} 
                      onClick={() => handlers.setSearchMode('crypto-materials')}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileKey className="h-6 w-6 text-green-600" />
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
              <div className="max-w-4xl mx-auto">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Services in {state.selectedApplication.name} ({state.selectedApplication.services.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VirtualizedServicesGrid
                  services={getCurrentServices()}
                  selectedService={state.selectedService}
                  onServiceSelect={handlers.handleServiceSelectAndNavigate}
                  onServiceDetails={handlers.handleServiceDetails}
                />
              </CardContent>
            </Card>
          )}

          {state.activeTab === 'overview' && state.selectedService && filteredCBOMData && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-400px)]">
              <div className="lg:col-span-3">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Cryptographic Dependencies - {state.selectedService.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-80px)]">
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
