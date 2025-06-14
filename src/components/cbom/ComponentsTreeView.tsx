
import React from 'react';
import { ComponentsTreeViewItem } from './ComponentsTreeViewItem';

interface ComponentsTreeViewProps {
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
  };
  getRiskBadge: (component: any) => React.ReactNode;
}

export const ComponentsTreeView: React.FC<ComponentsTreeViewProps> = ({ component, getRiskBadge }) => {
  return (
    <ComponentsTreeViewItem 
      component={component} 
      getRiskBadge={getRiskBadge} 
    />
  );
};
