import Navbar from "./components/Navbar"
import Manager from "./components/Manager"
import Footer from "./components/Footer"
const App = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 min-h-screen w-full bg-purple-50 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_100%_400px,#e5b9f199,transparent)]"></div></div>
      <div className="min-h-screen relative pb-6">
        <Navbar />
        <Manager />
      </div>
      <Footer />
    </div>
  )
}

export default App
