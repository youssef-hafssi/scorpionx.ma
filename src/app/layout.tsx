import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { OrderProvider } from "@/lib/order-context";
import { AuthProvider } from "@/lib/auth-context";
import { CouponProvider } from "@/lib/coupon-context";
import { ConditionalLayout } from "@/components/layout/conditional-layout";

export const metadata: Metadata = {
  title: "ScorpionX - Premium Moroccan Street & Islamic Wear",
  description: "Discover premium streetwear and Islamic modest wear from ScorpionX. Quality products designed for brothers in Morocco.",
  icons: {
    icon: "/singlelogo.png",
    shortcut: "/singlelogo.png",
    apple: "/singlelogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  return (
    <html lang="en">
      <body className="antialiased sf-mono-font">
        <OrderProvider>
          <CartProvider>
            <CouponProvider>
              <AuthProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </AuthProvider>
            </CouponProvider>
          </CartProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
