
import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CBOMHeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export const CBOMHeader: React.FC<CBOMHeaderProps> = ({ onBack, showBackButton = false }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cryptographic Asset Intelligence</h1>
              <p className="text-sm text-gray-600">Comprehensive analysis of cryptographic components and materials across your infrastructure</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
