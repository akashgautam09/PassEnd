import Table from './Table'
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const Manager = () => {
    const [showPass, setshowPass] = useState("bi-eye-fill")
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [PasswordArray, setPasswordArray] = useState([])
    const [Passtype, setPasstype] = useState("password")

    const getPassword = async () => {
        let res = await fetch('http://localhost:3000/')
        let passwords = await res.json()
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPassword()
    }, [])

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = async () => {
        const newArray = [...PasswordArray, { ...form, id: uuidv4() }]
        setPasswordArray(newArray)

        await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

        await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...form, id: uuidv4() })
        })
        // localStorage.setItem("password", JSON.stringify(newArray))
        setform({ site: "", username: "", password: "" })
        toast.success('Saved successfully!', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
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
        <div className="md:w-4xl flex flex-col relative mx-auto px-2">
            <div className="flex flex-col justify-center items-center py-4 my-5">
                <h1 className="flex font-semibold font-serif text-2xl"><span className="text-[#007773]">&lt; Pass</span><span>End /&gt;</span></h1>
                <p className='font-sans font-semibold text-xl'>Your own password manager</p>
            </div>
            <div className="flex flex-col mb-2 gap-6 items-center">
                <div className="md:my-2 w-full">
                    <input type="text" name="site" id="site" value={form.site} placeholder="Enter website URL" className="w-full font-sans font-semibold border-2 border-purple-700 py-2 px-2 rounded-3xl opacity-50" onChange={handleChange} />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-3 w-full">
                    <input type="text" name="username" id="username" value={form.username} placeholder="Enter Username" className="text-black font-sans font-semibold border-2 border-purple-700 rounded-3xl py-2 px-2 opacity-50 w-full md:w-2/3" onChange={handleChange} />
                    <span className='relative w-full md:w-1/3'>
                        <input type={Passtype} name="password" id="password" value={form.password} placeholder="Enter Password" required className="font-sans font-semibold border-2 border-purple-700 rounded-3xl py-2 px-2 opacity-50 w-full" onChange={handleChange} />
                        <i className={`bi ${showPass}
                        text-2xl absolute top-1 right-2 cursor-pointer`} onClick={showPassword} ></i>
                    </span>
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
                        {PasswordArray.length !== 0 && <Table PasswordArray={PasswordArray} setPasswordArray={setPasswordArray} setform={setform} form={form} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Manager