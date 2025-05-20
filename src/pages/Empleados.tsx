import React, { useEffect, useState } from 'react';
import { FaFilter, FaSearch, FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Empleados: React.FC = () => {
    interface Empleado {
        id: number;
        idDepartamento: number;
        idCargo: number;
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        fechaContratacion: string;
        departamento?: { nombre: string };
        cargo?: { nombre: string };
    }

    const [usuarios, setUsuarios] = useState<Empleado[]>([]);
    const [totalEmpleados, setTotalEmpleados] = useState(0);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [filtroCargo, setFiltroCargo] = useState('');
    const [pagina, setPagina] = useState(0);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
    const cantidad = 10;
    const navigate = useNavigate();

    const urlBase = import.meta.env.VITE_API_URL_GET_EMPLEADO_PAGINATED;
    const urlTotal = import.meta.env.VITE_API_URL_COUNT_EMPLEADOS;
    const urlDelete = import.meta.env.VITE_API_URL_DELETE_EMPLEADO_BY_ID;

    useEffect(() => {
        cargarDatos(pagina, cantidad);
        cargarTotalEmpleados();
    }, [pagina]);

    const cargarDatos = async (pagina: number, cantidad: number) => {
        try {
            const url = urlBase.replace('{PAGINA}', pagina.toString()).replace('{cantidad}', cantidad.toString());
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const cargarTotalEmpleados = async () => {
        try {
            const response = await fetch(urlTotal);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const total = await response.json();
            setTotalEmpleados(total);
        } catch (error) {
            console.error('Error fetching total count:', error);
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

    const departamentos = Array.from(new Set(usuarios.map((e) => e.departamento?.nombre))).filter(Boolean);
    const cargos = Array.from(new Set(usuarios.map((e) => e.cargo?.nombre))).filter(Boolean);

    const verMasInfo = (empleado: Empleado) => {
        setEmpleadoSeleccionado(empleado);
    };

    const cerrarInfo = () => {
        setEmpleadoSeleccionado(null);
    };

    const BorrarEmpleado = (empleado: Empleado) => {
        if (!window.confirm(`¿Seguro que deseas borrar a ${empleado.nombre} ${empleado.apellido}?`)) return;
        const url = urlDelete.replace('{id}', empleado.id.toString());
        fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                cargarDatos(pagina, cantidad);
                cargarTotalEmpleados();
            })
            .catch((error) => {
                console.error('Error al borrar el empleado:', error);
            });
    };

    const limpiarFiltros = () => {
        setFiltroNombre('');
        setFiltroDepartamento('');
        setFiltroCargo('');
    };

    const siguientePagina = () => {
        if ((pagina + 1) * cantidad < totalEmpleados) setPagina(pagina + 1);
    };

    const paginaAnterior = () => {
        if (pagina > 0) setPagina(pagina - 1);
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">Total Empleados</h3>
                        <span className="text-blue-500 text-xl">👥</span>
                    </div>
                    <div className="text-4xl font-bold text-blue-700">{totalEmpleados}</div>
                    <p className="text-sm text-gray-500">Página {pagina + 1} | Mostrando {cantidad} empleados</p>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={paginaAnterior} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Anterior</button>
                <button onClick={siguientePagina} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Siguiente</button>
            </div>

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
                        {departamentos.map((d, i) => (
                            <option key={i} value={d}>{d}</option>
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
                        {cargos.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
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
                            empleadosFiltrados.map((e, i) => (
                                <tr key={i} className="odd:bg-white even:bg-gray-50 border-b text-gray-900 hover:bg-blue-50 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{e.nombre}</td>
                                    <td className="px-6 py-4">{e.apellido}</td>
                                    <td className="px-6 py-4">{e.email}</td>
                                    <td className="px-6 py-4">{e.telefono}</td>
                                    <td className="px-6 py-4">{e.fechaContratacion}</td>
                                    <td className="px-6 py-4">{e.departamento?.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4">{e.cargo?.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => verMasInfo(e)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-xs">Ver más</button>
                                        <button onClick={() => BorrarEmpleado(e)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-xs">Borrar</button>
                                       <button onClick={() => navigate(`/Dashboard/empleados/${e.id}`)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-xs">Editar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center text-gray-500 py-4">No se encontraron empleados con los filtros seleccionados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {empleadoSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
                        <button onClick={cerrarInfo} className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-xl">&times;</button>
                        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">👤 Detalles del Empleado</h2>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li><strong>Nombre:</strong> {empleadoSeleccionado.nombre}</li>
                            <li><strong>Apellido:</strong> {empleadoSeleccionado.apellido}</li>
                            <li><strong>Email:</strong> {empleadoSeleccionado.email}</li>
                            <li><strong>Teléfono:</strong> {empleadoSeleccionado.telefono}</li>
                            <li><strong>Fecha de Contratación:</strong> {empleadoSeleccionado.fechaContratacion}</li>
                            <li><strong>Departamento:</strong> {empleadoSeleccionado.departamento?.nombre || 'N/A'}</li>
                            <li><strong>Cargo:</strong> {empleadoSeleccionado.cargo?.nombre || 'N/A'}</li>
                        </ul>
                        <div className="mt-6 text-right">
                            <button
                                onClick={cerrarInfo}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Empleados;
