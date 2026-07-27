import { ToastContainer, toast } from 'react-toastify';
import { useUser } from '@clerk/clerk-react';

const table = (props) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const { user } = useUser();
    let passwordData = props.PasswordArray;

    const copytext = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!", { autoClose: 1500 });
    }

    const getIdentifierLabel = () => {
        const hasNewFormat = passwordData.some(item => item.identifierType);
        if (hasNewFormat) {
            return "Account Details";
        }
        return "Username";
    }

    const deletePassword = async (m) => {
        let c = confirm("Do you really want to delete password !")
        if (c) {
            props.setPasswordArray(passwordData.filter(item => item.id !== m))
            await fetch(`${API_URL}/`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: m, userId: user?.id }) })

            toast.success('Password deleted !');
        }
    }

    const editPassword = (id) => {
        let editarr = passwordData.filter(i => i.id === id)[0]
        props.setform({ ...editarr, id: id })
        props.setPasswordArray(passwordData.filter(item => item.id !== id))
    }

    return (
        <div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Mobile Card List View (< 640px) */}
            <div className="flex flex-col gap-3 sm:hidden">
                {passwordData.map((e, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-purple-200 shadow-xs flex flex-col gap-2.5">
                        <div className="flex justify-between items-start gap-2 border-b border-purple-100 pb-2">
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">Website</span>
                                <div className="flex items-center gap-1">
                                    <a href={e.site?.startsWith('http') ? e.site : 'https://' + e.site} target='_blank' rel="noreferrer" className="font-semibold text-purple-950 hover:underline truncate max-w-[180px]">
                                        {e.site}
                                    </a>
                                    <span className="cursor-pointer p-0.5 text-purple-700 hover:text-purple-900" onClick={() => copytext(e.site)}>
                                        <lord-icon style={{ width: "18px", height: "18px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="cursor-pointer p-1 text-purple-700 hover:text-purple-900" onClick={() => editPassword(e.id)} title="Edit">
                                    <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ width: "22px", height: "22px" }}></lord-icon>
                                </button>
                                <button className="cursor-pointer p-1 text-red-600 hover:text-red-800" onClick={() => deletePassword(e.id)} title="Delete">
                                    <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ width: "22px", height: "22px" }}></lord-icon>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-0.5">
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                    {e.identifierType ? e.identifierType : 'Username'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-purple-950 text-xs sm:text-sm truncate max-w-[120px]">{e.identifier || e.username}</span>
                                    <span className="cursor-pointer p-0.5" onClick={() => copytext(e.identifier || e.username)}>
                                        <lord-icon style={{ width: "16px", height: "16px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Password</span>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-purple-950 text-xs sm:text-sm truncate max-w-[120px]">{e.password}</span>
                                    <span className="cursor-pointer p-0.5" onClick={() => copytext(e.password)}>
                                        <lord-icon style={{ width: "16px", height: "16px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop / Tablet Table View (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-purple-200 shadow-xs bg-white/80 backdrop-blur-md">
                <table className="table-auto w-full text-left">
                    <thead className="bg-purple-500 text-white text-base">
                        <tr>
                            <th className="px-4 py-3 font-serif font-semibold">Site URL</th>
                            <th className="px-4 py-3 font-serif font-semibold">{getIdentifierLabel()}</th>
                            <th className="px-4 py-3 font-serif font-semibold">Password</th>
                            <th className="px-4 py-3 font-serif font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100 text-purple-950">
                        {passwordData.map((e, i) => (
                            <tr key={i} className="font-medium text-sm sm:text-base hover:bg-purple-100/60 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 max-w-[180px] md:max-w-[260px]">
                                        <a href={e.site?.startsWith('http') ? e.site : 'https://' + e.site} target='_blank' rel="noreferrer" className="truncate hover:underline text-purple-900 font-semibold" title={e.site}>
                                            {e.site}
                                        </a>
                                        <span className="cursor-pointer shrink-0" onClick={() => copytext(e.site)} title="Copy URL">
                                            <lord-icon style={{ width: "20px", height: "20px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-purple-700/80 font-semibold uppercase">{e.identifierType ? e.identifierType : 'Username'}</span>
                                        <div className="flex items-center gap-1.5 max-w-[160px] md:max-w-[220px]">
                                            <span className="truncate" title={e.identifier || e.username}>{e.identifier || e.username}</span>
                                            <span className="cursor-pointer shrink-0" onClick={() => copytext(e.identifier || e.username)} title="Copy Account">
                                                <lord-icon style={{ width: "20px", height: "20px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 max-w-[140px] md:max-w-[180px]">
                                        <span className="truncate" title={e.password}>{e.password}</span>
                                        <span className="cursor-pointer shrink-0" onClick={() => copytext(e.password)} title="Copy Password">
                                            <lord-icon style={{ width: "20px", height: "20px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="cursor-pointer hover:scale-110 transition-transform" onClick={() => editPassword(e.id)} title="Edit">
                                            <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ width: "22px", height: "22px" }}></lord-icon>
                                        </span>
                                        <span className="cursor-pointer hover:scale-110 transition-transform" onClick={() => deletePassword(e.id)} title="Delete">
                                            <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ width: "22px", height: "22px" }}></lord-icon>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default table