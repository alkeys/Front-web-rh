import React, { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import Config from './ajustes/Config';
import Perfiles from './ajustes/Perfiles';
import Logs from './ajustes/Logs';
import CreateDepartamento from './ajustes/CreateDepartamento';

const Ajustes: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Configuración');
    const { user } = useUserContext();

    useEffect(() => {
        if (!user) {
            // Redirección comentada para pruebas
            // window.location.href = '/';
        }
        console.log(user);
    }, [user]);

    // Renderiza el contenido basado en la pestaña activa
    const renderContent = () => {
        switch (activeTab) {
            case 'Configuración':
                return <Config />;
            case 'Perfiles':
                return <Perfiles />;
            case 'Logs':
                return <Logs />;
            case 'Crear Trabajador':
                return <p>Agrega nuevos trabajadores a la organización.</p>;
            case 'Crear Departamento':
                return <CreateDepartamento />;
            case 'Crear Puesto':
                return <p>Define nuevos puestos de trabajo.</p>;
            case 'Crear Usuario':
                return <p>Registra nuevos usuarios en el sistema.</p>;
            default:
                return <p>Selecciona una opción para comenzar.</p>;
        }
    };

    return (
        <div className="p-4 space-y-6">
            {/* Tarjeta de bienvenida */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300 ease-in-out">
                <h1 className="text-2xl font-bold text-gray-900">
                    Bienvenido, <span className="text-blue-500">{user?.username || 'Usuario'}</span>!
                </h1>
                <p className="text-gray-600 mt-2">
                    Administra las configuraciones de tu cuenta y gestiona los recursos del sistema.
                </p>
            </div>

            {/* Menú de navegación */}
            <nav className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Opciones</h2>
                <ul className="flex flex-wrap gap-4">
                    {[
                        'Configuración',
                        'Perfiles',
                        'Logs',
                        'Crear Trabajador',
                        'Crear Departamento',
                        'Crear Puesto',
                        'Crear Usuario',
                    ].map((opcion, index) => (
                        <li
                            key={index}
                            onClick={() => setActiveTab(opcion)}
                            className={`  p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out flex-1 sm:flex-auto text-center ${activeTab === opcion
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                                }`}
                        >
                            {opcion}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Contenido dinámico */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-3xl font-semibold text-black mb-6 text-shadow-lg animate-slideIn">{activeTab}</h3>
                {renderContent()}
            </div>
        </div>
    );
};

export default Ajustes;
