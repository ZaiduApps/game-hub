
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { DownloadCloud, Globe } from 'lucide-react';
import Link from 'next/link';
import { SiteConfig } from '@/config/site';

interface ApkDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteConfig: SiteConfig;
}

export function ApkDownloadDialog({ open, onOpenChange, siteConfig }: ApkDownloadDialogProps) {
  if (!siteConfig.downloads.apk) {
    return null;
  }
  const { apk } = siteConfig.downloads;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{apk.dialog.title}</DialogTitle>
          <DialogDescription>
            {apk.dialog.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {apk.dialog.panUrl && (
            <Button asChild size="lg">
              <Link href={apk.dialog.panUrl} target="_blank">
                <DownloadCloud className="mr-2" />
                网盘下载
              </Link>
            </Button>
          )}
          {apk.dialog.officialUrl && (
            <Button asChild size="lg" variant="secondary">
              <Link href={apk.dialog.officialUrl} target="_blank">
                <Globe className="mr-2" />
                官网下载
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
