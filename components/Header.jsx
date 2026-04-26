"use client";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {BarLoader} from "react-spinners"

const Header = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-xl z-20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/spott.png" alt="spott logo" width={500} height={500} className="w-full h-11" priority />
        </Link>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton>
              <Button size="sm" className="bg-transparent text-white border border-white/30 hover:bg-white/10 rounded-full">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm" className="bg-purple-700 text-white rounded-full">
                Sign Up
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>


      </div>

        {/* loader */}
        <div className="absolute bottom-0 left-0 w-full"  >
          <BarLoader width={"100%"} color="#a855f7" />
        </div>
    </nav>
  );
};

export default Header;