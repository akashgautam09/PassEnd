import Navbar from "./components/Navbar"
import Manager from "./components/Manager"
import Footer from "./components/Footer"
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const App = () => {
  return (
    <div>
      <div className="min-h-screen relative pb-6">
        <div className="absolute inset-0 -z-10 min-h-screen w-full bg-purple-50 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_100%_400px,#e5b9f199,transparent)]"></div>
        </div>

        <Navbar />

        <SignedOut>
          <div className="flex flex-col justify-center items-center min-h-[85vh] px-4">
            {/* Glassmorphism Card */}
            <div className="bg-white/40 backdrop-blur-lg border border-white/50 shadow-2xl rounded-4xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden">

              {/* Animated Background Glows inside the card */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

              <div className="relative z-10 flex flex-col items-center">
                {/* Security Icon */}
                <div className="bg-linear-to-br from-purple-100 to-purple-300 p-4 rounded-full shadow-inner mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#581c87" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-[#007773] to-purple-800 mb-4 tracking-tight">
                  &lt; PassEnd /&gt;
                </h1>

                <p className="text-gray-700 text-2xs mb-8 font-medium px-4">
                  Your ultimate digital vault. Secure, manage, and access your passwords with military-grade peace of mind.
                </p>

                <SignInButton mode="modal">
                  <button className="w-full relative group overflow-hidden bg-purple-700 text-white font-bold text-lg py-3.5 px-8 rounded-full shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/50">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started Securely
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 h-full w-full rounded-full transition-all duration-300 group-hover:bg-white/20 z-0"></div>
                  </button>
                </SignInButton>

                <p className="mt-6 text-sm text-gray-500 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  End-to-End Encrypted
                </p>
              </div>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <Manager />
        </SignedIn>

      </div>
      <Footer />
    </div>
  )
}

export default App