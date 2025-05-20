import React, { useEffect, useState } from 'react';
import { FaEdit, FaBuilding, FaSearch } from 'react-icons/fa';
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

    const colores = [
        '#4ade80', '#60a5fa', '#facc15', '#f87171', '#a78bfa',
        '#14b8a6', '#f472b6', '#f97316', '#38bdf8', '#34d399',
        '#eab308', '#6366f1', '#06b6d4', '#84cc16', '#fb923c'
    ];

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
        <div className="p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Total Departamentos</h3>
                        <FaBuilding className="text-green-600 text-xl" />
                    </div>
                    <div className="text-3xl font-bold text-green-700">{count}</div>
                    <p className="text-xs text-gray-500">Departamentos activos en la organización</p>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-md">
                <FaSearch className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Buscar departamento..."
                    className="flex-1 border-none outline-none text-sm"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Gráfica de Empleados por Departamento</h2>
                <div className="h-96">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-lg sm:rounded-xl bg-white p-6">
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
                                <td className="px-6 py-4 flex gap-3">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        title="Editar"
                                    >
                                        <FaEdit /> Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-center text-gray-400 py-4 text-xs">
                    <p>By Aviles - Dashboard de departamentos</p>
                </div>
            </div>
        </div>
    );
};

export default Departamento;
