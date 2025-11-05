import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";

export default function UnityContainedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      {children}
      <Analytics />
    </Suspense>
  );
}
