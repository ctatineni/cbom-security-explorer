import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Code } from 'lucide-react';
import { AlgorithmsSearchFilters } from './AlgorithmsSearchFilters';
import { AlgorithmsProtocolsList } from './AlgorithmsProtocolsList';
import { ComponentAlgorithmsProtocols, filterAlgorithmsAndProtocols } from '@/utils/algorithmFilterUtils';

interface AlgorithmsProtocolsCardProps {
  component: {
    id: string;
    name: string;
    version?: string;
    isLibrary?: boolean;
    isLanguage?: boolean;
  };
  // This will come from the CBOM data API response
  algorithmProtocolData?: ComponentAlgorithmsProtocols;
}

export const AlgorithmsProtocolsCard: React.FC<AlgorithmsProtocolsCardProps> = ({ 
  component, 
  algorithmProtocolData 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [securityFilter, setSecurityFilter] = useState('all');

  const { algorithms, protocols } = useMemo(() => {
    // Use provided data or fallback to mock data for development
    if (algorithmProtocolData) {
      const filtered = filterAlgorithmsAndProtocols(algorithmProtocolData, 'supported');
      return {
        algorithms: filtered.algorithms,
        protocols: filtered.protocols
      };
    }

    // Fallback mock data when API data is not available
    const mockAlgorithms = [
      {
        name: "AES-256-GCM",
        type: "Symmetric Encryption",
        status: "enabled" as const,
        security: "secure" as const,
        description: "Advanced Encryption Standard with Galois/Counter Mode",
        source: component.name,
        usageContext: "Data encryption and authentication"
      },
      {
        name: "RSA-2048",
        type: "Asymmetric Encryption", 
        status: "supported" as const,
        security: "secure" as const,
        description: "RSA public-key cryptosystem with 2048-bit key size",
        source: component.name,
        usageContext: "Key exchange and digital signatures"
      }
    ];

    const mockProtocols = [
      {
        name: "TLS 1.3",
        type: "Transport Security",
        status: "enabled" as const, 
        security: "secure" as const,
        description: "Transport Layer Security protocol version 1.3",
        source: component.name,
        usageContext: "Secure network communication"
      }
    ];

    return { algorithms: mockAlgorithms, protocols: mockProtocols };
  }, [component.name, component.isLanguage, algorithmProtocolData]);

  const filterItems = (items: any[]) => {
    return items.filter(item => {
      // Always filter to show only enabled and supported items
      const isEnabledOrSupported = item.status === 'enabled' || item.status === 'supported';
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSecurity = securityFilter === 'all' || item.security === securityFilter;
      
      return isEnabledOrSupported && matchesSearch && matchesSecurity;
    });
  };

  const filteredAlgorithms = filterItems(algorithms);
  const filteredProtocols = filterItems(protocols);

  const componentTypeText = component.isLanguage ? 'programming language' : 'library';
  const icon = component.isLanguage ? <Code className="h-5 w-5" /> : <Key className="h-5 w-5" />;

  // Display algorithm/protocol strings if available
  const algorithmStrings = algorithmProtocolData?.algorithmProtocolStrings;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          Supported Algorithms & Protocols
        </CardTitle>
        <div className="text-sm text-gray-600">
          Enabled and supported cryptographic algorithms and security protocols for {componentTypeText} {component.name}
        </div>
        
        {algorithmStrings && (
          <div className="text-xs text-gray-500 space-y-1 border-t pt-3">
            <div><strong>Enabled Algorithms:</strong> {algorithmStrings.enabledAlgorithms || 'None'}</div>
            <div><strong>Supported Algorithms:</strong> {algorithmStrings.supportedAlgorithms || 'None'}</div>
            <div><strong>Enabled Protocols:</strong> {algorithmStrings.enabledProtocols || 'None'}</div>
            <div><strong>Supported Protocols:</strong> {algorithmStrings.supportedProtocols || 'None'}</div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <AlgorithmsSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter="supported" // Fixed to show enabled/supported only
          onStatusFilterChange={() => {}} // No-op since we don't allow changing this
          securityFilter={securityFilter}
          onSecurityFilterChange={setSecurityFilter}
          hideStatusFilter={true} // Hide the status filter
        />

        <Tabs defaultValue="algorithms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="algorithms">
              Algorithms ({filteredAlgorithms.length})
            </TabsTrigger>
            <TabsTrigger value="protocols">
              Protocols ({filteredProtocols.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms" className="mt-4">
            <AlgorithmsProtocolsList 
              items={filteredAlgorithms} 
              title="Cryptographic Algorithms" 
            />
          </TabsContent>

          <TabsContent value="protocols" className="mt-4">
            <AlgorithmsProtocolsList 
              items={filteredProtocols} 
              title="Security Protocols" 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
