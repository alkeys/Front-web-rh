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
        departamento?: {nombre: string };
        cargo?: { nombre: string };
    }

    const [usuarios, setUsuarios] = useState<Empleado[]>([]);
    const [totalEmpleados, setTotalEmpleados] = useState(0);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [filtroCargo, setFiltroCargo] = useState('');
    const [pagina, setPagina] = useState(0);
    const [cantidad] = useState(10);
    const navigate = useNavigate();

    

    const urlBase = import.meta.env.VITE_API_URL_GET_EMPLEADO_PAGINATED;
    const urlTotal = import.meta.env.VITE_API_URL_COUNT_EMPLEADOS;
    const urlDelete = import.meta.env.VITE_API_URL_DELETE_EMPLEADO_BY_ID;
    

   

    useEffect(() => {
        cargarDatos(pagina, cantidad);
        cargarTotalEmpleados();
    }, [pagina, cantidad]);

    const cargarDatos = async (pagina: number, cantidad: number) => {
        try {
            const url = urlBase.replace('{PAGINA}', pagina.toString()).replace('{cantidad}', cantidad.toString());
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

    const cargarTotalEmpleados = async () => {
        try {
            const response = await fetch(urlTotal);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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

    const departamentos = Array.from(new Set(usuarios.map((empleado: any) => empleado.departamento?.nombre))).filter(Boolean);
    const cargos = Array.from(new Set(usuarios.map((empleado: any) => empleado.cargo?.nombre))).filter(Boolean);
   

    ////para el boton de ver mas podes pasarle el id del empleado y hacer un fetch a la api para obtener mas info 
    // o simplemente puedes mostrar la info en un modal o en una nueva pagina
    const verMasInfo = (empleado: Empleado) => {
        navigate(`/info-empleado/${empleado.id}`);
    };




    const BorrarEmpleado = (empleado: Empleado) => {
        var id = empleado.id;
        console.log('ID del empleado a borrar:', id);
        fetch(urlDelete.replace('{id}', id.toString()), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el empleado');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Empleado eliminado:', data);
                // Actualizar la lista de empleados después de eliminar
                alert('Empleado eliminado correctamente');
                cargarDatos(pagina, cantidad);
            })
            .catch((error) => {
                console.error('Error al eliminar el empleado:', error);
            });
    };



    const limpiarFiltros = () => {
        setFiltroNombre('');
        setFiltroDepartamento('');
        setFiltroCargo('');
    };

    const siguientePagina = () => {
        if ((pagina + 1) * cantidad < totalEmpleados) {
            setPagina(prev => prev + 1);
        }
    };

    const paginaAnterior = () => {
        if (pagina > 0) {
            setPagina(prev => prev - 1);
        }
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
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            onClick={() => verMasInfo(empleado)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-xs"
                                        >
                                    
                                            Ver más
                                        </button>
                                        <button 
                                            onClick={() => BorrarEmpleado(empleado)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300 text-xs ml-2"   
                                            >
                                            Borrar
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
