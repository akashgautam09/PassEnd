import { useState } from "react";
const Manager = () => {
    const [isTyping, setIsTyping] = useState(false);
    return (
        <>
            <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem]"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_100%_400px,#ffc0fa9c,transparent)]"></div></div>
            <div className="w-4xl mx-auto">
                <div className="flex flex-col justify-center items-center py-6">
                    <h1 className="flex font-semibold font-serif text-2xl"><span className="text-[#00908b]">&lt; Pass</span><span>End /&gt;</span></h1>
                    <p className='font-sans font-semibold text-xl'>Your own password manager</p>
                </div>
                <div className="text-white">
                    <div className="my-2"><input type="text" name="" id="" className="w-full bg-gray-400 py-2 px-2 rounded-3xl opacity-50" /></div>
                    <div className="flex justify-between">
                        <input type="text" name="" id="" className={`bg-gray-400 rounded-3xl py-2 px-2 opacity-50 w-2/5 ${isTyping ? "border-2 border-green-300" : "border-2 border-transparent"}`} onChange={() => { setIsTyping(true) }} />
                        <input type="text" name="" id="" className="bg-gray-400 rounded-3xl py-2 px-2 opacity-50 w-1/3 " />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Manager