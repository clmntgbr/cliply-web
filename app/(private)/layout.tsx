import { ThemeProvider } from "@/components/layout/Theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { UserProvider } from "@/lib/user/provider";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="white" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <UserProvider>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16">{children}</div>
          <Toaster richColors expand={false} position="top-right" closeButton />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
