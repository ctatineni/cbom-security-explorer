
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Search, 
  Building, 
  Layers, 
  Package, 
  Key, 
  BarChart3,
  RotateCcw,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  hasApplicationsData: boolean;
  hasComponentsData: boolean;
  hasCryptoData: boolean;
  selectedApplication: any;
  selectedService: any;
  cbomData: any;
  cryptoMaterialsData: any;
  componentsDrillDownData: any;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onTabChange,
  onBack,
  showBackButton,
  hasApplicationsData,
  hasComponentsData,
  hasCryptoData,
  selectedApplication,
  selectedService,
  cbomData,
  cryptoMaterialsData,
  componentsDrillDownData
}) => {
  const navigate = useNavigate();

  const getNavItems = () => {
    const items = [];

    // Always show search
    items.push({
      id: 'search-selection',
      label: 'Search',
      icon: Search,
      enabled: true,
      badge: null
    });

    // Applications - enabled if we have CBOM data
    if (hasApplicationsData) {
      items.push({
        id: 'applications',
        label: 'Applications',
        icon: Building,
        enabled: true,
        badge: cbomData?.applications.length
      });
    }

    // Services - enabled if application is selected
    if (selectedApplication) {
      items.push({
        id: 'services',
        label: 'Services',
        icon: Layers,
        enabled: true,
        badge: selectedApplication.services.length
      });
    }

    // Overview - enabled if service is selected
    if (selectedService) {
      items.push({
        id: 'overview',
        label: 'Overview',
        icon: BarChart3,
        enabled: true,
        badge: null
      });
    }

    // Components - enabled if we have components data
    if (hasComponentsData) {
      items.push({
        id: 'components-analysis',
        label: 'Components',
        icon: Package,
        enabled: true,
        badge: componentsDrillDownData?.components.length
      });
    }

    // Crypto Materials - enabled if we have crypto data
    if (hasCryptoData) {
      items.push({
        id: 'crypto-materials-results',
        label: 'Materials',
        icon: Key,
        enabled: true,
        badge: cryptoMaterialsData ? cryptoMaterialsData.certificates.length + cryptoMaterialsData.keys.length : null
      });
    }

    return items;
  };

  const navItems = getNavItems();

  const handleReset = () => {
    // Reset to search page
    onTabChange('search-selection');
    // The parent component will handle clearing the data
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        {/* Top row - Title and controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {showBackButton && onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cryptographic Asset Intelligence</h1>
              <p className="text-sm text-gray-600">Comprehensive analysis of cryptographic components and materials</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Home button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            
            {/* Reset button - only show if we have data */}
            {(hasApplicationsData || hasComponentsData || hasCryptoData) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                New Search
              </Button>
            )}
          </div>
        </div>

        {/* Action buttons for current context */}
        <div className="flex items-center gap-3">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            if (!item.enabled) return null;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <Badge variant={isActive ? "secondary" : "outline"} className="ml-1 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
