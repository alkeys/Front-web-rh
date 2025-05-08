import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaBuilding, FaSearch } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

interface DepartamentoData {
    id: number;
    nombre: string;
    cantidad: number;
}

const Departamento: React.FC = () => {
    const urlapiDerpartamentoAllCantEmpleado = import.meta.env.VITE_API_URL_GET_DEPARTAMENTO_ALL_CANT_EMPLEADOS;
    const urlapiDerpartamentoCount = import.meta.env.VITE_API_URL_COUNT_DEPARTAMENTOS;

    const [departamentos, setDepartamentos] = useState<DepartamentoData[]>([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoData[]>([]);
    const [count, setCount] = useState(0);
    const [busqueda, setBusqueda] = useState('');

    const cargarDatos = async () => {
        try {
            const [resDep, resCount] = await Promise.all([
                fetch(urlapiDerpartamentoAllCantEmpleado),
                fetch(urlapiDerpartamentoCount),
            ]);

            if (!resDep.ok || !resCount.ok) throw new Error("Error al obtener los datos");

            const dataDeps = await resDep.json();
            const dataCount = await resCount.json();

            setDepartamentos(dataDeps);
            setDepartamentosFiltrados(dataDeps);
            setCount(dataCount);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        const resultado = departamentos.filter(dep =>
            dep.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );
        setDepartamentosFiltrados(resultado);
    }, [busqueda, departamentos]);

    // 🎨 Colores variados
    const colores = [
        '#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0',
        '#00bcd4', '#e91e63', '#795548', '#607d8b', '#8bc34a',
        '#ffc107', '#3f51b5', '#009688', '#cddc39', '#ff5722'
    ];

    // 📊 Datos para gráfica
    const chartData = {
        labels: departamentosFiltrados.map(d => d.nombre),
        datasets: [
            {
                label: 'Cantidad de empleados',
                data: departamentosFiltrados.map(d => d.cantidad),
                backgroundColor: departamentosFiltrados.map((_, i) => colores[i % colores.length]),
                borderRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div className="p-4 space-y-4">
            {/* ✅ Tarjeta resumen */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Total Departamentos</h3>
                        <FaBuilding className="text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold">{count}</div>
                    <p className="text-xs text-gray-500">Departamentos activos en la organización</p>
                </div>
            </div>

            {/* 🔍 Filtro de búsqueda */}
            <div className="flex items-center gap-2 bg-white p-4 rounded shadow">
                <FaSearch className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Buscar departamento..."
                    className="flex-1 border-none outline-none"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {/* 📊 Gráfica de barras */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Gráfica de Empleados por Departamento</h2>
                <div className="h-96">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            {/* 📋 Tabla */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Cantidad de Empleados</th>
                            <th className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departamentosFiltrados.map((dep, idx) => (
                            <tr key={idx} className="odd:bg-white even:bg-gray-50 border-b hover:bg-gray-100">
                                <td className="px-6 py-4 text-gray-900 flex items-center gap-2">
                                    <FaBuilding className="text-blue-500" />
                                    {dep.nombre}
                                </td>
                                <td className="px-6 py-4">{dep.cantidad} empleados</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                        title="Editar"
                                    >
                                        <FaEdit /> Editar
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                                        title="Eliminar"
                                    >
                                        <FaTrashAlt /> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-center text-gray-500 py-4">
                    <p>By aviles.</p>
                </div>
            </div>
        </div>
    );
};

export default Departamento;
