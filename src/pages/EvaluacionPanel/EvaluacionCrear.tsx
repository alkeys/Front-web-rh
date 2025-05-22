import { Cat } from "lucide-react";
import React, { useState, useEffect } from "react";

interface Departamento {
  id: number;
  nombre: string;
}

const CrearEvaluacion: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<number | "">("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");

  const urlDepartamentos = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS;
  const urlGuardarEvaluacion = import.meta.env.VITE_API_URL_SAVE_EVALUACION;

  useEffect(() => {
    fetch(urlDepartamentos)
      .then(res => res.json())
      .then(setDepartamentos)
      .catch(console.error);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!descripcion || !fecha || selectedDepartamentoId === "") {
      alert("Por favor completa todos los campos.");
      return;
    }

    const cuerpo = {
      fecha: fecha,
      descripcion: descripcion,
    };

    try {
      const url = urlGuardarEvaluacion.replace("{idDepartamento}", String(selectedDepartamentoId)) +
        `?fecha=${fecha}&descripcion=${descripcion}`;
      console.log("URL de la API:", url);
      console.log("Cuerpo de la solicitud:", cuerpo);

      const response = await fetch(url, {
        method: "POST",
      });

      if (response.ok) {
        alert("✅ Evaluación creada exitosamente.");
        // Limpiar campos después del éxito
        setSelectedDepartamentoId("");
        setDescripcion("");
        setFecha("");
      }

    } catch (error) {
      console.error("Error al guardar la evaluación:", error);
      alert("Error al guardar la evaluación. Por favor intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Crear Evaluación</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Departamento</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={selectedDepartamentoId}
              onChange={(e) => setSelectedDepartamentoId(Number(e.target.value))}
            >
              <option value="">Selecciona un departamento</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej. Evaluación de desempeño"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Fecha</label>
            <input
              type="date"
              className="w-full border p-3 rounded-lg"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
          >
            Crear Evaluación
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearEvaluacion;
