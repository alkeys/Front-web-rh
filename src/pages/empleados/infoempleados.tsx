import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaContratacion: string;
  departamento: { id: number; nombre: string };
  cargo: { id: number; nombre: string; salarioBase: number };
}

interface Departamento {
  id: number;
  nombre: string;
}

interface Cargo {
  id: number;
  nombre: string;
  salarioBase: number;
}

const InfoEmpleado: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);

  const API_GET = import.meta.env.VITE_API_URL_GET_EMPLEADO_BY_ID;
  const API_UPDATE = import.meta.env.VITE_API_URL_UPDATE_EMPLEADO;
  const urlDepartamentos = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS;
  const urlCargos = import.meta.env.VITE_API_URL_GET_ALL_CARGOS;

  useEffect(() => {
    fetch(urlDepartamentos).then(res => res.json()).then(setDepartamentos);
    fetch(urlCargos).then(res => res.json()).then(setCargos);
  }, []);

  useEffect(() => {
    if (id) {
      const url = API_GET.replace('{id}', id);
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error('Error al obtener el empleado');
          return res.json();
        })
        .then((data) => setEmpleado(data))
        .catch((err) => console.error('Error al obtener el empleado:', err));
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (empleado) {
      const { name, value } = e.target;
      if (name === 'departamento') {
        const selectedDep = departamentos.find(d => d.id === Number(value));
        if (selectedDep) setEmpleado({ ...empleado, departamento: selectedDep });
      } else if (name === 'cargo') {
        const selectedCargo = cargos.find(c => c.id === Number(value));
        if (selectedCargo) setEmpleado({ ...empleado, cargo: selectedCargo });
      } else {
        setEmpleado({ ...empleado, [name]: value });
      }
    }
  };

  const guardarCambios = () => {
    if (empleado) {
      const url = API_UPDATE
        .replace('{id}', empleado.id.toString())
        .replace('{idDepartamento}', empleado.departamento.id.toString())
        .replace('{idCargo}', empleado.cargo.id.toString());
    console.log('URL de actualización:', url);
      console.log('Datos del empleado:', empleado);
      const empleadoSinRelaciones = {
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        email: empleado.email,
        telefono: empleado.telefono,
        fechaContratacion: empleado.fechaContratacion
      };
      console.log('Datos del empleado sin relaciones:', empleadoSinRelaciones);
      fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoSinRelaciones),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Error al actualizar');
          alert('✅ Empleado actualizado correctamente');
          navigate('/Dashboard');
        })
        .catch((err) => {
          console.error('Error al guardar:', err);
          alert('❌ No se pudo actualizar el empleado');
        });
    }
  };

  if (!empleado) return <div className="p-6">⏳ Cargando datos del empleado...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white border border-gray-200 shadow-lg rounded-xl p-8">
        <button
          onClick={() => navigate('/Dashboard')}
          className="mb-6 text-sm text-green-600 hover:text-green-800 font-semibold flex items-center"
        >
          ⬅ Regresar al panel
        </button>

        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
          🧾 Información del Empleado
        </h2>

        <div className="space-y-5">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <select
              name="departamento"
              value={empleado.departamento.id}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Seleccione una opción</option>
              {departamentos.map((dep) => (
                <option key={dep.id} value={dep.id}>{dep.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <select
              name="cargo"
              value={empleado.cargo.id}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Seleccione una opción</option>
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>{cargo.nombre}</option>
              ))}
            </select>
          </div>

          <button
            onClick={guardarCambios}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-lg"
          >
            💾 Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoEmpleado;
