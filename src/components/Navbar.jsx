import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-purple-300 px-7 py-3">
      <div className="flex font-semibold font-serif text-2xl"><span className="text-white">Pass</span><span>End</span></div>
      <ul className="flex items-center gap-7 font-semibold font-serif">
        <li><a href="/">Home</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#">About Us</a></li>
      </ul>
    </nav>
  )
}

export default Navbar