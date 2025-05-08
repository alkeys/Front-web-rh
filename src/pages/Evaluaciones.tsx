import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { ChartData } from 'chart.js';

const Evaluaciones: React.FC = () => {
    const url = import.meta.env.VITE_API_URL_EVALUACIONES_ALL;
    const [empleados, setEmpleados] = useState<any[]>([]);
    const [departamentos, setDepartamentos] = useState<string[]>([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<string>('');
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Error en la respuesta de la API');
                const data = await response.json();

                const agrupados = data.reduce((acc: any[], item: any) => {
                    const nombreCompleto = `${item.empleado.nombre} ${item.empleado.apellido}`;
                    const departamento = item.empleado.departamento.nombre;

                    const nuevaEvaluacion = {
                        pregunta: item.pregunta.pregunta,
                        puntaje: item.calificacion * 20,
                        comentario: item.comentario,
                        fecha: item.fechaEvaluacion,
                    };

                    let empleadoExistente = acc.find(e => e.nombre === nombreCompleto);

                    if (empleadoExistente) {
                        empleadoExistente.evaluaciones.push(nuevaEvaluacion);
                    } else {
                        acc.push({
                            nombre: nombreCompleto,
                            departamento,
                            evaluaciones: [nuevaEvaluacion],
                        });
                    }

                    return acc;
                }, []);

                setEmpleados(agrupados);
                setDepartamentos([...new Set(agrupados.map(e => e.departamento))]);
                setDepartamentoSeleccionado(agrupados[0]?.departamento || '');
                setEmpleadoSeleccionado(agrupados[0] || null);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, [url]);

    const empleadosFiltrados = empleados.filter(e => e.departamento === departamentoSeleccionado);

    const preguntasSeleccionado = empleadoSeleccionado?.evaluaciones.map((ev: any) => ev.pregunta) || [];

    const preguntasFiltradas = preguntasSeleccionado.filter((pregunta) =>
        empleadosFiltrados.some(emp =>
            emp.nombre !== empleadoSeleccionado?.nombre &&
            emp.evaluaciones.some((ev: any) => ev.pregunta === pregunta)
        )
    );

    const datasetSeleccionado = {
        label: empleadoSeleccionado?.nombre || 'Empleado',
        data: preguntasFiltradas.map((pregunta) => {
            const ev = empleadoSeleccionado?.evaluaciones.find((ev: any) => ev.pregunta === pregunta);
            return ev ? ev.puntaje : 0;
        }),
        backgroundColor: '#2196f3',
    };

    const datasetPromedio = {
        label: 'Promedio del Departamento',
        data: preguntasFiltradas.map((pregunta) => {
            const puntajes = empleadosFiltrados
                .filter(emp => emp.nombre !== empleadoSeleccionado?.nombre)
                .map(emp => {
                    const ev = emp.evaluaciones.find((ev: any) => ev.pregunta === pregunta);
                    return ev ? ev.puntaje : null;
                })
                .filter(p => p !== null) as number[];

            const promedio = puntajes.length > 0 ? puntajes.reduce((a, b) => a + b, 0) / puntajes.length : 0;
            return promedio;
        }),
        backgroundColor: '#4caf50',
    };

    const barChartData: ChartData<'bar'> = {
        labels: preguntasFiltradas,
        datasets: [datasetSeleccionado, datasetPromedio],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`,
                },
            },
            legend: {
                position: 'top' as const,
                labels: {
                    font: { size: 12 },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 30,
                    minRotation: 0,
                    font: { size: 11 },
                },
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    font: { size: 12 },
                },
            },
        },
    };

    const pieChartData = {
        labels: empleadoSeleccionado?.evaluaciones.map(ev => ev.pregunta),
        datasets: [{
            label: 'Distribución de Evaluaciones',
            data: empleadoSeleccionado?.evaluaciones.map(ev => ev.puntaje),
            backgroundColor: ['#2196f3', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#4caf50'],
        }],
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Evaluaciones de Empleados</h1>

            {/* Filtro por departamento */}
            <div className="mb-6">
                <label className="block font-semibold mb-2">Filtrar por departamento:</label>
                <select
                    className="p-2 rounded border"
                    value={departamentoSeleccionado}
                    onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
                >
                    {departamentos.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Lista de empleados */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Empleados</h2>
                    <ul>
                        {empleadosFiltrados.map((empleado, idx) => (
                            <li
                                key={idx}
                                onClick={() => setEmpleadoSeleccionado(empleado)}
                                className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                                    empleadoSeleccionado?.nombre === empleado.nombre ? 'bg-blue-100' : ''
                                }`}
                            >
                                <p className="font-medium">{empleado.nombre}</p>
                                <p className="text-sm text-gray-500">Evaluaciones: {empleado.evaluaciones.length}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gráfica de comparación */}
                <div className="col-span-2 bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Comparativa por Pregunta</h2>
                    <div className="h-[450px]">
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>
                </div>
            </div>

            {/* Gráfica de pastel individual */}
            {empleadoSeleccionado && (
                <div className="mt-10 bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Distribución Individual de {empleadoSeleccionado.nombre}</h2>
                    <div className="h-[400px]">
                        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            )}

            {/* Detalle de evaluaciones */}
            {empleadoSeleccionado && (
                <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Detalle de Evaluaciones de {empleadoSeleccionado.nombre}</h2>

                    {/* Ventana de alerta */}
                    <div className={`mb-6 p-4 rounded text-sm font-medium border
                        ${empleadoSeleccionado.evaluaciones.some((ev: any) => ev.puntaje < 60)
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-green-100 text-green-800 border-green-300'}`}>
                        {empleadoSeleccionado.evaluaciones.some((ev: any) => ev.puntaje < 60)
                            ? 'Este empleado requiere atención en una o más evaluaciones.'
                            : 'Este empleado tiene un desempeño aceptable en todas las evaluaciones.'}
                    </div>

                    <ul className="space-y-4">
                        {empleadoSeleccionado.evaluaciones.map((ev: any, idx: number) => (
                            <li key={idx} className="border-b pb-2">
                                <p className="font-medium">Pregunta: {ev.pregunta}</p>
                                <p className="text-sm">Comentario: {ev.comentario}</p>
                                <p className="text-sm">Puntaje: {ev.puntaje}%</p>
                                <p className="text-sm">
                                    Fecha: {ev.fecha
                                        ? new Date(ev.fecha).toLocaleDateString('es-SV', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : 'Sin fecha'}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Evaluaciones;
