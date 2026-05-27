import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SustainRoute AI — Real-Time Sustainability Decision Infrastructure",
  description:
    "A decision intelligence layer that balances sustainability, cost, time, and convenience for everyday transport, food, and delivery decisions.",
  metadataBase: new URL("https://sustainroute.ai"),
  openGraph: {
    title: "SustainRoute AI",
    description:
      "Real-time sustainability decision intelligence. Optimization-first, AI-explained.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, mono.variable, "dark")}>
      <body className="min-h-screen font-sans antialiased">
        <div className="aurora" />
        {children}
      </body>
    </html>
  );
}
