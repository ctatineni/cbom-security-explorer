
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Code } from 'lucide-react';

interface ComponentDetailHeaderProps {
  component: {
    name: string;
    isLibrary?: boolean;
    isLanguage?: boolean;
  };
}

export const ComponentDetailHeader: React.FC<ComponentDetailHeaderProps> = ({ component }) => {
  const isLibrary = component.isLibrary;
  const isLanguage = component.isLanguage;
  
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        {isLibrary ? (
          <Package className="h-5 w-5 text-blue-600" />
        ) : (
          <Code className="h-5 w-5 text-purple-600" />
        )}
        {component.name}
        <Badge variant="outline" className="text-xs">
          {isLibrary ? 'Library' : 'Language'}
        </Badge>
      </DialogTitle>
    </DialogHeader>
  );
};
