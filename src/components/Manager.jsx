import Table from './Table'
import { useCallback, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { useAuth, useUser } from '@clerk/clerk-react';

const Manager = () => {
    const API_URL = import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? "http://localhost:3001" : "https://passend.onrender.com");
    const { user } = useUser();
    const { getToken } = useAuth();
    const [showPass, setshowPass] = useState("bi-eye-fill")
    const [form, setform] = useState({ site: "", identifierType: "username", identifier: "", password: "" })
    const [PasswordArray, setPasswordArray] = useState([])
    const [Passtype, setPasstype] = useState("password")
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [saveError, setSaveError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const getErrorMessage = async (response, fallback) => {
        try {
            const body = await response.json()
            return body.error || fallback
        } catch {
            return fallback
        }
    }

    const getPassword = useCallback(async () => {
        if (!user || !user.id) {
            setPasswordArray([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setLoadError('')
        try {
            const token = await getToken();
            if (!token) throw new Error('Authentication token unavailable')
            let res = await fetch(`${API_URL}/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error(await getErrorMessage(res, 'Failed to fetch passwords'));
            let passwords = await res.json()
            setPasswordArray(passwords)
        } catch (error) {
            const message = error.message || 'Unable to load your passwords'
            setLoadError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }, [API_URL, getToken, user])

    useEffect(() => {
        getPassword()
    }, [getPassword])

    const handleChange = (e) => {
        setSaveError('')
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
        if (isSaving) return;
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

        const id = form.id || uuidv4();

        try {
            setIsSaving(true);
            setSaveError('')
            const token = await getToken();
            if (!token) throw new Error('Authentication token unavailable');
            const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
            const saveResponse = await fetch(`${API_URL}/`, {
                method: form.id ? 'PATCH' : 'POST',
                headers,
                body: JSON.stringify({ ...form, id })
            })
            if (!saveResponse.ok) throw new Error(await getErrorMessage(saveResponse, 'Failed to save password'));

            await getPassword();
            setform({ site: "", identifierType: "username", identifier: "", password: "" })
            toast.success('Saved successfully!');
        } catch (error) {
            const message = error.message || 'Unable to save password'
            setSaveError(message)
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    }

    const normalizedSearch = searchTerm.trim().toLowerCase()
    const filteredPasswords = PasswordArray.filter(item => {
        if (!normalizedSearch) return true
        return [item.site, item.identifier, item.username, item.identifierType]
            .some(value => value && value.toLowerCase().includes(normalizedSearch))
    })

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
                <p className='font-sans font-semibold text-xl'>Your Own Password Manager</p>
            </div>
            <div className="flex flex-col mb-2 gap-6 items-center">
                <div className="md:my-2 w-full">
                    <input 
                        type="text" 
                        name="site" 
                        id="site" 
                        value={form.site} 
                        placeholder="Enter website URL (e.g., example.com)" 
                        className="w-full font-sans font-semibold border-2 border-purple-700 py-2 px-2 rounded-3xl opacity-50" 
                        onChange={handleChange} 
                        disabled={isSaving}
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-3 w-full">
                    <select 
                        name="identifierType" 
                        id="identifierType" 
                        value={form.identifierType} 
                        className="text-black font-sans font-semibold border-2 border-purple-700 rounded-3xl py-2 px-2 opacity-50 w-full md:w-1/3" 
                        onChange={handleChange}
                        disabled={isSaving}
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
                        className="text-black font-sans font-semibold border-2 border-purple-700 rounded-3xl py-2 px-2 opacity-50 w-full md:w-1/3" 
                        onChange={handleChange} 
                        disabled={isSaving}
                    />
                    <span className='relative w-full md:w-1/3'>
                        <input 
                            type={Passtype} 
                            name="password" 
                            id="password" 
                            value={form.password} 
                            placeholder="Enter Password" 
                            required 
                            className="font-sans font-semibold border-2 border-purple-700 rounded-3xl py-2 px-2 opacity-50 w-full" 
                            onChange={handleChange} 
                        />
                        <i className={`bi ${showPass} text-2xl absolute top-1 right-2 cursor-pointer`} onClick={showPassword} ></i>
                    </span>
                </div>
                <button type="submit" disabled={isSaving} className="flex items-center cursor-pointer bg-[#c68bfe] hover:bg-purple-400 disabled:opacity-60 disabled:cursor-not-allowed duration-150 w-fit rounded-3xl px-4 py-1.5 gap-1.5"
                    onClick={handleSubmit}
                > <lord-icon
                    src="https://cdn.lordicon.com/efxgwrkc.json"
                    trigger="hover"
                    style={{ width: "30px", height: "30px" }}>
                    </lord-icon>
                    <span className="font-serif font-semibold text-lg">{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                {saveError && <p className='text-red-700 text-sm font-semibold' role='alert'>{saveError}</p>}
                <div className='w-full pb-3'>
                    <h1 className='font-bold font-sans text-2xl pb-2 pt-0.5 text-center text-cyan-900'>Your Passwords</h1>
                    <input
                        type='search'
                        aria-label='Search saved passwords'
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder='Search your vault'
                        className='w-full mb-4 font-sans font-semibold border-2 border-purple-700 py-2 px-3 rounded-3xl opacity-70'
                        disabled={isLoading || Boolean(loadError)}
                    />
                    <div className='min-h-[30vh] relative overflow-y-hidden'>
                        {isLoading && <div className='font-sans font-semibold text-center'>Loading your vault...</div>}
                        {!isLoading && loadError && <div className='flex flex-col items-center gap-2 font-sans font-semibold text-center' role='alert'>
                            <span>{loadError}</span>
                            <button type='button' className='text-purple-800 underline cursor-pointer' onClick={getPassword}>Try again</button>
                        </div>}
                        {!isLoading && !loadError && PasswordArray.length === 0 && <div className='font-sans font-semibold text-center'>You haven't added any password yet !</div>}
                        {!isLoading && !loadError && PasswordArray.length !== 0 && filteredPasswords.length === 0 && <div className='font-sans font-semibold text-center'>No matching passwords found.</div>}
                        {!isLoading && !loadError && filteredPasswords.length !== 0 && <Table PasswordArray={filteredPasswords} setPasswordArray={setPasswordArray} setform={setform} form={form} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Manager