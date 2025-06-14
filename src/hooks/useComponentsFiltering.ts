
import { useState, useMemo } from 'react';

interface Component {
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
}

export const useComponentsFiltering = (components: Component[]) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [minApplicationsFilter, setMinApplicationsFilter] = useState('');
  const [componentTypeFilter, setComponentTypeFilter] = useState<'all' | 'libraries' | 'languages'>('all');

  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = !searchFilter || 
        component.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        component.applications.some(app => app.toLowerCase().includes(searchFilter.toLowerCase()));
      
      const matchesMinApps = !minApplicationsFilter || 
        component.applicationCount >= parseInt(minApplicationsFilter);
      
      const matchesComponentType = componentTypeFilter === 'all' || 
        (componentTypeFilter === 'libraries' && component.isLibrary) ||
        (componentTypeFilter === 'languages' && component.isLanguage);
      
      return matchesSearch && matchesMinApps && matchesComponentType;
    });
  }, [components, searchFilter, minApplicationsFilter, componentTypeFilter]);

  const clearFilters = () => {
    setSearchFilter('');
    setMinApplicationsFilter('');
    setComponentTypeFilter('all');
  };

  return {
    searchFilter,
    setSearchFilter,
    minApplicationsFilter,
    setMinApplicationsFilter,
    componentTypeFilter,
    setComponentTypeFilter,
    filteredComponents,
    clearFilters
  };
};
