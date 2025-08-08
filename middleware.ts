// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr'
});

// n’intercepte pas /api, _next, assets
export const config = {matcher: ['/((?!api|_next|.*\\..*).*)']};