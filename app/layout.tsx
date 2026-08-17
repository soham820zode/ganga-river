import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AlertToastManager } from '../components/alerts/AlertToastManager';
import { DemoShell } from '../components/demo/DemoShell';
import { AetherisRiverCanvas } from '../components/aetheris/AetherisRiverCanvas';
import { AppIntroAnimation } from '../components/ui/AppIntroAnimation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JAL PULSE // Real-Time Ganga River Water Quality Intelligence & Forecasting",
  description: "Real-time environmental intelligence for monitoring, forecasting, and understanding the Ganga river water quality system.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-grid-texture">
        {/* Startup Intro Animation */}
        <AppIntroAnimation />

        {/* 3D River Canvas — fixed behind everything */}
        <AetherisRiverCanvas />

        {/* All content floats above the canvas */}
        <div className="relative z-10 flex flex-col min-h-full">
          {children}
        </div>

        <DemoShell />
        <AlertToastManager />
      </body>
    </html>
  );
}
