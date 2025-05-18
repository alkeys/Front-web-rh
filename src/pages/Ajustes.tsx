import React, { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import Config from './ajustes/Config';
import Perfiles from './ajustes/Perfiles';
import Logs from './ajustes/Logs';
import CreateDepartamento from './ajustes/CreateDepartamento';
import { FaCogs, FaUserCog, FaClipboardList, FaUserPlus, FaBuilding,  FaUsers } from 'react-icons/fa';
import CrearTrabajador from './ajustes/CrearTrabajador';
import CrearUsuario from './ajustes/CrearUsuario';


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

    const opciones = [
        { label: 'Configuración', icon: <FaCogs /> },
        { label: 'Perfiles', icon: <FaUserCog /> },
        { label: 'Logs', icon: <FaClipboardList /> },
        { label: 'Crear Trabajador', icon: <FaUsers /> },
        { label: 'Crear Departamento', icon: <FaBuilding /> },
        { label: 'Crear Usuario', icon: <FaUserPlus /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Configuración':
                return <Config />;
            case 'Perfiles':
                return <Perfiles />;
            case 'Logs':
                return <Logs />;
            case 'Crear Trabajador':
                return <CrearTrabajador />;
            case 'Crear Departamento':
                return <CreateDepartamento />;
            case 'Crear Usuario':
                return <CrearUsuario />;
            default:
                return <p>Selecciona una opción para comenzar.</p>;
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Bienvenido, <span className="text-blue-600">{user?.username || 'Usuario'}</span>!
                </h1>
                <p className="text-gray-600 mt-2 text-sm">
                    Administra las configuraciones de tu cuenta y gestiona los recursos del sistema.
                </p>
            </div>

            <nav className="bg-white rounded-xl shadow-md p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Opciones de configuración</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {opciones.map((opcion, index) => (
                        <li
                            key={index}
                            onClick={() => setActiveTab(opcion.label)}
                            className={`p-4 rounded-lg cursor-pointer flex items-center gap-3 justify-center transition duration-300 ease-in-out text-sm font-medium ${
                                activeTab === opcion.label
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                            }`}
                        >
                            {opcion.icon} {opcion.label}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{activeTab}</h3>
                {renderContent()}
            </div>
        </div>
    );
};

export default Ajustes;