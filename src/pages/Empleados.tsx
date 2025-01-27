import React, { useEffect, useState } from 'react';

const Empleados: React.FC = () => {
    const [usuarios, setUsuarios] = useState([]);
    const url = import.meta.env.VITE_API_URL_GET_ALL_EMPLEADOS;

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
        <div className="p-4 space-y-4">
            {/* Tarjeta resumen */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Total Empleados</h3>
                        <span className="text-gray-500">👥</span>
                    </div>
                    <div className="text-2xl font-bold">{usuarios.length}</div>
                    <p className="text-xs text-gray-500">Número total de empleados registrados</p>
                </div>
            </div>

            {/* Tabla de empleados */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Apellido</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Teléfono</th>
                            <th scope="col" className="px-6 py-3">Fecha de Contratación</th>
                            <th scope="col" className="px-6 py-3">Departamento</th>
                            <th scope="col" className="px-6 py-3">Cargo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((empleado, index) => (
                            <tr
                                key={index}
                                className="odd:bg-white even:bg-gray-50 border-b text-gray-900"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium whitespace-nowrap"
                                >
                                    {empleado.nombre}
                                </th>
                                <td className="px-6 py-4">{empleado.apellido}</td>
                                <td className="px-6 py-4">{empleado.email}</td>
                                <td className="px-6 py-4">{empleado.telefono}</td>
                                <td className="px-6 py-4">{empleado.fechaContratacion}</td>
                                <td className="px-6 py-4">
                                    {empleado.departamento?.nombre || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    {empleado.cargo?.nombre || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {usuarios.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                        No hay empleados registrados.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Empleados;
