import React, { useEffect, useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';

const Perfiles: React.FC = () => {
    interface Usuario {
        id: number;
        username: string;
        email: string;
        rol: string;
    }

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const url = import.meta.env.VITE_API_URL_GET_All_USERS;

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
            {/* Tarjeta resumen */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Total Usuarios</h3>
                        <FaUserAlt className="text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{usuarios.length}</div>
                    <p className="text-xs text-gray-500">Usuarios registrados en el sistema</p>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Lista de Usuarios</h2>
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length > 0 ? (
                            usuarios.map((user, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white even:bg-gray-50 border-b hover:bg-blue-50 transition"
                                >
                                    <td className="px-6 py-4">{user.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            user.rol === 'admin'
                                                ? 'bg-blue-100 text-blue-800'
                                                : user.rol === 'evaluador'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {user.rol || 'Usuario'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center text-gray-500 py-6">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Perfiles;
