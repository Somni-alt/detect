import './globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {ReactNode} from 'react';
export const metadata = { title: 'Detect', description: 'SaaS de recrutement assisté' };
export default async function RootLayout({children}: {children: ReactNode}) {
  const messages = await getMessages();
  return (
    <html lang="fr">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
