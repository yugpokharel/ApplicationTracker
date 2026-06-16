import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Job Tracker | Manage Your Applications",
  description:
    "A clean, production-ready job application tracker. Add, edit, filter, and track all your applications in one place.",
  keywords: ["job tracker", "application tracker", "career", "job search"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#f8fafc" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#f8fafc" },
            },
          }}
        />
      </body>
    </html>
  );
}
