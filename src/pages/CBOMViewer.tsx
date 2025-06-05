
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Shield, AlertTriangle, CheckCircle, Layers } from 'lucide-react';
import { CBOMGraph } from '@/components/cbom/CBOMGraph';
import { CBOMSidebar } from '@/components/cbom/CBOMSidebar';
import { CBOMHeader } from '@/components/cbom/CBOMHeader';
import { mockCBOMData } from '@/data/mockCBOMData';

const CBOMViewer = () => {
  const [applicationId, setApplicationId] = useState('');
  const [cbomData, setCbomData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!applicationId.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCbomData(mockCBOMData);
      setSelectedService(null); // Reset service selection
      setLoading(false);
    }, 1000);
  };

  const handleNodeSelect = (nodeData) => {
    setSelectedNode(nodeData);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedNode(null); // Reset node selection when switching services
  };

  const getFilteredCBOMData = () => {
    if (!selectedService || !cbomData) return cbomData;
    
    // Filter data based on selected service
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
        {/* Search Interface */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Cryptographic Bill of Materials Viewer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter Application ID (e.g., app-crypto-001)"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={loading || !applicationId.trim()}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {loading ? 'Analyzing...' : 'Generate CBOM'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {cbomData && (
          <div className="space-y-6">
            {/* Services Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Application Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cbomData.services.map((service) => (
                    <Card 
                      key={service.id}
                      className={`cursor-pointer transition-colors ${
                        selectedService?.id === service.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600">
                            Version: {service.version}
                          </div>
                          <div className="text-xs text-gray-600">
                            {service.description}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              service.riskLevel === 'high' ? 'bg-red-500' :
                              service.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <span className="text-xs capitalize">{service.riskLevel} Risk</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant={!selectedService ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedService(null)}
                  >
                    All Services
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Graph Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-400px)]">
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

              {/* Details Sidebar */}
              <div className="lg:col-span-1">
                <CBOMSidebar 
                  selectedNode={selectedNode}
                  cbomData={getFilteredCBOMData()}
                  onNodeSelect={handleNodeSelect}
                />
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!cbomData && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No CBOM Data Available
              </h3>
              <p className="text-gray-500">
                Enter an application ID to generate a cryptographic bill of materials
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CBOMViewer;
