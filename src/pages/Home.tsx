import { useState } from 'react';
import Baner from '../component/Baner';
import Footer from '../component/Footer';
import Boton from '../component/utils/Boton';

export default function Home() {
    return (
        <div className="flex flex-col bg-white min-h-screen w-full">
            <header className="bg-green-700 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Recursos Humanos</h1>
        
                    <Boton path="/login" name="Iniciar Sesión" />
                </div>
            </header>

            <main className="flex-grow">
                {/* Banner */}
                <Baner />

                {/* Características */}
                <section className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white shadow p-6 rounded">
                                <h3 className="text-xl font-semibold mb-2">Selección de Personal</h3>
                                <p>Identificamos y reclutamos a los mejores talentos para tu empresa.</p>
                            </div>
                            <div className="bg-white shadow p-6 rounded">
                                <h3 className="text-xl font-semibold mb-2">Desarrollo Organizacional</h3>
                                <p>Implementamos estrategias para mejorar la estructura y eficiencia de tu empresa.</p>
                            </div>
                            <div className="bg-white shadow p-6 rounded">
                                <h3 className="text-xl font-semibold mb-2">Capacitación y Formación</h3>
                                <p>Ofrecemos programas de formación para potenciar el desarrollo profesional de tus empleados.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Llamado a la acción */}
                <section className="py-16 bg-green-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">¿Estás listo para llevar tu empresa al siguiente nivel?</h2>
                        <p className="mb-8">Únete a nosotros para optimizar tus procesos y fortalecer tu equipo de trabajo.</p>
                        <a href='https://github.com/alkeys' className="text-white border-white hover:bg-green-700 p-3 border rounded">
                            Contáctanos
                        </a>
                        
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
