const Footer = () => {
    return (
        <footer className='flex flex-col justify-center items-center w-full border-t border-[#e8e1f0] bg-white px-4 py-8'>
            <div className="brand-mark flex text-2xl font-bold pb-3"><p><span>&lt; Pass</span>End /&gt;</p></div>
            <div className='flex items-center text-sm font-semibold text-[#4c4a70]'>Created with<span className='flex justify-center items-center px-2'>
                <i className='bi bi-heart-fill text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]'></i>
            </span>by Akash Gautam</div>
            <div className='flex gap-4 mt-2'>
                <a href="https://github.com/akashgautam09" target="_blank" rel="noopener noreferrer" aria-label="PassEnd on GitHub" className='text-[#4c4a70] hover:text-[#7c3aed] transition'>
                    <i className='bi bi-github text-xl'></i>
                </a>
                <a href="https://www.linkedin.com/in/akash-gautam-07664230a/" target="_blank" rel="noopener noreferrer" aria-label="Akash Gautam on LinkedIn" className='text-[#4c4a70] hover:text-[#7c3aed] transition'>
                    <i className='bi bi-linkedin text-xl'></i>
                </a>
            </div>
        </footer>
    )
}

export default Footer