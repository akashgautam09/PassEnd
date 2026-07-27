import { SignedOut, SignInButton, SignUpButton, useUser, UserButton, SignedIn } from "@clerk/clerk-react";

const Navbar = () => {
  const user = useUser();
  return (
    <nav className="flex sticky top-0 z-30 items-center justify-between bg-[#c280fbee] backdrop-blur-md px-4 sm:px-6 md:px-8 py-3.5 shadow-md">
      <div className="flex font-semibold font-serif text-lg sm:text-xl md:text-2xl tracking-tight">
        <span className="text-[#007773]">&lt; Pass</span>
        <span className="text-purple-950">End /&gt;</span>
      </div>
      <div className="flex items-center justify-center">
        <SignedOut>
          <ul className="flex gap-2 sm:gap-4 items-center">
            <li>
              <SignInButton mode="modal">
                <button className="font-semibold cursor-pointer text-transparent bg-clip-text bg-linear-to-r from-[#007773] to-purple-950 font-serif text-sm sm:text-base md:text-lg hover:opacity-80 transition-opacity">Sign In</button>
              </SignInButton>
            </li>
            <li className="text-purple-700/50">|</li>
            <li>
              <SignUpButton mode="modal">
                <button className="font-semibold cursor-pointer text-transparent bg-clip-text bg-linear-to-r from-[#007773] to-purple-950 font-serif text-sm sm:text-base md:text-lg hover:opacity-80 transition-opacity">Sign Up</button>
              </SignUpButton>
            </li>
          </ul>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-2 font-semibold text-purple-950 font-serif text-sm sm:text-base">
            <UserButton />
            <span className="font-medium text-xs sm:text-sm max-w-[120px] sm:max-w-[200px] truncate">{user?.user?.fullName || user?.user?.firstName}</span>
          </div>
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar