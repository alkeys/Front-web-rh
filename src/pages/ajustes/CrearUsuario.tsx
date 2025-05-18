import React, { useState } from "react";
import axios from "axios";

const CrearUsuario: React.FC = () => {
  const [formData, setFormData] = useState({
    id: 0,
    username: "",
    password: "",
    rol: "",
    activo: true,
    email: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/rh-api/userapp/save/", formData);
      alert("Usuario creado correctamente");
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      alert("Hubo un error al guardar el usuario.");
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 mt-4">
      <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
            Rol
          </label>
          <input
            type="text"
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="activo"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="activo" className="text-sm text-gray-700">Activo</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar Usuario
        </button>
      </form>
    </div>
  );
};

export default CrearUsuario;
