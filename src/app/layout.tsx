import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Northgate Institute of Technology | Building Tomorrow's Skilled Professionals",
  description:
    "A premier Technical and Vocational Education and Training (TVET) institution. 9,000+ students, 150+ programmes, 96% graduate employability. Admissions open.",
  keywords: [
    "TVET",
    "Technical Education",
    "Vocational Training",
    "Engineering",
    "ICT",
    "Health Sciences",
    "Kenya TVET",
    "Skills Development",
  ],
  authors: [{ name: "Northgate Institute of Technology" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Northgate Institute of Technology",
    description: "Building Tomorrow's Skilled Professionals. Admissions Open.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${jakarta.variable} ${sora.variable} ${jetbrains.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
