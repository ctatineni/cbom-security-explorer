
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Building, 
  Layers, 
  Package, 
  Key, 
  BarChart3,
  ChevronRight,
  Home
} from 'lucide-react';

interface LeftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasApplicationsData: boolean;
  hasComponentsData: boolean;
  hasCryptoData: boolean;
  selectedApplication: any;
  selectedService: any;
  cbomData: any;
  cryptoMaterialsData: any;
  componentsDrillDownData: any;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  onTabChange,
  hasApplicationsData,
  hasComponentsData,
  hasCryptoData,
  selectedApplication,
  selectedService,
  cbomData,
  cryptoMaterialsData,
  componentsDrillDownData
}) => {
  const getNavItems = () => {
    const items = [];

    // Always show search
    items.push({
      id: 'search-selection',
      label: 'Search',
      icon: Search,
      enabled: true,
      badge: null,
      description: 'Start new analysis'
    });

    // Applications - enabled if we have CBOM data
    if (hasApplicationsData) {
      items.push({
        id: 'applications',
        label: 'Applications',
        icon: Building,
        enabled: true,
        badge: cbomData?.applications.length,
        description: 'View all applications'
      });
    }

    // Services - enabled if application is selected
    if (selectedApplication) {
      items.push({
        id: 'services',
        label: 'Services',
        icon: Layers,
        enabled: true,
        badge: selectedApplication.services.length,
        description: `Services in ${selectedApplication.name}`
      });
    }

    // Overview - enabled if service is selected
    if (selectedService) {
      items.push({
        id: 'overview',
        label: 'Overview',
        icon: BarChart3,
        enabled: true,
        badge: null,
        description: `Details for ${selectedService.name}`
      });
    }

    // Components - enabled if we have components data
    if (hasComponentsData) {
      items.push({
        id: 'components-analysis',
        label: 'Components',
        icon: Package,
        enabled: true,
        badge: componentsDrillDownData?.components.length,
        description: 'Library and language analysis'
      });
    }

    // Crypto Materials - enabled if we have crypto data
    if (hasCryptoData) {
      items.push({
        id: 'crypto-materials-results',
        label: 'Materials',
        icon: Key,
        enabled: true,
        badge: cryptoMaterialsData ? cryptoMaterialsData.certificates.length + cryptoMaterialsData.keys.length : null,
        description: 'Certificates and keys'
      });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Home className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">CBOM Explorer</h2>
        </div>
        <p className="text-sm text-gray-600">Cryptographic Asset Intelligence</p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          const isEnabled = item.enabled;

          return (
            <div key={item.id}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${
                  !isEnabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => isEnabled && onTabChange(item.id)}
                disabled={!isEnabled}
              >
                <div className="flex items-center gap-3 w-full">
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "outline"} className="ml-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </div>
              </Button>
              {index < navItems.length - 1 && <Separator className="my-2" />}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Navigation: {navItems.length} items</div>
          <div>Active: {navItems.find(item => item.id === activeTab)?.label || 'None'}</div>
        </div>
      </div>
    </div>
  );
};
