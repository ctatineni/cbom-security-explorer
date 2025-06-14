
import { useState } from 'react';
import { CBOMViewerState, DataSource } from '@/types/cbom';
import { mockCBOMData, Application, Service } from '@/data/mockCBOMData';
import { mockCryptoMaterialsData } from '@/data/mockCryptoMaterialsData';
import { useToast } from '@/hooks/use-toast';
import { generateComponentsDrillDown } from '@/utils/cbomDataUtils';

export const useCBOMViewer = () => {
  const [state, setState] = useState<CBOMViewerState>({
    searchMode: 'cbom',
    cbomData: null,
    cryptoMaterialsData: null,
    selectedApplication: null,
    selectedNode: null,
    selectedService: null,
    loading: false,
    showServiceDetails: false,
    activeTab: 'search-selection',
    componentsDrillDownData: null,
    lastSearchQuery: '',
    dataSources: [
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
    ],
    selectedDataSource: {} as DataSource
  });

  // Initialize selected data source
  if (!state.selectedDataSource.type) {
    setState(prev => ({ ...prev, selectedDataSource: prev.dataSources[0] }));
  }

  const { toast } = useToast();

  const handleNaturalLanguageSearch = async (query: string) => {
    setState(prev => ({ ...prev, loading: true, lastSearchQuery: query }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, cbomData: mockCBOMData, loading: false }));
      
      toast({
        title: "Analysis Complete",
        description: `Found ${mockCBOMData.applications.length} applications with ${mockCBOMData.applications.reduce((total, app) => total + app.services.length, 0)} total services.`,
      });

      setTimeout(() => {
        const librariesData = generateComponentsDrillDown(query, 'libraries', mockCBOMData);
        const languagesData = generateComponentsDrillDown(query, 'languages', mockCBOMData);
        
        let filteredLibraries = librariesData?.components || [];
        let filteredLanguages = languagesData?.components || [];
        
        if (query.toLowerCase().includes('java')) {
          filteredLanguages = languagesData?.components.filter(comp => 
            comp.name.toLowerCase().includes('java')) || [];
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
        
        setState(prev => ({ 
          ...prev, 
          componentsDrillDownData: combinedData,
          activeTab: 'applications'
        }));
        
        toast({
          title: "Components Analysis Complete",
          description: `Found ${filteredLibraries.length} relevant libraries and ${filteredLanguages.length} languages matching your query.`,
        });
      }, 500);
    }, 2000);
  };

  const handleCryptoMaterialsSearch = async (query: string) => {
    setState(prev => ({ ...prev, loading: true, lastSearchQuery: query }));
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        cryptoMaterialsData: mockCryptoMaterialsData,
        activeTab: 'crypto-materials-results',
        loading: false
      }));
      
      toast({
        title: "Crypto Materials Analysis Complete",
        description: `Found ${mockCryptoMaterialsData.certificates.length} certificates and ${mockCryptoMaterialsData.keys.length} keys matching your criteria.`,
      });
    }, 2000);
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
    setState(prev => ({
      ...prev,
      selectedApplication: application,
      selectedService: null,
      selectedNode: null,
      activeTab: 'services'
    }));
  };

  const handleNodeSelect = (nodeData: any) => {
    setState(prev => ({ ...prev, selectedNode: nodeData }));
  };

  const handleServiceSelectAndNavigate = (service: Service) => {
    setState(prev => ({
      ...prev,
      selectedService: service,
      selectedNode: null,
      activeTab: 'overview'
    }));
  };

  const handleServiceDetails = (service: Service) => {
    setState(prev => ({
      ...prev,
      selectedService: service,
      showServiceDetails: true
    }));
  };

  const handleBackToSearch = () => {
    setState(prev => ({
      ...prev,
      activeTab: 'search-selection',
      selectedApplication: null,
      selectedService: null,
      selectedNode: null
    }));
  };

  const handleBackToApplications = () => {
    setState(prev => ({
      ...prev,
      activeTab: 'applications',
      selectedService: null,
      selectedNode: null
    }));
  };

  const handleBackToServices = () => {
    setState(prev => ({
      ...prev,
      activeTab: 'services',
      selectedService: null,
      selectedNode: null
    }));
  };

  const setSearchMode = (mode: 'cbom' | 'crypto-materials') => {
    setState(prev => ({ ...prev, searchMode: mode }));
  };

  const setActiveTab = (tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const setShowServiceDetails = (show: boolean) => {
    setState(prev => ({ ...prev, showServiceDetails: show }));
  };

  return {
    state,
    handlers: {
      handleNaturalLanguageSearch,
      handleCryptoMaterialsSearch,
      handleGitHubScan,
      handleApplicationSelect,
      handleNodeSelect,
      handleServiceSelectAndNavigate,
      handleServiceDetails,
      handleBackToSearch,
      handleBackToApplications,
      handleBackToServices,
      setSearchMode,
      setActiveTab,
      setShowServiceDetails
    }
  };
};
