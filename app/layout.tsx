"use client"

import React from "react";
import { Amplify } from "aws-amplify";
import "./app.css";
import "@aws-amplify/ui-react/styles.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./lib/theme";

import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <body>
            {children}
          </body>          
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}