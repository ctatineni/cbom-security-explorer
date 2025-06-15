
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Code } from 'lucide-react';
import { generateMockAlgorithmsProtocols } from '@/utils/algorithmsMockData';
import { AlgorithmsSearchFilters } from './AlgorithmsSearchFilters';
import { AlgorithmsProtocolsList } from './AlgorithmsProtocolsList';

interface AlgorithmsProtocolsCardProps {
  component: {
    id: string;
    name: string;
    version?: string;
    isLibrary?: boolean;
    isLanguage?: boolean;
  };
}

export const AlgorithmsProtocolsCard: React.FC<AlgorithmsProtocolsCardProps> = ({ component }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [securityFilter, setSecurityFilter] = useState('all');

  const { algorithms, protocols } = useMemo(() => 
    generateMockAlgorithmsProtocols(component.name, component.isLanguage), 
    [component.name, component.isLanguage]
  );

  const filterItems = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSecurity = securityFilter === 'all' || item.security === securityFilter;
      
      return matchesSearch && matchesStatus && matchesSecurity;
    });
  };

  const filteredAlgorithms = filterItems(algorithms);
  const filteredProtocols = filterItems(protocols);

  const componentTypeText = component.isLanguage ? 'programming language' : 'library';
  const icon = component.isLanguage ? <Code className="h-5 w-5" /> : <Key className="h-5 w-5" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          Supported Algorithms & Protocols
        </CardTitle>
        <div className="text-sm text-gray-600">
          Cryptographic algorithms and security protocols supported by the {componentTypeText} {component.name}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AlgorithmsSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          securityFilter={securityFilter}
          onSecurityFilterChange={setSecurityFilter}
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
