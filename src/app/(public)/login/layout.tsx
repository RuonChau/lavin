import type { Metadata } from "next";

const siteUrl = "https://web-admin-cafe-shop.vercel.app";
const title = "Lavin Cafe ERP";
const description =
  "He thong ERP danh cho chuoi cafe, giup quan ly ban hang, don hang, thuc don, kho hang, chi nhanh, nhan vien, khach hang va bao cao.";
const ogImage = `${siteUrl}/og/lavin-og.png`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${siteUrl}/login`,
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/login`,
    siteName: "Lavin Cafe",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Lavin Cafe ERP",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
