
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { CBOMGraph } from '@/components/cbom/CBOMGraph';
import { CBOMSidebar } from '@/components/cbom/CBOMSidebar';
import { CBOMHeader } from '@/components/cbom/CBOMHeader';
import { mockCBOMData } from '@/data/mockCBOMData';

const CBOMViewer = () => {
  const [applicationId, setApplicationId] = useState('');
  const [cbomData, setCbomData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!applicationId.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCbomData(mockCBOMData);
      setLoading(false);
    }, 1000);
  };

  const handleNodeSelect = (nodeData) => {
    setSelectedNode(nodeData);
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
            {/* Graph Visualization */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cryptographic Dependencies</span>
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
                    data={cbomData}
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
                cbomData={cbomData}
                onNodeSelect={handleNodeSelect}
              />
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
