import Table from './Table'
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/clerk-react';

const Manager = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const { user } = useUser();
    const [showPass, setshowPass] = useState("bi-eye-fill")
    const [form, setform] = useState({ site: "", identifierType: "username", identifier: "", password: "" })
    const [PasswordArray, setPasswordArray] = useState([])
    const [Passtype, setPasstype] = useState("password")

    const getPassword = async () => {
        if (!user || !user.id) return;

        let res = await fetch(`${API_URL}/?userId=${user.id}`)
        let passwords = await res.json()
        setPasswordArray(passwords)
    }

    useEffect(() => {
        if (user && user.id) {
            getPassword()
        }
    }, [user])

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const validateUrl = (url) => {
        if (!url.trim()) return false;
        try {
            new URL(url.startsWith('http') ? url : 'https://' + url);
            return true;
        } catch {
            return false;
        }
    }

    const handleSubmit = async () => {
        if (!form.site.trim()) {
            toast.error('Please enter a website URL');
            return;
        }
        if (!validateUrl(form.site)) {
            toast.error('Please enter a valid website URL (e.g., example.com or https://example.com)');
            return;
        }
        if (!form.identifier.trim()) {
            toast.error(`Please enter ${form.identifierType === 'phone' ? 'phone number' : form.identifierType}`);
            return;
        }
        if (!form.password.trim()) {
            toast.error('Please enter a password');
            return;
        }

        const id = uuidv4();
        const newArray = [...PasswordArray, { ...form, id: id, userId: user.id }]
        setPasswordArray(newArray)

        await fetch(`${API_URL}/`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id, userId: user.id }) })

        await fetch(`${API_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...form, id, userId: user.id })
        })

        await getPassword();
        setform({ site: "", identifierType: "username", identifier: "", password: "" })
        toast.success('Saved successfully!');
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
        <div className="w-full max-w-4xl flex flex-col relative mx-auto px-3 sm:px-6 py-4">
            <div className="flex flex-col justify-center items-center py-2 my-2 sm:my-4">
                <h1 className="flex font-semibold font-serif text-2xl sm:text-3xl"><span className="text-[#007773]">&lt; Pass</span><span className="text-purple-950">End /&gt;</span></h1>
                <p className='font-sans font-semibold text-sm sm:text-lg text-purple-900/80 text-center'>Your Own Password Manager</p>
            </div>
            <div className="flex flex-col mb-4 gap-4 items-center w-full">
                <div className="w-full">
                    <input 
                        type="text" 
                        name="site" 
                        id="site" 
                        value={form.site} 
                        placeholder="Enter website URL (e.g., example.com)" 
                        className="w-full font-sans font-medium border-2 border-purple-300 focus:border-purple-600 py-2 sm:py-2.5 px-4 rounded-3xl bg-white/80 backdrop-blur-sm text-purple-950 placeholder-purple-400 focus:outline-none transition-all shadow-xs" 
                        onChange={handleChange} 
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 w-full">
                    <select 
                        name="identifierType" 
                        id="identifierType" 
                        value={form.identifierType} 
                        className="text-purple-950 font-sans font-medium border-2 border-purple-300 focus:border-purple-600 rounded-3xl py-2 sm:py-2.5 px-3.5 bg-white/80 backdrop-blur-sm focus:outline-none w-full cursor-pointer transition-all shadow-xs" 
                        onChange={handleChange}
                    >
                        <option value="username">Username</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone Number</option>
                    </select>
                    <input 
                        type={form.identifierType === 'phone' ? 'tel' : 'text'} 
                        name="identifier" 
                        id="identifier" 
                        value={form.identifier} 
                        placeholder={form.identifierType === 'phone' ? 'Enter Phone Number' : form.identifierType === 'email' ? 'Enter Email' : 'Enter Username'} 
                        className="text-purple-950 font-sans font-medium border-2 border-purple-300 focus:border-purple-600 rounded-3xl py-2 sm:py-2.5 px-4 bg-white/80 backdrop-blur-sm placeholder-purple-400 focus:outline-none w-full transition-all shadow-xs" 
                        onChange={handleChange} 
                    />
                    <div className='relative w-full sm:col-span-2 md:col-span-1'>
                        <input 
                            type={Passtype} 
                            name="password" 
                            id="password" 
                            value={form.password} 
                            placeholder="Enter Password" 
                            required 
                            className="font-sans font-medium border-2 border-purple-300 focus:border-purple-600 rounded-3xl py-2 sm:py-2.5 pl-4 pr-10 bg-white/80 backdrop-blur-sm text-purple-950 placeholder-purple-400 focus:outline-none w-full transition-all shadow-xs" 
                            onChange={handleChange} 
                        />
                        <i className={`bi ${showPass} text-xl text-purple-700 absolute top-1/2 -translate-y-1/2 right-3.5 cursor-pointer hover:text-purple-900 transition-colors`} onClick={showPassword} ></i>
                    </div>
                </div>
                <button type="submit" className="flex items-center justify-center cursor-pointer bg-purple-600 hover:bg-purple-700 active:scale-95 text-white duration-200 w-full sm:w-auto rounded-3xl px-8 py-2.5 gap-2 shadow-md hover:shadow-lg font-serif font-semibold text-base sm:text-lg my-1"
                    onClick={handleSubmit}
                > <lord-icon
                    src="https://cdn.lordicon.com/efxgwrkc.json"
                    trigger="hover"
                    style={{ width: "26px", height: "26px" }}>
                    </lord-icon>
                    <span>Save Password</span>
                </button>
                <div className='w-full pt-3 pb-3'>
                    <h2 className='font-bold font-sans text-xl sm:text-2xl pb-3 pt-0.5 text-center text-purple-950'>Your Saved Vault</h2>
                    <div className='min-h-[20vh] relative'>
                        {PasswordArray.length === 0 && <div className='font-sans font-semibold text-center text-purple-700/80 py-8 px-4 bg-white/60 rounded-2xl border border-purple-200 shadow-xs'>You haven't added any password yet !</div>}
                        {PasswordArray.length !== 0 && <Table PasswordArray={PasswordArray} setPasswordArray={setPasswordArray} setform={setform} form={form} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Manager