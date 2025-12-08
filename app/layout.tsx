import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LULC Analytics Dashboard",
  description: "Land Use/Land Cover Analytics and Change Statistics",
  generator: "zameer",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (

    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full flex flex-col overflow-hidden">

        <header className=" bg-slate-950 border-b border-slate-700 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">LULC Dashboard</h1>
              <nav className="flex gap-6">
                <a href="/analysis" className="text-slate-300 hover:text-white">📊 Analysis</a>
                <a href="/map" className="text-slate-300 hover:text-white">🗺️ Map</a>
              </nav>
            </div>
          </div>
        </header>
        <div className="flex-1  overflow-y-scroll">
          {children}
        </div>

        <footer className=" text-center text-sm text-gray-500 flex-shrink-0">
          FYP by <span className="font-semibold">Zameer Abbas</span> — GIS & RS 2020
        </footer>

        <Analytics />

      </body>
    </html>


  )
}
