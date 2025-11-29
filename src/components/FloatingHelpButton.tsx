
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircleQuestion } from 'lucide-react';
import { FeedbackDialog } from './FeedbackDialog';
import { SiteConfig } from '@/config/site';

interface FloatingHelpButtonProps {
  siteConfig: SiteConfig;
}

export function FloatingHelpButton({ siteConfig }: FloatingHelpButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50 flex items-center justify-center"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex flex-col items-center">
            <MessageCircleQuestion className="h-6 w-6" />
            <span className="text-xs -mt-1">需要帮助</span>
        </div>
      </Button>
      <FeedbackDialog siteConfig={siteConfig} open={isDialogOpen} onOpenChange={setIsDialogOpen} isTriggeredByFab={true} />
    </>
  );
}
