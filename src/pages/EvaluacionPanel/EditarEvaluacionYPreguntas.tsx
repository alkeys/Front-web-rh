import React, { useEffect, useState } from "react";

interface Evaluacion {
  id: number;
  descripcion: string;
  fecha: string;
  departamento: {
    id: number;
    nombre: string;
  };
}

interface Pregunta {
  id: number;
  pregunta: string;
}

const EditarEvaluaciones: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [selectedEvaluacionId, setSelectedEvaluacionId] = useState<number | "">("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  const urlEvaluaciones = import.meta.env.VITE_API_URL_GET_EVALUACION_ALL;
  const urlPreguntas = import.meta.env.VITE_API_URL_PREGUNTAS;
  const urlUpdateEvaluacion = import.meta.env.VITE_API_URL_SAVE_EVALUACION;
  const urlDeleteEvaluacion = import.meta.env.VITE_API_URL_DELETE_EVALUACION;
  const urlDeletePregunta = import.meta.env.VITE_API_URL_DELETE_PREGUNTA;

  useEffect(() => {
    fetch(urlEvaluaciones)
      .then((res) => res.json())
      .then(setEvaluaciones)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedEvaluacionId !== "") {
      const evaluacion = evaluaciones.find((e) => e.id === selectedEvaluacionId);
      if (evaluacion) {
        setDescripcion(evaluacion.descripcion);
        setFecha(evaluacion.fecha);

        fetch(urlPreguntas.replace("{evaluacionId}", String(selectedEvaluacionId)))
          .then((res) => res.json())
          .then(setPreguntas)
          .catch(console.error);
      }
    }
  }, [selectedEvaluacionId]);

  const handleActualizar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!descripcion || !fecha || selectedEvaluacionId === "") {
      alert("Por favor completa todos los campos.");
      return;
    }

    const evaluacion = evaluaciones.find((e) => e.id === selectedEvaluacionId);
    const idDepartamento = evaluacion?.departamento.id;

    const url = urlUpdateEvaluacion.replace("{idDepartamento}", String(idDepartamento)) +
      `?fecha=${fecha}&descripcion=${descripcion}`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (response.ok) {
        alert("✅ Evaluación actualizada exitosamente.");
      }
    } catch (error) {
      console.error("Error al actualizar la evaluación:", error);
      alert("Error al actualizar la evaluación. Por favor intenta nuevamente.");
    }
  };

  const handleBorrar = async () => {
    if (!selectedEvaluacionId) return;
    const confirmacion = confirm("¿Estás seguro que deseas eliminar esta evaluación?");
    if (!confirmacion) return;

    try {
      const url = urlDeleteEvaluacion.replace("{id}", String(selectedEvaluacionId));
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("🗑️ Evaluación eliminada exitosamente.");
        setSelectedEvaluacionId("");
        setDescripcion("");
        setFecha("");
        setPreguntas([]);
        setEvaluaciones(prev => prev.filter(e => e.id !== selectedEvaluacionId));
      } else {
        alert("Error al eliminar la evaluación.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Ocurrió un error al eliminar.");
    }
  };

  const handleEditarPregunta = (id: number) => {
    const nuevaPregunta = prompt("Editar pregunta:", preguntas.find(p => p.id === id)?.pregunta || "");
    if (!nuevaPregunta) return;

    setPreguntas(prev => prev.map(p => p.id === id ? { ...p, pregunta: nuevaPregunta } : p));
    // Aquí deberías llamar a tu API de actualización si la tienes disponible
  };

  const handleBorrarPregunta = async (id: number) => {
    const confirmacion = confirm("¿Deseas eliminar esta pregunta?");
    if (!confirmacion) return;

    try {
      const response = await fetch(urlDeletePregunta.replace("{id}", String(id)), {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Pregunta eliminada.");
        setPreguntas(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Error al eliminar la pregunta.");
      }
    } catch (error) {
      console.error("Error eliminando pregunta:", error);
      alert("Error en la eliminación de la pregunta.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Editar Evaluación</h1>
        <form onSubmit={handleActualizar} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Evaluación</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={selectedEvaluacionId}
              onChange={(e) => setSelectedEvaluacionId(Number(e.target.value))}
            >
              <option value="">Selecciona una evaluación</option>
              {evaluaciones.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.descripcion} ({ev.departamento.nombre})
                </option>
              ))}
            </select>
          </div>

          {selectedEvaluacionId && (
            <>
              <div>
                <label className="block font-semibold mb-1">Descripción</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-lg"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
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

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
                >
                  Actualizar Evaluación
                </button>
                <button
                  type="button"
                  onClick={handleBorrar}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700"
                >
                  Borrar Evaluación
                </button>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Preguntas Asociadas</h2>
                {preguntas.length > 0 ? (
                  <ul className="space-y-2">
                    {preguntas.map((p) => (
                      <li key={p.id} className="flex items-center justify-between border p-2 rounded">
                        <span>{p.pregunta}</span>
                        <div className="space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditarPregunta(p.id)}
                            className="text-blue-500 hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBorrarPregunta(p.id)}
                            className="text-red-500 hover:underline"
                          >
                            Borrar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No hay preguntas asociadas a esta evaluación.</p>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditarEvaluaciones;
