import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useRef, useState } from 'react';

const Table = (props) => {
    const API_URL = import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? "http://localhost:3001" : "https://passend.onrender.com");
    const { getToken } = useAuth();
    const [revealedPasswords, setRevealedPasswords] = useState(() => new Set());
    const [deletingId, setDeletingId] = useState('');
    const clipboardTimers = useRef(new Set());

    useEffect(() => {
        const timers = clipboardTimers.current
        return () => {
            timers.forEach(timer => clearTimeout(timer))
            timers.clear()
        }
    }, [])

    const getErrorMessage = async (response, fallback) => {
        try {
            const body = await response.json()
            return body.error || fallback
        } catch {
            return fallback
        }
    }

    const copyText = async (text) => {
        if (!navigator.clipboard?.writeText) {
            toast.error('Clipboard access is unavailable')
            return
        }

        try {
            await navigator.clipboard.writeText(text)
            toast.success('Copied to clipboard')

            const timer = setTimeout(async () => {
                clipboardTimers.current.delete(timer)
                try {
                    if (navigator.clipboard.readText) {
                        const currentText = await navigator.clipboard.readText()
                        if (currentText !== text) return
                    }
                    await navigator.clipboard.writeText('')
                } catch {
                    // Clipboard permissions can prevent automatic clearing.
                }
            }, 30000)
            clipboardTimers.current.add(timer)
        } catch {
            toast.error('Unable to copy')
        }
    }

    const togglePassword = (id) => {
        setRevealedPasswords(current => {
            const next = new Set(current)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }
    let passwordData = props.PasswordArray;

    const getIdentifierLabel = () => {
        // Check if any entry has identifierType to determine column header
        const hasNewFormat = passwordData.some(item => item.identifierType);
        if (hasNewFormat) {
            return "Account Details";
        }
        return "Username";
    }

    const deletePassword = async (m) => {
        let c = confirm("Do you really want to delete password !")
        if (c) {
            setDeletingId(m)
            try {
                const token = await getToken();
                const response = await fetch(`${API_URL}/`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ id: m })
                })
                if (!response.ok) throw new Error(await getErrorMessage(response, 'Failed to delete password'));

                props.setPasswordArray(current => current.filter(item => item.id !== m))
                toast.success('Password deleted !');
            } catch (error) {
                toast.error(error.message || 'Unable to delete password');
            } finally {
                setDeletingId('')
            }
        }
    }

    const editPassword = (id) => {
        console.log("Editing password with id ", id)
        let editarr = passwordData.filter(i => i.id === id)[0]
        props.setform({ ...editarr, id: id })
    }

    return (
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={3001}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <table className="table-auto w-full rounded-lg overflow-hidden">
                <thead className="bg-purple-400 text-white">
                    <tr>
                        <th className="px-4 py-2.5 text-left text-xl">Site URL</th>
                        <th className="px-4 py-2.5 text-left text-xl">{getIdentifierLabel()}</th>
                        <th className="px-4 py-2.5 text-left text-xl">Password</th>
                        <th className="px-4 py-2.5 text-left text-xl">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-[#ebdefa] text-purple-900">
                    {passwordData.map((e) => {
                        const isPasswordRevealed = revealedPasswords.has(e.id)
                        const password = e.password || ''
                        const maskedPassword = '*'.repeat(Math.max(8, Math.min(password.length, 16)))
                        return <tr key={e.id} className="font-semibold font-sans border-b border-white hover:bg-purple-200 transition">
                            <td className="px-4 py-2">
                                <div className='flex items-center'>
                                    <a href={e.site} target='_blank' rel='noopener noreferrer'>{e.site}</a>
                                    <button type='button' className='cursor-pointer' aria-label='Copy website URL' title='Copy website URL' onClick={() => { copyText(e.site) }}><lord-icon
                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "6px" }}
                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                        trigger="hover" >
                                    </lord-icon></button></div>
                            </td>
                            <td className="px-4 py-2">
                                <div className='flex items-center flex-col gap-1'>
                                    <span className='text-xs text-gray-600'>{e.identifierType ? e.identifierType.charAt(0).toUpperCase() + e.identifierType.slice(1) : 'Username'}</span>
                                    <div className='flex items-center'>
                                        {e.identifier || e.username}
                                        <button type='button' className='cursor-pointer' aria-label='Copy account identifier' title='Copy account identifier' onClick={() => { copyText(e.identifier || e.username) }}><lord-icon
                                            style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "6px" }}
                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                            trigger="hover" >
                                        </lord-icon></button>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-2">
                                <div className='flex items-center'>
                                    <span>{isPasswordRevealed ? password : maskedPassword}</span>
                                    <button type='button' className='cursor-pointer' aria-label={isPasswordRevealed ? 'Hide password' : 'Reveal password'} title={isPasswordRevealed ? 'Hide password' : 'Reveal password'} onClick={() => { togglePassword(e.id) }}>
                                        <i className={`bi ${isPasswordRevealed ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} aria-hidden='true'></i>
                                    </button>
                                    <button type='button' className='cursor-pointer' aria-label='Copy password' title='Copy password' onClick={() => { copyText(password) }}><lord-icon
                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "6px" }}
                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                        trigger="hover" >
                                    </lord-icon></button></div>
                            </td>
                            <td className="px-4 py-2">
                                <div className='flex items-center gap-3'>
                                    <button type='button' className='cursor-pointer' aria-label='Edit password' title='Edit password' onClick={() => { editPassword(e.id) }}><lord-icon
                                        src="https://cdn.lordicon.com/gwlusjdu.json"
                                        trigger="hover"
                                        style={{ "width": "23px", "height": "23px" }}>
                                    </lord-icon></button>
                                    <button type='button' disabled={deletingId === e.id} className='cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' aria-label='Delete password' title='Delete password' onClick={() => { deletePassword(e.id) }}><lord-icon
                                        src="https://cdn.lordicon.com/skkahier.json"
                                        trigger="hover"
                                        style={{ "width": "23px", "height": "23px" }}>
                                    </lord-icon></button>
                                </div>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table >
        </div >
    )
}

export default Table