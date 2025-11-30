
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSiteConfig } from '@/config/site';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Let Next.js handle its own assets
  if (pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }
  
  // Handle root redirect to default package
  if (pathname === '/') {
    const siteConfig = await getSiteConfig('com.tencent.ig');
    if (siteConfig) {
      const encodedSiteName = encodeURIComponent(siteConfig.name);
      return NextResponse.redirect(new URL(`/${encodedSiteName}/com.tencent.ig`, request.url), 301);
    }
    // Fallback if the default config fails for some reason
    return NextResponse.redirect(new URL('/com.tencent.ig', request.url), 301);
  }

  const pkgSegments = pathname.split('/').filter(Boolean);

  // If there's only one segment, it's a short URL that needs redirecting
  if (pkgSegments.length === 1) {
    const pkgName = pkgSegments[0];
    
    // Avoid redirecting for special files like robots.txt or sitemaps
    if (pkgName.endsWith('.txt') || pkgName.endsWith('.xml') || pkgName.includes('.')) {
        return NextResponse.next();
    }

    try {
        const siteConfig = await getSiteConfig(pkgName);
        if (siteConfig && siteConfig.name) {
          const encodedSiteName = encodeURIComponent(siteConfig.name);
          const newPath = `/${encodedSiteName}/${pkgName}`;
          // Use a permanent redirect for SEO benefits
          return NextResponse.redirect(new URL(newPath, request.url), 301);
        }
    } catch (error) {
        // If fetching config fails, we can't build the new URL, so let it 404 gracefully.
        console.error(`Middleware failed to get site config for pkg: ${pkgName}`, error);
        return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run the middleware on all paths except for API routes and static files.
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|baidu_verify_codeva-CbXlKTGf85.html).*)',
}
