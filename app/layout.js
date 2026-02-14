import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata = {
  title: "Vehiqle",
  description: "Find your Dream Car",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <head>
          <link rel="icon" href="/logo-white.png" sizes="any" />
        </head>
        <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans bg-background text-foreground relative`}>
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Toaster richColors theme="dark" />

          <footer className="bg-muted/30 py-12 border-t border-white/10 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center text-gray-400">
              <p>Made with 💗 by RoadsideCoder</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
