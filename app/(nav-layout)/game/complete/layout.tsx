import { Suspense } from "react";

export default function CompleteLayout(
  {
    children,
  }:
  Readonly<{
    children: React.ReactNode;
  }>
) {
  return <Suspense>
    {children}
  </Suspense>
}