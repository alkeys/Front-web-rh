import React, { useState, useEffect } from "react";

interface Evaluacion {
  id: number;
  descripcion: string;
  fecha: string;
  departamento: {
    id: number;
    nombre: string;
  };
}

const CrearPregunta: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [selectedEvaluacionId, setSelectedEvaluacionId] = useState<number | "">("");
  const [pregunta, setPregunta] = useState<string>("");

  const urlGetEvaluaciones = import.meta.env.VITE_API_URL_GET_EVALUACION_ALL;
  const urlSavePregunta = import.meta.env.VITE_API_URL_SAVE_PREGUNTAS;

  useEffect(() => {
    fetch(urlGetEvaluaciones)
      .then((res) => res.json())
      .then(setEvaluaciones)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvaluacionId || pregunta.trim() === "") {
      alert("Por favor, selecciona una evaluación y escribe la pregunta.");
      return;
    }

    const url = urlSavePregunta.replace("{evaluacionId}", selectedEvaluacionId.toString())+
      `?pregunta=${encodeURIComponent(pregunta)}`;
    console.log("URL:", url); // Verifica la URL generada


    try {

      const response = await fetch(url, {
        method: "POST",});


      if (response.ok) {
        alert("Pregunta guardada exitosamente.");
        setPregunta("");
        setSelectedEvaluacionId("");
      } else {
        alert("Error al guardar la pregunta.");
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error al guardar la pregunta.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Crear Pregunta de Evaluación</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Selecciona una Evaluación</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedEvaluacionId}
              onChange={(e) => setSelectedEvaluacionId(Number(e.target.value))}
            >
              <option value="">Selecciona una evaluación</option>
              {evaluaciones.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.descripcion} - {ev.departamento.nombre} ({ev.fecha})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Pregunta</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              placeholder="Escribe la pregunta aquí"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
          >
            Guardar Pregunta
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearPregunta;
