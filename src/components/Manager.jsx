import Table from './Table'
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [showPass, setshowPass] = useState("bi-eye-fill")
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [PasswordArray, setPasswordArray] = useState([])
    const [Passtype, setPasstype] = useState("password")

    useEffect(() => {
        let passwords = localStorage.getItem("password")
        if (passwords) {
            setPasswordArray(JSON.parse(passwords))
        }
    }, [])

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = () => {
        const newArray = [...PasswordArray, { ...form, id: uuidv4() }]
        setPasswordArray(newArray)
        localStorage.setItem("password", JSON.stringify(newArray))
    }

    const showPassword = () => {
        if (showPass === "bi-eye-fill") {
            setshowPass("bi-eye-slash-fill")
            setPasstype("text")
        }
        else {
            setshowPass("bi-eye-fill")
            setPasstype("password")
        }
    }
    return (
        <div className='w-full min-h-full relative'>
            <div className="w-4xl flex flex-col mx-auto">
                <div className="flex flex-col justify-center items-center py-4 my-5">
                    <h1 className="flex font-semibold font-serif text-2xl"><span className="text-[#007773]">&lt; Pass</span><span>End /&gt;</span></h1>
                    <p className='font-sans font-semibold text-xl'>Your own password manager</p>
                </div>
                <div className="flex flex-col mb-2 gap-6 items-center">
                    <div className="my-2 w-full">
                        <input type="text" name="site" id="" placeholder="Enter website URL" className="w-full font-sans font-semibold border-2 border-purple-700 py-2 px-2 rounded-3xl opacity-50" onChange={handleChange} />
                    </div>
                    <div className="flex justify-between relative gap-3 w-full">
                        <input type="text" name="username" id="" placeholder="Enter Username" className="text-black font-sans font-semibold border-2 border-purple-700 rounded-3xl py-2 px-2 opacity-50 w-2/3" onChange={handleChange} />
                        <input type={Passtype} name="password" id="" placeholder="Enter Password" required className="font-sans font-semibold border-2 border-purple-700 rounded-3xl py-2 px-2 opacity-50 w-1/3" onChange={handleChange} />
                        <i className={`bi ${showPass}
                        text-2xl absolute top-1 right-2 cursor-pointer`} onClick={showPassword} ></i>
                    </div>
                    <button type="submit" className="flex items-center cursor-pointer bg-[#c68bfe] hover:bg-purple-400 duration-150 w-fit rounded-3xl px-4 py-1.5 gap-1.5"
                        onClick={handleSubmit}
                    > <lord-icon
                        src="https://cdn.lordicon.com/efxgwrkc.json"
                        trigger="hover"
                        style={{ width: "30px", height: "30px" }}>
                        </lord-icon>
                        <span className="font-serif font-semibold text-lg">Save</span>
                    </button>
                    <div className='w-full pb-3'>
                        <h1 className='font-bold font-sans text-2xl pb-2 pt-0.5 text-center text-cyan-900'>Your Passwords</h1>
                        <div className='min-h-[30vh] relative overflow-y-hidden'>
                            {PasswordArray.length === 0 && <div className='font-sans font-semibold text-center'>You haven't added any password yet !</div>}
                            {PasswordArray.length !== 0 && <Table PasswordArray={PasswordArray} setPasswordArray={setPasswordArray} setform={setform} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Manager