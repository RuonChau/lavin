import type { Metadata } from "next";

const siteUrl = "https://web-admin-cafe-shop.vercel.app";
const title = "Lavin Cafe ERP";
const description =
  "Lavin — Nền tảng ERP quản lý quán cà phê thông minh, giúp chủ quán kiểm soát đơn hàng, kho nguyên liệu, nhân sự và doanh thu trên cùng một hệ thống. Vận hành đơn giản, số liệu chính xác theo thời gian thực — để bạn tập trung vào điều quan trọng nhất: chất lượng đồ uống và trải nghiệm khách hàng.";
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
