import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const [cantidad, setCantidad] = useState(0);
    const [asistencia, setAsistencia] = useState(0);
    const [cargos, setCargos] = useState(0);

    const urlapiEmpleadoCantidad = import.meta.env.VITE_API_URL_COUNT_EMPLEADOS;
    const urlapiAsistenciaPromedio = import.meta.env.VITE_API_URL_PROMEDIO_ASISTENCIA;
    const urlapiCargosCantidad = import.meta.env.VITE_API_URL_COUNT_CARGOS;

    const CantidadEmpleados = async () => {
        const response = await fetch(urlapiEmpleadoCantidad);
        const data = await response.json();
        setCantidad(data);
    };

    const Asistencia = async () => {
        const response = await fetch(urlapiAsistenciaPromedio);
        const data = await response.json();
        setAsistencia(data);
    };

    const CantidadCargos = async () => {
        const response = await fetch(urlapiCargosCantidad);
        const data = await response.json();
        setCargos(data);
    };

    useEffect(() => {
        CantidadEmpleados();
        Asistencia();
        CantidadCargos();
    }, []);

    const barData = {
        labels: ['Empleados', 'Asistencia', 'Cargos'],
        datasets: [
            {
                label: 'Totales',
                data: [cantidad, asistencia * 100, cargos],
                backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56'],
            },
        ],
    };

    const pieData = {
        labels: ['Empleados', 'Asistencia', 'Cargos'],
        datasets: [
            {
                data: [cantidad, asistencia * 100, cargos],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    };



    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Empleados Totales</h3>
                <div className="text-2xl font-bold">{cantidad}</div>
                <p className="text-xs text-gray-500">Con la mejor mano de obras siempre</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Asistencia</h3>
                <div className="text-2xl font-bold">{(asistencia * 100).toFixed(2)}%</div>
                <p className="text-xs text-gray-500">Promedio de asistencia</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Cargos</h3>
                <div className="text-2xl font-bold">{cargos}</div>
                <p className="text-xs text-gray-500">Cantidad de cargos</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">By aviles</h3>
                <div className="text-2xl font-bold">Alkeys</div>
                <p className="text-xs text-gray-500">Hola que hace</p>
            </div>

            {/* Gráficos */}
            <div className="bg-white p-4 rounded-lg shadow col-span-2">
                <h3 className="text-sm font-medium mb-4">Gráfico de Barras</h3>
                <Bar data={barData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow col-span-2">
                <h3 className="text-sm font-medium mb-4">Gráfico Circular</h3>
                <Pie data={pieData} />
            </div>

        </div>
    );
};

export default Dashboard;
