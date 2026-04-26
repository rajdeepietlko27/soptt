"use client";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";
import { useState } from "react";
import { Building, Plus, Ticket } from "lucide-react";
import { UpgradeModal } from "./UpgradeModal";

const Header = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isLoading } = useStoreUser();
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-xl z-20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/spott.png"
            alt="spott logo"
            width={500}
            height={500}
            className="w-full h-11"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <Button variant={"ghost"} size="sm" onClick={()=>  setShowUpgradeModal(true)}>
            Pricing
          </Button>

          <Button variant="ghost" size="sm" asChild className={"mr-2"}>
            <Link href="/explore">Explore</Link>
          </Button>

          <Show when="signed-out">
            <SignInButton>
              <button className="bg-transparent text-white border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 text-sm cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-purple-700 text-white rounded-full px-4 py-2 text-sm cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button
              size="sm"
              asChild
              className="flex gap-2 mr-4 bg-white text-black hover:bg-gray-200"
            >
              <Link href="/create-event">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Event</span>
              </Link>
            </Button>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Tickets"
                  labelIcon={<Ticket size={16} />}
                  href="/my-tickets"
                />
                <UserButton.Link
                  label="My Events"
                  labelIcon={<Building size={16} />}
                  href="/my-events"
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </Show>
        </div>
      </div>

      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}

      {/* loader */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 w-full">
          <BarLoader width={"100%"} color="#a855f7" />
        </div>
      )}
    </nav>
  );
};

export default Header;
