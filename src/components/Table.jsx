import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useRef, useState } from 'react';

const Table = (props) => {
    const API_URL = import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? "http://localhost:3001" : "https://passend.onrender.com");
    const { getToken } = useAuth();
    const [revealedPasswords, setRevealedPasswords] = useState(() => new Set());
    const [deletingId, setDeletingId] = useState('');
    const [favoriteId, setFavoriteId] = useState('');
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

    const toggleFavorite = async (entry) => {
        setFavoriteId(entry.id)
        try {
            const token = await getToken()
            if (!token) throw new Error('Authentication token unavailable')
            const response = await fetch(`${API_URL}/favorite`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    id: entry.id,
                    favorite: !entry.favorite
                })
            })
            if (!response.ok) throw new Error(await getErrorMessage(response, 'Unable to update favorite'))
            props.setPasswordArray(current => current.map(item => item.id === entry.id
                ? { ...item, favorite: !entry.favorite }
                : item))
            toast.success(entry.favorite ? 'Removed from favorites' : 'Added to favorites')
        } catch (error) {
            toast.error(error.message || 'Unable to update favorite')
        } finally {
            setFavoriteId('')
        }
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
        <div className="vault-table-wrap">
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
            <table className="table-auto w-full text-sm">
                <thead className="bg-[#7c3aed] text-white">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Site URL</th>
                        <th className="px-4 py-3 text-left font-semibold">{getIdentifierLabel()}</th>
                        <th className="px-4 py-3 text-left font-semibold">Password</th>
                        <th className="px-4 py-3 text-left font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white text-[#1b2140]">
                    {passwordData.map((e) => {
                        const isPasswordRevealed = revealedPasswords.has(e.id)
                        const password = e.password || ''
                        const maskedPassword = '*'.repeat(Math.max(8, Math.min(password.length, 16)))
                        return <tr key={e.id} className="border-b border-[#eeeaf3] transition hover:bg-[#faf8fe]">
                            <td className="px-4 py-3">
                                <div className='flex min-w-0 items-center gap-1'>
                                    <div className='table-site-content flex min-w-0 flex-col'>
                                        <a className="table-site-link font-semibold text-[#312e63] hover:text-[#7c3aed] hover:underline" href={e.site} target='_blank' rel='noopener noreferrer' title={e.site}>{e.site}</a>
                                        <span className='text-xs text-[#77748d]'>{e.category || 'General'}</span>
                                    </div>
                                    <button type='button' className='icon-button table-copy-button' aria-label='Copy website URL' title='Copy website URL' onClick={() => { copyText(e.site) }}><lord-icon
                                        style={{ "width": "20px", "height": "20px" }}
                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                        trigger="hover"
                                        colors="primary:#7c3aed,secondary:#c4b5fd">
                                    </lord-icon></button></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className='table-identifier-content flex min-w-0 flex-col gap-1'>
                                    <span className='text-xs text-[#77748d]'>{e.identifierType ? e.identifierType.charAt(0).toUpperCase() + e.identifierType.slice(1) : 'Username'}</span>
                                    <div className='flex min-w-0 items-center gap-1 font-semibold'>
                                        <span className="table-identifier-value" title={e.identifier || e.username}>{e.identifier || e.username}</span>
                                        <button type='button' className='icon-button table-copy-button' aria-label='Copy account identifier' title='Copy account identifier' onClick={() => { copyText(e.identifier || e.username) }}><lord-icon
                                            style={{ "width": "20px", "height": "20px" }}
                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                            trigger="hover"
                                            colors="primary:#7c3aed,secondary:#c4b5fd">
                                        </lord-icon></button>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className='table-password-content flex min-w-0 items-center gap-1'>
                                    <span className="table-password-value" title={isPasswordRevealed ? password : 'Password hidden'}>{isPasswordRevealed ? password : maskedPassword}</span>
                                    <button type='button' className='icon-button' aria-label={isPasswordRevealed ? 'Hide password' : 'Reveal password'} title={isPasswordRevealed ? 'Hide password' : 'Reveal password'} onClick={() => { togglePassword(e.id) }}>
                                        <i className={`bi ${isPasswordRevealed ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`} aria-hidden='true'></i>
                                    </button>
                                    <button type='button' className='icon-button table-copy-button' aria-label='Copy password' title='Copy password' onClick={() => { copyText(password) }}><lord-icon
                                        style={{ "width": "20px", "height": "20px" }}
                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                        trigger="hover"
                                        colors="primary:#7c3aed,secondary:#c4b5fd">
                                    </lord-icon></button></div>
                            </td>
                            <td className="px-4 py-3">
                                <div className='table-action-group'>
                                    <button type='button' disabled={favoriteId === e.id} className='icon-button disabled:opacity-50 disabled:cursor-not-allowed' aria-label={e.favorite ? 'Remove from favorites' : 'Add to favorites'} title={e.favorite ? 'Remove from favorites' : 'Add to favorites'} onClick={() => { toggleFavorite(e) }}>
                                        <i className={`bi ${e.favorite ? 'bi-star-fill text-yellow-500' : 'bi-star'}`} aria-hidden='true'></i>
                                    </button>
                                    <button type='button' className='icon-button' aria-label='Edit password' title='Edit password' onClick={() => { editPassword(e.id) }}><lord-icon
                                        src="https://cdn.lordicon.com/gwlusjdu.json"
                                        trigger="hover"
                                        colors="primary:#7c3aed,secondary:#c4b5fd"
                                        style={{ "width": "19px", "height": "19px" }}>
                                    </lord-icon></button>
                                    <button type='button' disabled={deletingId === e.id} className='icon-button disabled:opacity-50 disabled:cursor-not-allowed' aria-label='Delete password' title='Delete password' onClick={() => { deletePassword(e.id) }}><lord-icon
                                        src="https://cdn.lordicon.com/skkahier.json"
                                        trigger="hover"
                                        colors="primary:#dc2626,secondary:#fca5a5"
                                        style={{ "width": "19px", "height": "19px" }}>
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