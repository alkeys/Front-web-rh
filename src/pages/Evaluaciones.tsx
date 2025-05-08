import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { ChartData } from 'chart.js';

interface Evaluacion {
    pregunta: string;
    puntaje: number;
    comentario: string;
    fecha: string;
}

interface Empleado {
    nombre: string;
    departamento: string;
    evaluaciones: Evaluacion[];
}

const Evaluaciones: React.FC = () => {
    const url = import.meta.env.VITE_API_URL_EVALUACIONES_ALL;
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [departamentos, setDepartamentos] = useState<string[]>([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<string>('');
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Error en la respuesta de la API');
                const data = await response.json();

                const agrupados: Empleado[] = data.reduce((acc: Empleado[], item: any) => {
                    const nombreCompleto = `${item.empleado.nombre} ${item.empleado.apellido}`;
                    const departamento = item.empleado.departamento.nombre;

                    const nuevaEvaluacion: Evaluacion = {
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

    const preguntasFiltradas = empleadoSeleccionado?.evaluaciones
        .map(ev => ev.pregunta)
        .filter(pregunta =>
            empleadosFiltrados.some(emp =>
                emp.nombre !== empleadoSeleccionado.nombre &&
                emp.evaluaciones.some(ev => ev.pregunta === pregunta)
            )
        ) || [];

    const coloresPastel = ['#a8dadc', '#f4a261', '#e76f51', '#2a9d8f', '#264653', '#ffafcc'];

    const datasetSeleccionado = {
        label: empleadoSeleccionado?.nombre || 'Empleado',
        data: preguntasFiltradas.map(pregunta =>
            empleadoSeleccionado?.evaluaciones.find(ev => ev.pregunta === pregunta)?.puntaje || 0
        ),
        backgroundColor: '#00b4d8',
        borderRadius: 8,
    };

    const datasetPromedio = {
        label: 'Promedio del Departamento',
        data: preguntasFiltradas.map(pregunta => {
            const puntajes = empleadosFiltrados
                .filter(emp => emp.nombre !== empleadoSeleccionado?.nombre)
                .map(emp => emp.evaluaciones.find(ev => ev.pregunta === pregunta)?.puntaje || 0)
                .filter(p => p > 0);
            return puntajes.length ? puntajes.reduce((a, b) => a + b, 0) / puntajes.length : 0;
        }),
        backgroundColor: '#90e0ef',
        borderRadius: 8,
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
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 20 },
            },
        },
    };

    const pieChartData = {
        labels: empleadoSeleccionado?.evaluaciones.map(ev => ev.pregunta),
        datasets: [{
            label: 'Distribución de Evaluaciones',
            data: empleadoSeleccionado?.evaluaciones.map(ev => ev.puntaje),
            backgroundColor: empleadoSeleccionado?.evaluaciones.map((_, i) => coloresPastel[i % coloresPastel.length]),
        }],
    };

    const requiereAtencion = empleadoSeleccionado?.evaluaciones.some(ev => ev.puntaje < 60);

    return (
        <div className="p-8 bg-gradient-to-tr from-green-100 via-white to-blue-100 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-8">Evaluaciones de Empleados</h1>

            <div className="mb-8 max-w-xs mx-auto">
                <label className="block mb-2 font-medium">Filtrar por departamento:</label>
                <select
                    className="p-2 border border-gray-300 rounded w-full shadow focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={departamentoSeleccionado}
                    onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
                >
                    {departamentos.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 shadow rounded-lg">
                    <h2 className="text-lg font-semibold mb-4 text-green-700">Empleados</h2>
                    <ul className="space-y-2">
                        {empleadosFiltrados.map((empleado, idx) => (
                            <li
                                key={idx}
                                onClick={() => setEmpleadoSeleccionado(empleado)}
                                className={`p-3 rounded-lg cursor-pointer border ${
                                    empleadoSeleccionado?.nombre === empleado.nombre
                                        ? 'bg-green-100 border-green-300'
                                        : 'hover:bg-gray-50 border-gray-200'
                                }`}
                            >
                                <p className="font-medium text-green-900">{empleado.nombre}</p>
                                <p className="text-sm text-gray-500">{empleado.evaluaciones.length} evaluaciones</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-2 bg-white p-4 shadow rounded-lg">
                    <h2 className="text-lg font-semibold mb-4 text-blue-700">Comparativa por Pregunta</h2>
                    <div className="h-[400px]">
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>
                </div>
            </div>

            {empleadoSeleccionado && (
                <>
                    <div className="mt-10 bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4 text-indigo-700">Distribución de {empleadoSeleccionado.nombre}</h2>
                        <div className="h-[400px]">
                            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="mt-10 bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Detalle de Evaluaciones</h2>
                        <div className={`p-4 mb-6 rounded-lg font-medium text-center text-sm border ${
                            requiereAtencion
                                ? 'bg-red-100 text-red-700 border-red-300'
                                : 'bg-green-100 text-green-700 border-green-300'
                        }`}>
                            {requiereAtencion
                                ? '⚠️ Este empleado requiere atención en una o más evaluaciones.'
                                : '✅ Este empleado tiene un desempeño aceptable en todas las evaluaciones.'}
                        </div>

                        <ul className="space-y-4">
                            {empleadoSeleccionado.evaluaciones.map((ev, idx) => (
                                <li key={idx} className="border-b pb-2">
                                    <p className="font-semibold text-gray-700">Pregunta: {ev.pregunta}</p>
                                    <p className="text-sm text-gray-600">Comentario: {ev.comentario}</p>
                                    <p className="text-sm">Puntaje: <span className={ev.puntaje < 60 ? 'text-red-600 font-bold' : ''}>{ev.puntaje}%</span></p>
                                    <p className="text-sm">Fecha: {new Date(ev.fecha).toLocaleDateString('es-SV', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default Evaluaciones;
