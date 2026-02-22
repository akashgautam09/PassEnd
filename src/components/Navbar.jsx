import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-[#c280fb] px-7 py-5 shadow-lg/10">
      <div className="flex font-semibold font-serif text-2xl"><span className="text-[#007773]">&lt; Pass</span><span>End /&gt;</span></div>
      <ul className="flex text-white text-xl items-center gap-7 font-semibold font-sans">
        <li><a href="/">Home</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#">About Us</a></li>
      </ul>
    </nav>
  )
}

export default Navbar