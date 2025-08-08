// lib/i18n.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr'
});

// évite d'intercepter /api, _next et assets
export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] };