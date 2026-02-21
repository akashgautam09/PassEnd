import { useState } from "react"

const Manager = () => {
    const [showPass, setshowPass] = useState("bi-eye-fill")
    const [form, setform] = useState({ site: "", username: "", password: "" })

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = () => {
        console.log(form)
    }

    const showPassword = () => {
        if (showPass === "bi-eye-fill") {
            setshowPass("bi-eye-slash-fill")
        }
        else setshowPass("bi-eye-fill")
    }
    return (
        <>
            <div className="absolute inset-0 -z-10 h-full w-full bg-purple-50 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_100%_400px,#e4a3f599,transparent)]"></div></div>
            <div className="w-4xl mx-auto">
                <div className="flex flex-col justify-center items-center py-4 my-5">
                    <h1 className="flex font-semibold font-serif text-2xl"><span className="text-[#007773]">&lt; Pass</span><span>End /&gt;</span></h1>
                    <p className='font-sans font-semibold text-xl'>Your own password manager</p>
                </div>
                <div className="flex flex-col gap-6 items-center">
                    <div className="my-2 w-full">
                        <input type="text" name="site" id="" placeholder="Enter website URL" className="w-full font-sans font-semibold border-2 border-purple-700 py-2 px-2 rounded-3xl opacity-50" onChange={handleChange} />
                    </div>
                    <div className="flex justify-between relative gap-3 w-full">
                        <input type="text" name="username" id="" placeholder="Enter Username" className="text-black font-sans font-semibold border-2 border-purple-700 rounded-3xl py-2 px-2 opacity-50 w-2/3" onChange={handleChange} />
                        <input type="password" name="password" id="" placeholder="Enter Password" required className="font-sans font-semibold border-2 border-purple-700 rounded-3xl py-2 px-2 opacity-50 w-1/3" onChange={handleChange} />
                        <i className={`bi ${showPass}
                        text-2xl absolute top-1 right-2 cursor-pointer`} onClick={showPassword} ></i>
                    </div>
                    <button type="submit" className="flex items-center cursor-pointer bg-[#c68bfe] hover:bg-purple-400 duration-150 w-fit rounded-3xl px-4 py-1.5 font-sans font-semibold text-2xs gap-0.5"
                        onClick={handleSubmit}
                    >Add Password
                        <lord-icon
                            src="https://cdn.lordicon.com/efxgwrkc.json"
                            trigger="hover"
                            style={{ width: "30px", height: "30px" }}>
                        </lord-icon>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Manager