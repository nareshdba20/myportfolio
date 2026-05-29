import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Naresh Gowda — Engineer & Builder",
  description:
    "Computer Engineer, Database Administrator, SWE at Evozn Inc. 5+ years building production systems.",
  keywords: ["Naresh Gowda", "Software Engineer", "Database Administrator", "React", "Next.js", "AWS"],
  authors: [{ name: "Naresh Gowda" }],
  openGraph: {
    title: "Naresh Gowda — Engineer & Builder",
    description: "Computer Engineer · Database Administrator · Building cool things",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
