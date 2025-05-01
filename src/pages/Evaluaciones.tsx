import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Evaluaciones: React.FC = () => {
    const empleados = [
        { nombre: 'Juan Pérez', tipoEvaluacion: 'Desempeño', puntaje: 85, departamento: 'Ventas' },
        { nombre: 'Ana Gómez', tipoEvaluacion: 'Habilidades', puntaje: 90, departamento: 'Recursos Humanos' },
        { nombre: 'Carlos Ruiz', tipoEvaluacion: 'Trabajo en equipo', puntaje: 78, departamento: 'IT' },
        { nombre: 'Laura Martínez', tipoEvaluacion: 'Liderazgo', puntaje: 88, departamento: 'Ventas' },
        { nombre: 'Pedro Sánchez', tipoEvaluacion: 'Comunicación', puntaje: 92, departamento: 'IT' },
    ];

    const departamentos = Array.from(new Set(empleados.map((empleado) => empleado.departamento)));

    const [empleadoSeleccionado, setEmpleadoSeleccionado] = React.useState(empleados[0]);

    const empleadosDelDepartamento = empleados.filter(
        (empleado) => empleado.departamento === empleadoSeleccionado.departamento
    );

    const chartData = {
        labels: empleadosDelDepartamento.map((empleado) => empleado.nombre),
        datasets: [
            {
                label: 'Puntaje de Evaluación',
                data: empleadosDelDepartamento.map((empleado) => empleado.puntaje),
                backgroundColor: empleadosDelDepartamento.map((empleado) =>
                    empleado.nombre === empleadoSeleccionado.nombre ? '#4caf50' : '#2196f3'
                ),
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Evaluaciones de Empleados</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Selector de empleado */}
                <div className="col-span-1 bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Lista de Empleados por Departamento</h2>
                    {departamentos.map((departamento) => (
                        <div key={departamento} className="mb-4">
                            <h3 className="font-medium text-gray-700">{departamento}</h3>
                            <ul>
                                {empleados
                                    .filter((empleado) => empleado.departamento === departamento)
                                    .map((empleado, index) => (
                                        <li
                                            key={index}
                                            className={`py-2 border-b last:border-b-0 cursor-pointer ${
                                                empleadoSeleccionado.nombre === empleado.nombre
                                                    ? 'bg-gray-200'
                                                    : ''
                                            }`}
                                            onClick={() => setEmpleadoSeleccionado(empleado)}
                                        >
                                            <p className="font-medium">{empleado.nombre}</p>
                                            <p className="text-sm text-gray-600">
                                                Tipo de Evaluación: {empleado.tipoEvaluacion}
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Gráfica */}
                <div className="col-span-1 md:col-span-2 bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Gráfica de Evaluaciones</h2>
                    <div className="h-96">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Evaluaciones;
