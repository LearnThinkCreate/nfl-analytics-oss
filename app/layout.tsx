import type { Metadata } from "next";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { fontVariables } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "NFL Analytics",
  description:
    "Player statistics and interactive visualizations for NFL offensive skill positions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  // const sidebarState = cookieStore.get("sidebar_state")?.value || "true";
  // const defaultOpen = sidebarState === "true";
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          fontVariables,
          "font-kelly-slab"
        )}
      >
        <ThemeProvider
          attribute="class"
          // defaultTheme="light"
          forcedTheme="light"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <main className="[--header-height:calc(theme(spacing.14))]">
            <SidebarProvider
              defaultOpen={defaultOpen}
              className="flex flex-col"
            >
              {children}
            </SidebarProvider>
          </main>
          <TailwindIndicator />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
