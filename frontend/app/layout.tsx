import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobTracker.io | Secure Career Operations & Application Analytics",
  description:
    "Production-grade, zero-trust job application tracking platform with AES-256 encryption, MFA protection, Kanban boards, and GDPR compliance.",
  keywords: ["job tracker", "application tracker", "zero-trust security", "career operations"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "12px",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: "13px",
                border: "1px solid #1e293b",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#f8fafc" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#f8fafc" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
