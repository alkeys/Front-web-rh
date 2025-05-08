import React, { useEffect, useState } from 'react';
import { FaHistory } from 'react-icons/fa';

const Logs: React.FC = () => {
    const [logs, setLogs] = useState([]);
    const apiurlLogs = import.meta.env.VITE_API_URL_LOGS;

    useEffect(() => {
        fetch(apiurlLogs)
            .then(response => response.json())
            .then(data => setLogs(data))
            .catch(err => console.error('Error al cargar los logs:', err));
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaHistory className="text-blue-500" /> Registros de Actividad
                    </h1>
                    <p className="text-sm text-gray-500">{logs.length} movimientos registrados</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {logs.length > 0 ? (
                                logs.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-2">{log.id}</td>
                                        <td className="px-4 py-2 font-medium text-gray-800">{log.user.username}</td>
                                        <td className="px-4 py-2 text-gray-600">{log.user.email}</td>
                                        <td className="px-4 py-2 text-gray-700">{log.action}</td>
                                        <td className="px-4 py-2 text-gray-500">{new Date(log.timestamp).toLocaleString('es-SV')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">No se encontraron registros.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Logs;
