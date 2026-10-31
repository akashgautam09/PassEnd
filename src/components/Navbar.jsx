import { SignedOut, SignInButton, SignUpButton, useUser, UserButton, SignedIn } from "@clerk/clerk-react";
import SecurityPanel from './SecurityPanel';

const Navbar = () => {
  const user = useUser();
  return (
    <nav className="sticky top-0 z-50 border-b border-[#e8e1f0] bg-white/95 backdrop-blur-md shadow-[0_4px_18px_rgba(52,32,91,0.06)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <div className="brand-mark text-xl sm:text-2xl font-bold"><span>&lt; Pass</span>End /&gt;</div>
      <div className="flex items-center justify-center">
        <SignedOut>
          <ul className="flex items-center gap-2 sm:gap-4">
            <li>
              <SignInButton mode="modal">
                <button className="rounded-lg px-3 py-2 text-sm font-semibold text-[#4c4a70] transition hover:bg-[#f4effb] hover:text-[#7c3aed]">Sign In</button>
              </SignInButton>
            </li>
            <li>
              <SignUpButton mode="modal">
                <button className="rounded-lg bg-[#7c3aed] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6d28d9]">Sign Up</button>
              </SignUpButton>
            </li>
          </ul>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-2 sm:gap-4">
            <SecurityPanel />
            <div className="flex items-center gap-2 border-l border-[#e8e1f0] pl-2 sm:pl-4">
              <UserButton appearance={{ elements: { avatarBox: 'h-9 w-9' } }} />
              <span className="hidden text-sm font-semibold text-[#1b2140] sm:inline">{user?.user?.firstName || user?.user?.fullName}</span>
            </div>
          </div>
        </SignedIn>
      </div>
      </div>
    </nav>
  )
}

export default Navbar