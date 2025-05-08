import React, { useEffect, useState } from 'react';
import { FaFilter, FaSearch, FaRedo } from 'react-icons/fa';

const Empleados: React.FC = () => {
    interface Empleado {
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        fechaContratacion: string;
        departamento?: { nombre: string };
        cargo?: { nombre: string };
    }

    const [usuarios, setUsuarios] = useState<Empleado[]>([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [filtroCargo, setFiltroCargo] = useState('');

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

    const empleadosFiltrados = usuarios.filter((empleado) => {
        const nombreCompleto = `${empleado.nombre} ${empleado.apellido}`.toLowerCase();
        const departamento = empleado.departamento?.nombre?.toLowerCase() || '';
        const cargo = empleado.cargo?.nombre?.toLowerCase() || '';

        return (
            nombreCompleto.includes(filtroNombre.toLowerCase()) &&
            (filtroDepartamento ? departamento === filtroDepartamento.toLowerCase() : true) &&
            (filtroCargo ? cargo === filtroCargo.toLowerCase() : true)
        );
    });

    const departamentos = Array.from(new Set(usuarios.map((empleado: any) => empleado.departamento?.nombre))).filter(Boolean);
    const cargos = Array.from(new Set(usuarios.map((empleado: any) => empleado.cargo?.nombre))).filter(Boolean);

    const verMasInfo = (empleado: any) => {
        alert(
            `Información del empleado:\n\n` +
            `Nombre: ${empleado.nombre} ${empleado.apellido}\n` +
            `Email: ${empleado.email}\n` +
            `Teléfono: ${empleado.telefono}\n` +
            `Fecha de Contratación: ${empleado.fechaContratacion}\n` +
            `Departamento: ${empleado.departamento?.nombre || 'N/A'}\n` +
            `Cargo: ${empleado.cargo?.nombre || 'N/A'}`
        );
    };

    const limpiarFiltros = () => {
        setFiltroNombre('');
        setFiltroDepartamento('');
        setFiltroCargo('');
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            {/* Tarjeta resumen */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">Total Empleados</h3>
                        <span className="text-blue-500 text-xl">👥</span>
                    </div>
                    <div className="text-4xl font-bold text-blue-700">{usuarios.length}</div>
                    <p className="text-sm text-gray-500">Empleados registrados actualmente</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-wrap gap-4 justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <FaSearch className="text-gray-500" />
                    <input
                        type="text"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                        placeholder="Buscar por nombre o apellido..."
                        className="border rounded-lg px-4 py-2 w-full sm:w-64 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <FaFilter className="text-gray-500" />
                    <select
                        value={filtroDepartamento}
                        onChange={(e) => setFiltroDepartamento(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full sm:w-64 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccionar Departamento</option>
                        {departamentos.map((departamento, index) => (
                            <option key={index} value={departamento}>{departamento}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <FaFilter className="text-gray-500" />
                    <select
                        value={filtroCargo}
                        onChange={(e) => setFiltroCargo(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full sm:w-64 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccionar Cargo</option>
                        {cargos.map((cargo, index) => (
                            <option key={index} value={cargo}>{cargo}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={limpiarFiltros}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm"
                >
                    <FaRedo /> Limpiar
                </button>
            </div>

            {/* Tabla de empleados */}
            <div className="relative overflow-x-auto shadow-lg sm:rounded-xl bg-white p-6">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Apellido</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Teléfono</th>
                            <th className="px-6 py-3">Fecha de Contratación</th>
                            <th className="px-6 py-3">Departamento</th>
                            <th className="px-6 py-3">Cargo</th>
                            <th className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleadosFiltrados.length > 0 ? (
                            empleadosFiltrados.map((empleado, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white even:bg-gray-50 border-b text-gray-900 hover:bg-blue-50 transition-colors duration-200"
                                >
                                    <th className="px-6 py-4 font-medium whitespace-nowrap">{empleado.nombre}</th>
                                    <td className="px-6 py-4">{empleado.apellido}</td>
                                    <td className="px-6 py-4">{empleado.email}</td>
                                    <td className="px-6 py-4">{empleado.telefono}</td>
                                    <td className="px-6 py-4">{empleado.fechaContratacion}</td>
                                    <td className="px-6 py-4">{empleado.departamento?.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4">{empleado.cargo?.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => verMasInfo(empleado)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-xs"
                                        >
                                            Ver más
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center text-gray-500 py-4">
                                    No se encontraron empleados con los filtros seleccionados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Empleados;
