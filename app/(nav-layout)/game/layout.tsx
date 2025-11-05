import { color_surface_variant } from "@/theme";
import { Stack } from "@mui/material";
import { Suspense } from "react";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Stack
      width={"100%"}
      minHeight={"calc(100vh - 64px)"}
      style={{
        background: color_surface_variant,
      }}
    >
      <Suspense>{children}</Suspense>
    </Stack>
  );
}
