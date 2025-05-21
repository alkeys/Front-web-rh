import { useState } from 'react';
import Baner from '../component/Baner';
import Footer from '../component/Footer';
import Boton from '../component/utils/Boton';
import { FaUsers, FaChartLine, FaChalkboardTeacher } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Home() {
    const [chartData] = useState({
        labels: ['Empleados', 'Departamentos', 'Cargos'],
        datasets: [
            {
                label: 'Totales',
                data: [120, 8, 25],
                backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56'],
                borderRadius: 6,
            },
        ],
    });

    return (
        <div className="flex flex-col bg-white min-h-screen w-full">
            <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold">Recursos Humanos</h1>
                    <Boton path="/login" name="Iniciar Sesión" />
                </div>
            </header>

            <main className="flex-grow">
                {/* Banner */}
                <Baner />

                {/* Servicios */}
                <section className="py-20 bg-gray-100">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-green-800 mb-12">Nuestros Servicios</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            <div className="bg-white shadow-md hover:shadow-xl transition p-8 rounded-lg text-center">
                                <FaUsers className="text-green-500 text-4xl mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Selección de Personal</h3>
                                <p className="text-gray-600">Identificamos y reclutamos a los mejores talentos para tu empresa.</p>
                            </div>
                            <div className="bg-white shadow-md hover:shadow-xl transition p-8 rounded-lg text-center">
                                <FaChartLine className="text-green-500 text-4xl mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Desarrollo Organizacional</h3>
                                <p className="text-gray-600">Implementamos estrategias para mejorar la estructura y eficiencia de tu empresa.</p>
                            </div>
                            <div className="bg-white shadow-md hover:shadow-xl transition p-8 rounded-lg text-center">
                                <FaChalkboardTeacher className="text-green-500 text-4xl mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Capacitación y Formación</h3>
                                <p className="text-gray-600">Ofrecemos programas de formación para potenciar el desarrollo profesional de tus empleados.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Estadísticas */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-green-800 mb-12">Resumen Estadístico</h2>
                        <div className="max-w-3xl mx-auto">
                            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
                        </div>
                    </div>
                </section>

                {/* Llamado a la acción */}
                <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-4xl font-extrabold mb-4">¿Estás listo para llevar tu empresa al siguiente nivel?</h2>
                        <p className="text-lg mb-8">Únete a nosotros para optimizar tus procesos y fortalecer tu equipo de trabajo.</p>
                        <a href='https://github.com/alkeys' target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-green-700 font-semibold py-3 px-6 rounded-lg hover:bg-green-100 transition">
                            Contáctanos
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}