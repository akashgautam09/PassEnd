const table = (props) => {
    let passwordData = props.PasswordArray;
    return (
        <div className="">
            <table className="table-auto w-full rounded-lg overflow-hidden">
                <thead className="bg-purple-400 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left text-xl">Site URL</th>
                        <th className="px-4 py-3 text-left text-xl">Username</th>
                        <th className="px-4 py-3 text-left text-xl">Password</th>
                    </tr>
                </thead>
                <tbody className="bg-[#ebdefa] text-purple-900">
                    {passwordData.map((e,i) => {
                        return <tr key={i} className="font-semibold font-sans border-b border-white hover:bg-purple-200 cursor-pointer transition">
                            <td className="px-4 py-3"> <a href={e.site} target='_blank' >{e.site}</a></td>
                            <td className="px-4 py-3">{e.username}</td>
                            <td className="px-4 py-3">{e.password}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default table