
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentDetailHeader } from './ComponentDetailHeader';
import { ComponentOverviewCard } from './ComponentOverviewCard';
import { ApplicationDetailCard } from './ApplicationDetailCard';
import { AlgorithmsProtocolsCard } from './AlgorithmsProtocolsCard';

interface ComponentDetailModalProps {
  component: {
    id: string;
    name: string;
    version?: string;
    language?: string;
    applicationCount: number;
    serviceCount: number;
    applications: string[];
    services: Array<{
      serviceName: string;
      applicationName: string;
      appId: string;
      usage: Array<{
        name: string;
        usedIn?: string[];
        purpose?: string;
        framework?: string;
      }>;
    }>;
    hasVulnerabilities?: boolean;
    riskLevel?: string;
    isLibrary?: boolean;
    isLanguage?: boolean;
  } | null;
  open: boolean;
  onClose: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  component,
  open,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!component) return null;

  const showAlgorithmsTab = component.isLibrary || component.isLanguage;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <ComponentDetailHeader component={component} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${showAlgorithmsTab ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            {showAlgorithmsTab && (
              <TabsTrigger value="algorithms">Algorithms & Protocols</TabsTrigger>
            )}
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <ComponentOverviewCard component={component} />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6 mt-6">
            <ApplicationDetailCard component={component} />
          </TabsContent>

          {showAlgorithmsTab && (
            <TabsContent value="algorithms" className="space-y-6 mt-6">
              <AlgorithmsProtocolsCard component={component} />
            </TabsContent>
          )}

          <TabsContent value="security" className="space-y-6 mt-6">
            <div className="text-sm text-gray-500 text-center py-8">
              Security analysis coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
