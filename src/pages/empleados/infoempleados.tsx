import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 📌 Interfaz global
interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaContratacion: string;
  idDepartamento: number;
  idCargo: number;
}

const InfoEmpleado: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);

  const API_GET = import.meta.env.VITE_API_URL_GET_EMPLEADO_BY_ID;
  const API_UPDATE = import.meta.env.VITE_API_URL_UPDATE_EMPLEADO;

  // 📥 Cargar datos del empleado o usar "dummy"
  useEffect(() => {
    if (id === '-1') {
      setEmpleado({
        id: -1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        telefono: '1234-5678',
        fechaContratacion: '2020-01-01',
        idDepartamento: 1,
        idCargo: 2,
      });
      return;
    }

    if (id) {
      const url = API_GET.replace('{id}', id);
      console.log('URL generada:', url);
      fetch(url)
        .then((res) => {
          console.log('Respuesta del servidor:', res.status);
          if (!res.ok) throw new Error('Error al obtener el empleado');
          return res.json();
        })
        .then((data) => {
          console.log('Empleado recibido:', data);
          setEmpleado(data);
        })
        .catch((err) => {
          console.error('Error al obtener el empleado:', err);
        });
    }
  }, [id]);

  // 🖊 Manejo de cambios en inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (empleado) {
      setEmpleado({ ...empleado, [e.target.name]: e.target.value });
    }
  };

  // 💾 Guardar cambios
  const guardarCambios = () => {
    if (empleado) {
      const url = API_UPDATE.replace('{id}', empleado.id.toString());
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleado),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Error al actualizar');
          alert('✅ Empleado actualizado correctamente');
          navigate('/empleados'); // <-- Cambia a donde quieras volver
        })
        .catch((err) => {
          console.error('Error al guardar:', err);
          alert('❌ No se pudo actualizar el empleado');
        });
    }
  };

  // ⏳ Cargando...
  if (!empleado) return <div className="p-6">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white border border-gray-200 shadow-md rounded-lg p-8">
        {/* 🔙 Botón de regresar */}
        <button
          onClick={() => navigate('/empleados')}
          className="mb-6 text-sm text-green-600 hover:text-green-800 font-semibold flex items-center"
        >
          ⬅ Regresar
        </button>

        <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
          ✏️ Editar Empleado
        </h2>

        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={empleado.nombre}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={empleado.apellido}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={empleado.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={empleado.telefono}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <button
            onClick={guardarCambios}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            💾 Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoEmpleado;
