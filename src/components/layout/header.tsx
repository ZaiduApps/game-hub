
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PubgLogo } from '@/components/icons/PubgLogo';
import { Button } from '@/components/ui/button';
import { Gamepad2, Menu, MessageSquare, Newspaper, Rss, Video } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ApkDownloadDialog } from '../ApkDownloadDialog';
import { SiteConfig } from '@/config/site';
import { usePathname } from 'next/navigation';

const navIcons: { [key: string]: React.ElementType } = {
  home: Gamepad2,
  community: MessageSquare,
  articles: Newspaper,
  updates: Rss,
  video: Video,
};

interface HeaderProps {
  siteConfig: SiteConfig;
  pkg?: string;
}

export function Header({ siteConfig, pkg }: HeaderProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isApkDialogOpen, setIsApkDialogOpen] = useState(false);
  const pathname = usePathname();
  
  const navLinks = [
    { href: '#home', label: '首页', sectionId: 'home' },
    ...siteConfig.sections
      .filter(section => section.enabled !== false)
      .map(section => ({
        href: `#${section.id}`,
        label: section.navLabel,
        sectionId: section.id,
    })),
    ...(siteConfig.video.enabled ? [{ href: `#${siteConfig.video.id}`, label: siteConfig.video.navLabel, sectionId: siteConfig.video.id }] : []),
  ];

  useEffect(() => {
    if (pathname.includes('/articles/')) {
        setActiveSection('');
        return;
    }

    const handleScroll = () => {
        const sectionsToObserve = navLinks
            .map(link => document.getElementById(link.sectionId))
            .filter(Boolean);

        let currentSection = 'home';

        for (const section of sectionsToObserve) {
          if (section) {
              const sectionTop = section.offsetTop;
              if (window.scrollY >= sectionTop - 100) { // 100px offset
                  currentSection = section.id;
              }
          }
        }
        
        setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial active section

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [navLinks, pathname]);
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    
    const rootPath = pkg ? `/${pkg}` : '/';

    // If we're on a different page, navigate to the homepage with the hash
    if (!pathname.startsWith(rootPath) || pathname.includes('/articles')) {
        window.location.href = `${rootPath}${href}`;
        return;
    }

    // If we're already on the homepage, scroll to the section
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        // Adjust scroll position to account for sticky header
        const headerOffset = 80; // height of header + some margin
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // Manually set active section for instant feedback on click
        setActiveSection(targetId);
    }
    setIsSheetOpen(false); // Close sheet on link click
  };
  
  const getRootPath = () => {
    return pkg ? `/${pkg}` : '/';
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
              <div className="md:hidden">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">打开菜单</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle className="sr-only">主菜单</SheetTitle>
                        <Link href={getRootPath()} className="flex items-center space-x-2">
                          <PubgLogo siteConfig={siteConfig} />
                        </Link>
                      </SheetHeader>
                      <nav className="flex flex-col space-y-4 mt-6">
                        {navLinks.map(({ href, label, sectionId }) => {
                          const Icon = navIcons[sectionId];
                          return (
                            <a
                              key={label}
                              href={href}
                              onClick={(e) => handleLinkClick(e, href)}
                              className={cn(
                                "flex items-center space-x-2 text-lg font-medium hover:text-foreground",
                                activeSection === sectionId ? 'text-foreground' : 'text-foreground/60'
                              )}
                            >
                              {Icon && <Icon className="h-5 w-5" />}
                              <span>{label}</span>
                            </a>
                          )
                        })}
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              <Link href={getRootPath()} className="flex items-center space-x-2">
                  <PubgLogo siteConfig={siteConfig} />
              </Link>
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                  {navLinks.map(({ href, label, sectionId }) => (
                  <a
                      key={label}
                      href={href}
                      onClick={(e) => handleLinkClick(e, href)}
                      className={cn(
                        "relative transition-colors hover:text-foreground/80 nav-link",
                        activeSection === sectionId
                          ? 'text-foreground nav-link-active'
                          : 'text-foreground/60'
                      )}
                  >
                      {label}
                  </a>
                  ))}
              </nav>
          </div>

          <div className="hidden md:flex items-center">
            <Button onClick={() => setIsApkDialogOpen(true)} className="animated-border-btn">
              游戏下载
            </Button>
          </div>
        </div>
      </header>
      {siteConfig.downloads.apk && <ApkDownloadDialog open={isApkDialogOpen} onOpenChange={setIsApkDialogOpen} siteConfig={siteConfig} />}
    </>
  );
}
