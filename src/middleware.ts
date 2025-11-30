
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSiteConfig } from '@/config/site';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect from root to the default package
  if (pathname === '/') {
    const siteConfig = await getSiteConfig('com.tencent.ig');
    if (siteConfig) {
      const encodedSiteName = encodeURIComponent(siteConfig.name);
      return NextResponse.redirect(new URL(`/${encodedSiteName}/com.tencent.ig`, request.url));
    }
    // Fallback if the default config fails for some reason
    return NextResponse.redirect(new URL('/com.tencent.ig', request.url));
  }

  const pkgSegments = pathname.split('/').filter(Boolean);

  // If there's only one segment, it's a short URL that needs redirecting
  if (pkgSegments.length === 1) {
    const pkgName = pkgSegments[0];
    
    // Avoid redirect loops for files like robots.txt or sitemap.xml
    if (pkgName.endsWith('.txt') || pkgName.endsWith('.xml') || pkgName.includes('.')) {
        return NextResponse.next();
    }

    const siteConfig = await getSiteConfig(pkgName);
    if (siteConfig && siteConfig.name) {
      const encodedSiteName = encodeURIComponent(siteConfig.name);
      const newPath = `/${encodedSiteName}/${pkgName}`;
      // Use a permanent redirect for SEO benefits
      return NextResponse.redirect(new URL(newPath, request.url), 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run the middleware on all paths except for Next.js-specific assets
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
