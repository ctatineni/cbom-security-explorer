
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Layers, Package, Key, CheckCircle } from 'lucide-react';

interface TabNavigationHelperProps {
  activeTab: string;
  hasApplicationsData: boolean;
  hasComponentsData: boolean;
  hasCryptoData: boolean;
  selectedApplication: any;
  selectedService: any;
  onTabChange: (tab: string) => void;
}

export const TabNavigationHelper: React.FC<TabNavigationHelperProps> = ({
  activeTab,
  hasApplicationsData,
  hasComponentsData,
  hasCryptoData,
  selectedApplication,
  selectedService,
  onTabChange
}) => {
  const getTabStatus = (tabName: string) => {
    switch (tabName) {
      case 'applications':
        return hasApplicationsData ? 'available' : 'disabled';
      case 'services':
        return selectedApplication ? 'available' : 'requires-app';
      case 'overview':
        return selectedService ? 'available' : 'requires-service';
      case 'components-analysis':
        return hasComponentsData ? 'available' : 'disabled';
      case 'crypto-materials-results':
        return hasCryptoData ? 'available' : 'disabled';
      default:
        return 'available';
    }
  };

  const getTabInfo = (tabName: string) => {
    const status = getTabStatus(tabName);
    switch (tabName) {
      case 'applications':
        return {
          icon: Building,
          label: 'Applications',
          description: hasApplicationsData ? 'Browse your applications' : 'Run a search first',
          available: status === 'available'
        };
      case 'services':
        return {
          icon: Layers,
          label: 'Services',
          description: status === 'available' ? `Services in ${selectedApplication?.name}` : 'Select an application first',
          available: status === 'available'
        };
      case 'overview':
        return {
          icon: CheckCircle,
          label: 'Overview',
          description: status === 'available' ? `Details for ${selectedService?.name}` : 'Select a service first',
          available: status === 'available'
        };
      case 'components-analysis':
        return {
          icon: Package,
          label: 'Components',
          description: hasComponentsData ? 'Analyze libraries & languages' : 'Run a search first',
          available: status === 'available'
        };
      case 'crypto-materials-results':
        return {
          icon: Key,
          label: 'Materials',
          description: hasCryptoData ? 'Crypto materials analysis' : 'Run crypto materials search first',
          available: status === 'available'
        };
      default:
        return { icon: CheckCircle, label: tabName, description: '', available: true };
    }
  };

  const tabs = ['applications', 'services', 'overview', 'components-analysis', 'crypto-materials-results'];
  const availableTabs = tabs.filter(tab => getTabStatus(tab) === 'available');

  if (activeTab === 'search-selection' || availableTabs.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="text-sm font-medium text-gray-700 mb-2">Available Sections:</div>
      <div className="flex flex-wrap gap-2">
        {availableTabs.map(tabName => {
          const info = getTabInfo(tabName);
          const IconComponent = info.icon;
          const isActive = activeTab === tabName;
          
          return (
            <Button
              key={tabName}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onTabChange(tabName)}
              className="flex items-center gap-2"
            >
              <IconComponent className="h-4 w-4" />
              {info.label}
              {isActive && <Badge variant="secondary" className="ml-1 text-xs">Current</Badge>}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
