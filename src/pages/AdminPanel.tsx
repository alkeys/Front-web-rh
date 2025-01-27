'use client'

import { useState } from 'react'
import { useUserContext } from '../context/UserContext';
import Dashboard from '../component/admin/Dashboard';
import Empleados from './Empleados';
import Departamento from './Departamento';
import Ajustes from './Ajustes';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { user } = useUserContext();
  const urlapiEstado = import.meta.env.VITE_API_URL_ESTADO_USER


  /*
  * carga la url para cambiar el estado del usuario a activo y resive el estado activo o inactivo 
  * del usuario mediante  parametro  de props
  */
  const CargarUrlActivo = ({ estado }: { estado: boolean }) => {
    const urldata = `${urlapiEstado}?id=${user.id}&active=${estado}`;
    return urldata;
  };





  useState(() => {
    if (!user) {
      // window.location.href = '/login';
    } else {
      // se envia la peticion para cambiar el estado del usuario a activo mediante la api
      // mediate put
      const url = CargarUrlActivo({ estado: true });
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          console.log('Usuario activado');
        } else {
          console.log('Error al activar usuario');
        }
      }).catch(error => {
        console.log('Error al activar usuario');
      });
    }

  }, [])


  const cerrarSeccion = () => {
    const url = CargarUrlActivo({ estado: false });
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        console.log('Usuario desactivado');
        window.location.href = '/';
      } else {
        console.log('Error al desactivar usuario');
      }
    }).catch(error => {
      console.log('Error al desactivar usuario');

    });
  }



  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'employees':
        return <Empleados />
      case 'jobs':
        return <Departamento />
      case 'settings':
        return <Ajustes/>
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
    {/* Header */}
    <header className="bg-green-700 text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto">
            <div className="flex flex-wrap justify-between items-center">
                <h1 className="text-2xl font-bold">RRHH Admin</h1>
                <nav className="flex flex-wrap items-center space-x-2">
                    <button
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'dashboard' ? 'bg-green-600' : 'hover:bg-green-600'
                        }`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'employees' ? 'bg-green-600' : 'hover:bg-green-600'
                        }`}
                        onClick={() => setActiveTab('employees')}
                    >
                        Empleados
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'jobs' ? 'bg-green-600' : 'hover:bg-green-600'
                        }`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        Departamentos
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'settings' ? 'bg-green-600' : 'hover:bg-green-600'
                        }`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Ajustes
                    </button>
                    <button
                        className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700"
                        onClick={cerrarSeccion}
                    >
                        Cerrar Sesión
                    </button>
                </nav>
            </div>
        </div>
    </header>

    {/* Main Content */}
    <main className="flex-grow container mx-auto my-8 p-4">
        {renderContent()}
    </main>

    {/* Footer */}
    <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
            <p>&copy; 2025 RRHH. Todos los derechos reservados.</p>
        </div>
    </footer>
</div>
  )
}



