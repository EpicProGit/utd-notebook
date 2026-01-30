import '@src/styles/globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleAnalytics } from '@next/third-parties/google';
import { type Metadata } from 'next';
import { Bai_Jamjuree, Inter } from 'next/font/google';
import { RegisterModalProvider } from '@src/components/account/RegisterModalProvider';
import { ToastProvider } from '@src/components/toast/ToastProvider';
import { TRPCReactProvider } from '@src/trpc/react';
import ClientLocalizationProvider from '@src/utils/localization';
import theme from '@src/utils/theme';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const baiJamjuree = Bai_Jamjuree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://notebook.utdnebula.com'),
  title: {
    template: '%s - UTD NOTEBOOK',
    default: 'UTD NOTEBOOK',
  },
  description: '',
  openGraph: {
    title: 'UTD Notebook',
    description: '',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
};
export const viewport = {
  //copied from globals.css
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#573dff' },
    { media: '(prefers-color-scheme: dark)', color: '#a297fd' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`bg-white dark:bg-black ${baiJamjuree.className} text-haiti dark:text-white`}
      >
        <AppRouterCacheProvider>
          <TRPCReactProvider>
            <ThemeProvider theme={theme}>
              <ClientLocalizationProvider>
                <ToastProvider>
                  <RegisterModalProvider>{children}</RegisterModalProvider>
                </ToastProvider>
              </ClientLocalizationProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </AppRouterCacheProvider>
        {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && (
          <GoogleAnalytics gaId="G-3NDS0P32CZ" />
        )}
      </body>
    </html>
  );
}
