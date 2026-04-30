const Footer = () => {
    return (
        <div className='absolute flex flex-col justify-center items-center w-full bg-slate-700 min-h-36'>
            <div className="flex font-semibold font-serif text-2xl text-cente pb-3"><p className="text-[#00a09b]">&lt; Pass</p><p className="text-white">End /&gt;</p></div>
            <div className='flex items-center font-semibold text-lg text-white'>Created with<span className='flex justify-center items-center px-2'>
                <i className='bi bi-heart-fill text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]'></i>
            </span>by Akash Gautam</div>
            <div className='flex gap-4 mt-2'>
                <a href="https://github.com/akashgautam09" target="_blank" rel="noopener noreferrer" className='text-white hover:text-[#00a09b] transition'>
                    <i className='bi bi-github text-xl'></i>
                </a>
                <a href="https://www.linkedin.com/in/akash-gautam-07664230a/" target="_blank" rel="noopener noreferrer" className='text-white hover:text-[#00a09b] transition'>
                    <i className='bi bi-linkedin text-xl'></i>
                </a>
            </div>
        </div>
    )
}

export default Footer