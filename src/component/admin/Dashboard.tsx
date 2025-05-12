import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { FaUsers, FaBuilding, FaUserTie, FaUserCircle } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const [cantidad, setCantidad] = useState(0);
    const [departamentos, setDepartamentos] = useState(0);
    const [cargos, setCargos] = useState(0);

    const urlapiEmpleadoCantidad = import.meta.env.VITE_API_URL_COUNT_EMPLEADOS;
    const utlDepartamento = import.meta.env.VITE_API_URL_COUNT_DEPARTAMENTOS;
    const urlapiCargosCantidad = import.meta.env.VITE_API_URL_COUNT_CARGOS;

    const CantidadEmpleados = async () => {
        const response = await fetch(urlapiEmpleadoCantidad);
        console.log('Response:', response);
        const data = await response.json();
        setCantidad(data);
    };

    const CantidadDepartamentos = async () => {
        try {
            const response = await fetch(utlDepartamento);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setDepartamentos(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const CantidadCargos = async () => {
        const response = await fetch(urlapiCargosCantidad);
        const data = await response.json();
        setCargos(data);
    };

    useEffect(() => {
        CantidadEmpleados();
        CantidadDepartamentos();
        CantidadCargos();
    }, []);

    const barData = {
        labels: ['Empleados', 'Departamentos', 'Cargos'],
        datasets: [
            {
                label: 'Totales',
                data: [cantidad, departamentos, cargos],
                backgroundColor: ['#4ade80', '#60a5fa', '#facc15'],
                borderRadius: 8,
            },
        ],
    };

    const pieData = {
        labels: ['Empleados', 'Departamentos', 'Cargos'],
        datasets: [
            {
                data: [cantidad, departamentos, cargos],
                backgroundColor: ['#22d3ee', '#f472b6', '#fbbf24'],
            },
        ],
    };

    return (
        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4 bg-gray-50 min-h-screen">
            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <FaUsers className="text-green-500 text-2xl" />
                    <h3 className="text-sm font-semibold text-gray-700">Empleados Totales</h3>
                </div>
                <div className="text-3xl font-bold text-green-700">{cantidad}</div>
                <p className="text-xs text-gray-500">Con la mejor mano de obra siempre</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <FaBuilding className="text-blue-500 text-2xl" />
                    <h3 className="text-sm font-semibold text-gray-700">Departamentos</h3>
                </div>
                <div className="text-3xl font-bold text-blue-700">{departamentos}</div>
                <p className="text-xs text-gray-500">Cantidad de departamentos</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <FaUserTie className="text-yellow-500 text-2xl" />
                    <h3 className="text-sm font-semibold text-gray-700">Cargos</h3>
                </div>
                <div className="text-3xl font-bold text-yellow-600">{cargos}</div>
                <p className="text-xs text-gray-500">Cantidad de cargos</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <FaUserCircle className="text-purple-500 text-2xl" />
                    <h3 className="text-sm font-semibold text-gray-700">By Aviles</h3>
                </div>
                <div className="text-3xl font-bold text-purple-600">Alkeys</div>
                <p className="text-xs text-gray-500">Hola que hace</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Gráfico de Barras</h3>
                <div className="h-80">
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Gráfico Circular</h3>
                <div className="h-80">
                    <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;