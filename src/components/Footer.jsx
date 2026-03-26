const Footer = () => {
    return (
        <div className='absolute flex flex-col justify-center items-center w-full bg-slate-700 min-h-36'>
            <div className="flex font-semibold font-serif text-2xl text-cente pb-3"><p className="text-[#00a09b]">&lt; Pass</p><p className="text-white">End /&gt;</p></div>
            <div className='flex items-center font-semibold text-lg text-white'>Created with<span className='flex justify-center items-center px-2'>
                <i className='bi bi-heart-fill text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]'></i>
            </span>by Akash Gautam</div>
        </div>
    )
}

export default Footer