import type { Metadata } from 'next';
import { Be_Vietnam_Pro, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Providers } from '@/shared/components/Providers';


const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-mono',
});

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = 'Lavin Coffee Chain Management System';
  const fallbackDescription = 'Premium High-End ERP for Coffee Shop Chains';
  const fallbackLogo = '/logo.svg';
  const settingsUrl = `${process.env.API_PROXY_TARGET ?? 'http://localhost:8700/api/v1'}/settings/public`;

  try {
    const res = await fetch(settingsUrl, {
      next: { revalidate: 60 }, // Cache settings for 60 seconds
    });

    if (res.ok) {
      const body = await res.json();
      if (body?.success && body?.data) {
        const { brandName, description, logo } = body.data;
        const logoUrl = logo?.[0]?.url || fallbackLogo;

        return {
          title: brandName ? `${brandName} - Management System` : fallbackTitle,
          description: description || fallbackDescription,
          icons: {
            icon: logoUrl,
            shortcut: logoUrl,
            apple: logoUrl,
          },
        };
      }
    }
  } catch (error) {
    console.warn('Unable to load public settings for metadata, using fallback:', error);
  }

  return {
    title: fallbackTitle,
    description: fallbackDescription,
    icons: {
      icon: fallbackLogo,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${beVietnamPro.variable} ${ibmPlexMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased text-[#2D3748] bg-[#EEF8FA]">
        <AntdRegistry>
          <Providers>
            {children}
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
