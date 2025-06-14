
import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ComponentDetailHeader } from './ComponentDetailHeader';
import { ComponentOverviewCard } from './ComponentOverviewCard';
import { ComponentApplicationsCard } from './ComponentApplicationsCard';
import { ComponentServicesCard } from './ComponentServicesCard';

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
  if (!component) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <ComponentDetailHeader component={component} />

        <div className="space-y-6">
          <ComponentOverviewCard component={component} />
          <ComponentApplicationsCard component={component} />
          <ComponentServicesCard component={component} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
