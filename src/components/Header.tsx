"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { checkAndAddUser } from "@/actions/user-actions";
import { useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const userId = user.id;
      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (userId && userEmail) {
        checkAndAddUser(userId, userEmail);
      }
    }
  }, [user]);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold cursor-pointer">Test Paid</h1>
        </Link>
        <nav className="flex items-center space-x-4">
          <SignedIn>
            <Link href="/transactions">
              <Button size="lg" className="text-xl" variant="ghost">
                Transactions
              </Button>
            </Link>
          </SignedIn>
          <ClerkLoading>
            <Loader size={24} className="text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: 50,
                        height: 50,
                      },
                    },
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="text-xl" variant="ghost">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </nav>
      </div>
    </header>
  );
};

export default Header;
