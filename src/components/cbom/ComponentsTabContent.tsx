
import React from 'react';
import { ComponentsFilters } from './ComponentsFilters';
import { ComponentsTreeView } from './ComponentsTreeView';
import { getRiskBadge } from './ComponentsRiskBadge';
import { useComponentsFiltering } from '@/hooks/useComponentsFiltering';

interface ComponentsTabContentProps {
  components: Array<{
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
  }>;
}

export const ComponentsTabContent: React.FC<ComponentsTabContentProps> = ({ components }) => {
  const {
    searchFilter,
    setSearchFilter,
    minApplicationsFilter,
    setMinApplicationsFilter,
    componentTypeFilter,
    setComponentTypeFilter,
    filteredComponents,
    clearFilters
  } = useComponentsFiltering(components);

  return (
    <div className="space-y-4">
      <ComponentsFilters
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        componentTypeFilter={componentTypeFilter}
        setComponentTypeFilter={setComponentTypeFilter}
        minApplicationsFilter={minApplicationsFilter}
        setMinApplicationsFilter={setMinApplicationsFilter}
        onClear={clearFilters}
      />

      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <span>
          Showing {filteredComponents.length} components
        </span>
      </div>

      <div className="space-y-4">
        {filteredComponents.map((component) => (
          <ComponentsTreeView
            key={component.id}
            component={component}
            getRiskBadge={getRiskBadge}
          />
        ))}
      </div>
    </div>
  );
};
