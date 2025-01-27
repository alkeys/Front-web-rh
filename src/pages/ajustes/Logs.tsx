import React, { useEffect } from 'react';


const Logs: React.FC = () => {
    const [logs, setLogs] = React.useState([]);
    const apiurlLogs=import.meta.env.VITE_API_URL_LOGS;

    useEffect(() => {
        fetch(apiurlLogs)
        .then(repose => repose.json())
        .then(data => setLogs(data));
    }, []);


    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                { logs.map(log => (
                    <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{log.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{log.user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{log.user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Logs;