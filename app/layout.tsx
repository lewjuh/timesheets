import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";

import { Theme } from "@radix-ui/themes";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import "@radix-ui/themes/styles.css";

export const metadata = {
  title: "Precedent - Building blocks for your Next.js project",
  description:
    "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
  metadataBase: new URL("https://precedent.dev"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cx(sfPro.variable, inter.variable)}>
        <Theme appearance="light">
          <Suspense fallback="...">
            <Nav />
          </Suspense>
          <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
            {children}
          </main>
          <Footer />
          <Analytics />
        </Theme>
      </body>
    </html>
  );
}
