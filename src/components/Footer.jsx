const Footer = () => {
    return (
        <div className='absolute flex flex-col justify-center items-center w-full bg-slate-700 min-h-32'>
            <div className="flex font-semibold font-serif text-2xl text-center"><p className="text-[#00a09b]">&lt; Pass</p><p className="text-white">End /&gt;</p></div>
            <div className='flex items-center font-semibold text-lg text-white'>Created with<i className='bi bi-heart-fill text-red-500 px-1.5'></i>by Akash Gautam</div>
        </div>
    )
}

export default Footer