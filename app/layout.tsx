import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import WhatsAppWidget from "@/components/ui/whatsapp-widget"
import Breadcrumb from "@/components/ui/breadcrumb"
import PageIndicator from "@/components/ui/page-indicator"
import NavProgress from "@/components/ui/nav-progress"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AmeriTrust Insurance Group - Comprehensive Insurance Solutions",
  description:
    "Protect what matters most with AmeriTrust Insurance Group. Auto, Home, Commercial, Business, Life & Health insurance. Same day quotes, 24/7 support, no loss runs needed.",
  keywords:
    "insurance, auto insurance, home insurance, commercial insurance, business insurance, life insurance, health insurance, AmeriTrust",
  authors: [{ name: "AmeriTrust Insurance Group" }],
  openGraph: {
    title: "AmeriTrust Insurance Group - Comprehensive Insurance Solutions",
    description: "Protect what matters most with comprehensive insurance solutions. Same day quotes, 24/7 support.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AmeriTrust Insurance Group",
    description: "Comprehensive insurance solutions with same day quotes and 24/7 support.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavProgress />
        <Header />
        <Breadcrumb />
        <main>{children}</main>
        <Footer />
        <WhatsAppWidget />
        <PageIndicator />
      </body>
    </html>
  )
}
