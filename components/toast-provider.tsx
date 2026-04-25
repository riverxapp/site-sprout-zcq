"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <Toaster richColors closeButton theme={theme as "light" | "dark" | "system"} />
    </>
  );
}
