import React from "react";
import { Button } from "./ui/button";
import { Heart, CarFront, Layout, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md border-b border-white/10"></div>
      <nav className="relative mx-auto px-4 py-4 flex items-center justify-between container">
        <Link href={isAdminPage ? "/admin" : "/"} className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <Image
              src={"/logo.png"}
              alt="Vehiql Logo"
              width={140}
              height={40}
              className="relative h-10 w-auto object-contain brightness-0 invert"
            />
          </div>
          {isAdminPage && (
            <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full border border-blue-400/20">ADMIN</span>
          )}
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <>
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft size={18} />
                  <span>Back to App</span>
                </Button>
              </Link>
            </>
          ) : (
            <SignedIn>
              {!isAdmin && (
                <Link
                  href="/reservations"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Button variant="ghost" className="hover:bg-white/5">
                    <CarFront size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              )}
              <a href="/saved-cars">
                <Button variant="ghost" className="flex items-center gap-2 hover:text-red-400 hover:bg-red-400/10">
                  <Heart size={18} />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </a>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="flex items-center gap-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
                    <Layout size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </SignedIn>
          )}

          <SignedOut>
            {!isAdminPage && (
              <SignInButton forceRedirectUrl="/">
                <Button className="font-semibold shadow-lg shadow-blue-500/20">Login</Button>
              </SignInButton>
            )}
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-white/10",
                },
              }}
              userProfileMode="navigation"
              userProfileUrl="/profile"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
