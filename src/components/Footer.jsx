const Footer = () => {
    return (
        <footer className='relative w-full mt-auto flex flex-col justify-center items-center bg-slate-800 text-white py-6 px-4 gap-1.5 z-10'>
            <div className="flex font-semibold font-serif text-xl sm:text-2xl tracking-tight">
                <p className="text-[#00a09b]">&lt; Pass</p>
                <p className="text-white">End /&gt;</p>
            </div>
            <div className='flex items-center font-medium text-sm sm:text-base text-gray-300'>
                Created with
                <span className='flex justify-center items-center px-1.5'>
                    <i className='bi bi-heart-fill text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] text-xs sm:text-sm'></i>
                </span>
                by Akash Gautam
            </div>
            <div className='flex gap-4 mt-1'>
                <a href="https://github.com/akashgautam09" target="_blank" rel="noopener noreferrer" className='text-gray-300 hover:text-[#00a09b] transition-colors p-1' title="GitHub">
                    <i className='bi bi-github text-lg sm:text-xl'></i>
                </a>
                <a href="https://www.linkedin.com/in/akash-gautam-07664230a/" target="_blank" rel="noopener noreferrer" className='text-gray-300 hover:text-[#00a09b] transition-colors p-1' title="LinkedIn">
                    <i className='bi bi-linkedin text-lg sm:text-xl'></i>
                </a>
            </div>
        </footer>
    )
}

export default Footer