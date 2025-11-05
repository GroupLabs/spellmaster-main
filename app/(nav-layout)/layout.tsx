import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../theme";
import Navigation from "@/components/nav";
import { Analytics } from "@vercel/analytics/react";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { Typography } from "@mui/material";
import CookieProvider from "@/components/cookie-provider";
export const metadata: Metadata = {
  title: "Spokabulary",
  description: "Learn vocabulary with fun games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reqUserAgent = userAgent({ headers: headers() });

  // If the user agent is from mobile, pop up a message
  if (
    reqUserAgent.device.type === "mobile" ||
    reqUserAgent.device.type === "tablet"
  ) {
    return (
      <html lang="en">
        <body
          style={{
            minHeight: "100vh",
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>
            This website is not optimized for mobile. Please use a desktop
            browser.
          </Typography>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <body
            style={{
              minHeight: "100vh",
              width: "100vw",
            }}
          >
            <CookieProvider>
              <Navigation>{children}</Navigation>
              <Analytics />
            </CookieProvider>
          </body>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
