import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Premium Apparel Sourcing - Your Trusted Partner',
  description: 'Leading apparel sourcing company with quality products, efficient delivery, and global network. Your trusted partner in apparel sourcing.',
  generator: '360dsoul.com',
  keywords: 'apparel sourcing, clothing supplier, quality garments, wholesale apparel',
  authors: [{ name: 'Your Company' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourcompany.com',
    title: 'Premium Apparel Sourcing - Your Trusted Partner',
    description: 'Leading apparel sourcing company with quality products, efficient delivery, and global network.',
    siteName: 'Premium Apparel Sourcing',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
