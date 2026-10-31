import Table from './Table'
import { useCallback, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { useAuth, useUser } from '@clerk/clerk-react';

const emptyForm = { site: "", identifierType: "username", identifier: "", password: "", category: "General", favorite: false }

const Manager = () => {
    const API_URL = import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? "http://localhost:3001" : "https://passend.onrender.com");
    const { user } = useUser();
    const { getToken } = useAuth();
    const [showPass, setshowPass] = useState("bi-eye-fill")
    const [form, setform] = useState(emptyForm)
    const [PasswordArray, setPasswordArray] = useState([])
    const [Passtype, setPasstype] = useState("password")
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [saveError, setSaveError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [sortMode, setSortMode] = useState('recent')

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
            const message = error instanceof TypeError
                ? 'Unable to reach the password service.'
                : error.message || 'Unable to load your passwords'
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
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setform({ ...form, [e.target.name]: value })
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
            setform(emptyForm)
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
        const category = item.category || 'General'
        if (!normalizedSearch) return true
        return [item.site, item.identifier, item.username, item.identifierType, category]
            .some(value => value && value.toLowerCase().includes(normalizedSearch))
    }).filter(item => categoryFilter === 'all' || (item.category || 'General') === categoryFilter)

    const sortedPasswords = [...filteredPasswords].sort((first, second) => {
        if (sortMode === 'favorite') return Number(second.favorite) - Number(first.favorite)
        if (sortMode === 'site') return first.site.localeCompare(second.site)
        if (sortMode === 'category') return (first.category || 'General').localeCompare(second.category || 'General')
        const firstDate = new Date(first.updatedAt || first.createdAt || 0).getTime()
        const secondDate = new Date(second.updatedAt || second.createdAt || 0).getTime()
        return secondDate - firstDate
    })

    const categories = [...new Set(PasswordArray.map(item => item.category || 'General'))].sort()

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
        <main className="w-full max-w-5xl flex flex-col relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-center items-center py-8 sm:py-10">
                <h1 className="brand-mark text-3xl sm:text-4xl font-bold"><span>&lt; Pass</span>End /&gt;</h1>
                <p className='mt-2 text-base sm:text-lg font-semibold text-[#4c4a70]'>Your Own Password Manager</p>
            </div>
            <div className="flex flex-col mb-8 gap-5 items-center">
                <section className="panel w-full p-5 sm:p-7" aria-labelledby="credential-form-heading">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-8 w-1 rounded-full bg-[#7c3aed]" aria-hidden="true"></div>
                        <h2 id="credential-form-heading" className="text-xl font-bold text-[#1b2140]">Add a password</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="field-label" htmlFor="site">Website URL</label>
                            <input
                                type="text"
                                name="site"
                                id="site"
                                value={form.site}
                                placeholder="https://example.com or platform name"
                                className="form-control"
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <label className="field-label" htmlFor="identifierType">Account type</label>
                            <select
                                name="identifierType"
                                id="identifierType"
                                value={form.identifierType}
                                className="form-select"
                                onChange={handleChange}
                                disabled={isSaving}
                            >
                                <option value="username">Username</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone Number</option>
                            </select>
                        </div>
                        <div>
                            <label className="field-label" htmlFor="identifier">Username, email or phone</label>
                            <input
                                type={form.identifierType === 'phone' ? 'tel' : 'text'}
                                name="identifier"
                                id="identifier"
                                value={form.identifier}
                                placeholder={form.identifierType === 'phone' ? 'Enter Phone Number' : form.identifierType === 'email' ? 'Enter Email' : 'Enter Username'}
                                className="form-control"
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <label className="field-label" htmlFor="category">Category</label>
                            <select
                                name="category"
                                id="category"
                                value={form.category || 'General'}
                                className="form-select"
                                onChange={handleChange}
                                disabled={isSaving}
                            >
                                <option value="General">General</option>
                                <option value="Work">Work</option>
                                <option value="Finance">Finance</option>
                                <option value="Social">Social</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="field-label" htmlFor="password">Password</label>
                            <span className='relative w-full md:w-1/3'>
                                <input
                                    type={Passtype}
                                    name="password"
                                    id="password"
                                    value={form.password}
                                    placeholder="Enter Password"
                                    required
                                    className="form-control pr-11"
                                    onChange={handleChange}
                                />
                                <button type="button" className="icon-button absolute right-1 -bottom-2" style={{ width: "34px", height: "34px" }} onClick={showPassword} aria-label={Passtype === 'password' ? 'Show password' : 'Hide password'} title={Passtype === 'password' ? 'Show password' : 'Hide password'}><i className={`bi ${showPass}`} aria-hidden="true" style={{ fontSize: "22px" }}></i></button>
                            </span>
                        </div>
                    </div>
                    <label className='mt-5 flex items-center gap-2 text-sm font-semibold text-[#4c4a70] cursor-pointer'>
                        <input type='checkbox' name='favorite' checked={Boolean(form.favorite)} onChange={handleChange} disabled={isSaving} />
                        Favorite credential
                    </label>
                    <button type="submit" disabled={isSaving} className="mt-5 flex items-center cursor-pointer bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-60 disabled:cursor-not-allowed duration-150 w-fit rounded-lg px-5 py-2.5 gap-2 shadow-sm hover:shadow-md"
                        onClick={handleSubmit}
                    > <lord-icon
                        src="https://cdn.lordicon.com/efxgwrkc.json"
                        trigger="hover"
                        colors="primary:#ffffff,secondary:#ddd6fe"
                        style={{ width: "30px", height: "30px" }}>
                        </lord-icon>
                        <span className="font-semibold">{isSaving ? 'Saving...' : 'Save password'}</span>
                    </button>
                    {saveError && <p className='text-red-700 text-sm font-semibold' role='alert'>{saveError}</p>}
                </section>
                <section className='panel w-full p-5 sm:p-7' aria-labelledby="vault-heading">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-5">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">Secure vault</p>
                            <h2 id="vault-heading" className='font-bold text-2xl text-[#1b2140]'>Your passwords</h2>
                        </div>
                        <p className="text-sm text-[#77748d]">{sortedPasswords.length} {sortedPasswords.length === 1 ? 'entry' : 'entries'}</p>
                    </div>
                    <input
                        type='search'
                        aria-label='Search saved passwords'
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder='Search your vault'
                        className='vault-control mb-3'
                        disabled={isLoading || Boolean(loadError)}
                    />
                    <div className='flex flex-col sm:flex-row gap-3 mb-5'>
                        <select
                            aria-label='Filter by category'
                            value={categoryFilter}
                            onChange={(event) => setCategoryFilter(event.target.value)}
                            className='vault-control'
                            disabled={isLoading || Boolean(loadError)}
                        >
                            <option value='all'>All categories</option>
                            {categories.map(category => <option key={category} value={category}>{category}</option>)}
                        </select>
                        <select
                            aria-label='Sort vault entries'
                            value={sortMode}
                            onChange={(event) => setSortMode(event.target.value)}
                            className='vault-control'
                            disabled={isLoading || Boolean(loadError)}
                        >
                            <option value='recent'>Recently updated</option>
                            <option value='favorite'>Favorites first</option>
                            <option value='site'>Website A-Z</option>
                            <option value='category'>Category A-Z</option>
                        </select>
                    </div>
                    <div className='min-h-[30vh] relative'>
                        {isLoading && <div className='font-sans font-semibold text-center'>Loading your vault...</div>}
                        {!isLoading && loadError && <div className='flex flex-col items-center gap-2 font-sans font-semibold text-center' role='alert'>
                            <span>{loadError}</span>
                            <button type='button' className='text-purple-800 underline cursor-pointer' onClick={getPassword}>Try again</button>
                        </div>}
                        {!isLoading && !loadError && PasswordArray.length === 0 && <div className='font-sans font-semibold text-center'>You haven't added any password yet !</div>}
                        {!isLoading && !loadError && PasswordArray.length !== 0 && filteredPasswords.length === 0 && <div className='font-sans font-semibold text-center'>No matching passwords found.</div>}
                        {!isLoading && !loadError && sortedPasswords.length !== 0 && <Table PasswordArray={sortedPasswords} setPasswordArray={setPasswordArray} setform={setform} form={form} />}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Manager