import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
// Removed unused redirect import

const Navbar = async () => {
  const session = await auth();
  const user = session?.user; // Get user for easier access

  return (
    // Use a subtle bottom border instead of shadow for a flatter look
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="flex justify-between items-center max-w-6xl mx-auto px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/realdisruptor_logo.jpg" // Ensure this path is correct
            alt="Real Disruptor Logo"
            width={40} // Slightly smaller logo
            height={40}
            priority // Prioritize loading the logo LCP
          />
        </Link>

        {/* Navigation/Auth Links - Use consistent text size and subtle hover effects */}
        <div className="flex items-center gap-4 sm:gap-5 text-sm text-gray-600">
          {user ? (
            <>
              <Link
                href="/ideas/create"
                className="hover:text-gray-900 transition-colors"
              >
                Create
              </Link>
              <Link
                href="/profile"
                className="hover:text-gray-900 transition-colors font-medium"
              >
                {/* Display user's name or a generic profile link */}
                {user.name ? user.name.split(" ")[0] : "Profile"}{" "}
                {/* Show first name or fallback */}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                {/* Style button to look like a link */}
                <button
                  type="submit"
                  className="hover:text-gray-900 transition-colors"
                >
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                // Specify provider if necessary, e.g., await signIn('github');
                await signIn();
              }}
            >
              {/* Style button to look like a link */}
              <button
                type="submit"
                className="hover:text-gray-900 transition-colors"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
