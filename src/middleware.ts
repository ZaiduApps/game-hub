
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSiteConfig } from '@/config/site';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pkgSegments = pathname.split('/').filter(Boolean);

  // Ignore Next.js specific paths, API routes, and files with extensions
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pkgSegments.length > 0 && pkgSegments[pkgSegments.length - 1].includes('.')) {
    return NextResponse.next();
  }
  
  // Handle root redirect to default package
  if (pathname === '/') {
    const siteConfig = await getSiteConfig('com.tencent.ig');
    if (siteConfig && siteConfig.name) {
      const encodedSiteName = encodeURIComponent(siteConfig.name);
      return NextResponse.redirect(new URL(`/${encodedSiteName}/com.tencent.ig`, request.url), 301);
    }
    // Fallback if the default config fails for some reason
    return NextResponse.redirect(new URL('/com.tencent.ig', request.url), 301);
  }

  // If there's only one segment, it's a short URL that needs redirecting for SEO
  if (pkgSegments.length === 1) {
    const pkgName = pkgSegments[0];

    try {
        const siteConfig = await getSiteConfig(pkgName);
        if (siteConfig && siteConfig.name) {
          const encodedSiteName = encodeURIComponent(siteConfig.name);
          const newPath = `/${encodedSiteName}/${pkgName}`;
          // Use a permanent redirect for SEO benefits
          return NextResponse.redirect(new URL(newPath, request.url), 301);
        }
    } catch (error) {
        // If fetching config fails, let it pass through to the page to render a 404.
        console.error(`Middleware failed to get site config for pkg: ${pkgName}`, error);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run the middleware on all paths except for API routes and static files.
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
