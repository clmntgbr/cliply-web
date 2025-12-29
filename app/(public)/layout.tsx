import { ThemeProvider } from "@/components/layout/Theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth/provider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="white" enableSystem disableTransitionOnChange>
        {children}
        <Toaster richColors expand={false} position="top-right" closeButton />
      </ThemeProvider>
    </AuthProvider>
  );
}
