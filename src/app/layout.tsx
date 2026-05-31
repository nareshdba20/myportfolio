import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "Naresh Gowda — Engineer & Builder",
  description: "Software Engineer, Database Administrator, Cloud & DevOps. 7+ years building production systems.",
  keywords: ["Naresh Gowda", "Software Engineer", "Database Administrator", "React", "Next.js", "AWS"],
  authors: [{ name: "Naresh Gowda" }],
  openGraph: {
    title: "Naresh Gowda — Engineer & Builder",
    description: "Database Engineer · Cloud & DevOps · Building cool things",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Nav />
          {/* ml-16 on desktop offsets the fixed sidebar; pb-16 on mobile offsets the fixed bottom nav */}
          <div className="md:ml-16 pb-16 md:pb-0 min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
