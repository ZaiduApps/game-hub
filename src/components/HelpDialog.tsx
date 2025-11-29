
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { LifeBuoy, Mail, Download } from 'lucide-react';
import Link from 'next/link';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const helpLinks = [
  {
    text: '无法登录游玩？',
    href: 'https://m.tb.cn/h.SywCvXI?tk=jXg2fL5IjQD',
    icon: Download,
  },
  {
    text: '账号购买/小铺子',
    href: 'https://apks.pgid.club/', 
    icon: LifeBuoy,
  },
  {
    text: '发送邮件联系客服',
    href: 'mailto:apkscc-feedback@foxmail.com',
    icon: Mail,
  }
];

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(href, '_blank');
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>帮助中心</DialogTitle>
          <DialogDescription>
            需要什么帮助？请选择以下选项。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {helpLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Button asChild size="lg" key={index} variant="outline">
                <a href={link.href} onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}>
                  <Icon className="mr-2" />
                  {link.text}
                </a>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
