import { ToastContainer, toast } from 'react-toastify';

const table = (props) => {
    let passwordData = props.PasswordArray;

    const copytext = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied successfully!', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const deletePassword = (m) => {
        props.setPasswordArray(passwordData.filter(item => item.id!=m))
        localStorage.setItem("password", JSON.stringify(passwordData.filter(item => item.id!=m)))
    }
    const editPassword = (m) => {
        props.setform(passwordData.filter(e=>e.id===m)[1])
        props.setPasswordArray(passwordData.filter(item => item.id!==m))
        console.log(m)
    }

    return (
        <div className="">
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
            <table className="table-auto w-full rounded-lg overflow-hidden">
                <thead className="bg-purple-400 text-white">
                    <tr>
                        <th className="px-4 py-2.5 text-left text-xl">Site URL</th>
                        <th className="px-4 py-2.5 text-left text-xl">Username</th>
                        <th className="px-4 py-2.5 text-left text-xl">Password</th>
                        <th className="px-4 py-2.5 text-left text-xl">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-[#ebdefa] text-purple-900">
                    {passwordData.map((e, i) => {
                        return <tr key={i} className="font-semibold font-sans border-b border-white hover:bg-purple-200 transition">
                            <td className="px-4 py-2">
                                <div className='flex items-center'>
                                    <a href={e.site} target='_blank' >{e.site}</a>
                                    <span className='cursor-pointer' onClick={() => { copytext(e.site) }}><lord-icon
                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "6px" }}
                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                        trigger="hover" >
                                    </lord-icon></span></div>
                            </td>
                            <td className="px-4 py-2">
                                <div className='flex items-center'>
                                    {e.username}
                                    <span className='cursor-pointer' onClick={() => { copytext(e.username) }}><lord-icon
                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "6px" }}
                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                        trigger="hover" >
                                    </lord-icon></span></div>
                            </td>
                            <td className="px-4 py-2">
                                <div className='flex items-center'>
                                    {e.password}
                                    <span className='cursor-pointer' onClick={() => { copytext(e.password) }}><lord-icon
                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "6px" }}
                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                        trigger="hover" >
                                    </lord-icon></span></div>
                            </td>
                            <td className="px-4 py-2">
                                <div className='flex items-center gap-3'>
                                    <span className='cursor-pointer' onClick={() => { editPassword(e.id) }}><lord-icon
                                        src="https://cdn.lordicon.com/gwlusjdu.json"
                                        trigger="hover"
                                        style={{ "width": "23px", "height": "23px" }}>
                                    </lord-icon></span>
                                    <span className='cursor-pointer' onClick={() => { deletePassword(e.id) }}><lord-icon
                                        src="https://cdn.lordicon.com/skkahier.json"
                                        trigger="hover"
                                        style={{ "width": "23px", "height": "23px" }}>
                                    </lord-icon></span>
                                </div>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table >
        </div >
    )
}

export default table