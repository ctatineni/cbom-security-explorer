
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';

interface CBOMExpandableModalProps {
  title: string;
  children: React.ReactNode;
  triggerText?: string;
}

export const CBOMExpandableModal: React.FC<CBOMExpandableModalProps> = ({
  title,
  children,
  triggerText = "Expand"
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs"
          title={`Expand ${title}`}
        >
          <Expand className="h-3 w-3 mr-1" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
