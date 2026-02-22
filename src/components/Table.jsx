const table = () => {
    return (
        <div>
            <table className="table-auto w-full border-collapse rounded-lg overflow-hidden">
                <thead className="bg-purple-400 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left text-xl">Site URL</th>
                        <th className="px-4 py-3 text-left text-xl">Username</th>
                        <th className="px-4 py-3 text-left text-xl">Password</th>
                    </tr>
                </thead>
                <tbody className="bg-[#ebdefa] text-purple-900">
                    <tr className="border-b border-white hover:bg-purple-200 cursor-pointer transition">
                        <td className="px-4 py-3">The Sliding Mr. Bones</td>
                        <td className="px-4 py-3">Malcolm Lockyer</td>
                        <td className="px-4 py-3">1961</td>
                    </tr>
                    <tr className="border-b border-white hover:bg-purple-200 cursor-pointer transition">
                        <td className="px-4 py-3">Witchy Woman</td>
                        <td className="px-4 py-3">The Eagles</td>
                        <td className="px-4 py-3">1972</td>
                    </tr>
                    <tr className="hover:bg-purple-200 cursor-pointer transition">
                        <td className="px-4 py-3">Shining Star</td>
                        <td className="px-4 py-3">Earth, Wind, and Fire</td>
                        <td className="px-4 py-3">1975</td>
                    </tr>
                </tbody>
            </table>

        </div>
    )
}

export default table