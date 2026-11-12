import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cart-store";
import { AuthSessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Visual Bar Store — Premium Digital Video Marketplace",
  description:
    "Download premium Visual Bar video packs: neon, cyber, fluid and ambient motion loops for VJs, streamers and creators.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AuthSessionProvider>
          <CartProvider>
            {children}
            <Toaster theme="dark" position="bottom-right" />
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
