import { SignedOut, SignInButton, UserButton, SignedIn } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className="flex sticky top-0 z-30 items-center justify-between bg-[#c280fbee] md:px-7 px-3 py-5 shadow-lg/15">
      <div className="flex font-semibold font-serif text-xl md:text-2xl"><span className="text-[#007773]">&lt; Pass</span><span>End /&gt;</span></div>
      <div className="flex items-center justify-center">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="font-semibold cursor-pointer text-transparent bg-clip-text bg-linear-to-r from-[#007773] to-black font-serif text-xl ">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <button className="pt-0.5">
          <UserButton />
          </button>
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar