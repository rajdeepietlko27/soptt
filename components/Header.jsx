import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <>
     <nav className="fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-xl z-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={"/"} className="flex items-center">
            <Image
              src="/spott.png"
              alt="spott logo"
              width={500}
              height={500}
              className="w-full h-11"
              priority
            />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
