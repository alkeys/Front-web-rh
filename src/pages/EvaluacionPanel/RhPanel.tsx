
import {  useState } from 'react'
import { useUserContext } from '../../context/UserContext';
import Empleados from '../admin/Empleados';
import Evaluaciones from '../admin/Evaluaciones';
import Hola from './hola';
import CrearTrabajador from '../ajustes/CrearTrabajador';
import CrearEvaluacion from './EvaluacionCrear';
import CrearPregunta from './CrearPregunta';
import EditarEvaluacionYPreguntas from './EditarEvaluacionYPreguntas';

export default function RhPanel() {
  const [activeTab, setActiveTab] = useState('Welcome') // <- Página de bienvenida por defecto
  const { user } = useUserContext();
  const urlapiEstado = import.meta.env.VITE_API_URL_ESTADO_USER

  const CargarUrlActivo = ({ estado }: { estado: boolean }) => {
    const urldata = user ? `${urlapiEstado}?id=${user.id}&active=${estado}` : '';
    return urldata;
  };

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
    }).catch(() => {
      console.log('Error al desactivar usuario');
    });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Welcome':
        return <Hola nombre={user?.username || ''} />
      case 'evaluaciones':
        return <Evaluaciones />
      case 'employees':
        return <Empleados />
      case 'newEmpleado':
        return <CrearTrabajador></CrearTrabajador>
        case  'newEvaluacion':
          return <CrearEvaluacion></CrearEvaluacion>
        case 'NewPregutas':
          return <CrearPregunta></CrearPregunta>
        case 'EditarEvaluacionAndPreguntas':
          return <EditarEvaluacionYPreguntas></EditarEvaluacionYPreguntas>
      default:
        return <Hola nombre={user?.username || ''} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-green-700 text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center">
            <h1 className="text-2xl font-bold">Panel para Recursos Humanos</h1>
            <nav className="flex flex-wrap items-center space-x-2">
            <button
                className={`px-4 py-2 rounded-md ${activeTab === 'employees' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                onClick={() => setActiveTab('Welcome')}
              >
                Home
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'employees' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                onClick={() => setActiveTab('employees')}
              >
                Empleados
              </button>

              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'evaluaciones' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                onClick={() => setActiveTab('evaluaciones')}
              >
                Evaluaciones
              </button>
            
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'evaluaciones' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                onClick={() => setActiveTab('newEmpleado')}
              >
                Nuevo Empleado
              </button>

              
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'evaluaciones' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                onClick={() => setActiveTab('newEvaluacion')}
              >
                Nueva Evaluacion
              </button>

              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'NewPregutas' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                onClick={() => setActiveTab('NewPregutas')}
              >
                Nueva Pregunta
              </button>

              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'EditarEvaluacionAndPreguntas' ? 'bg-green-600' : 'hover:bg-green-600'}`}
                onClick={() => setActiveTab('EditarEvaluacionAndPreguntas')}
              >
                Editar Evaluacion
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
      <main className="flex-grow my-8 p-4">
        {renderContent()}
    </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 RRHH. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
