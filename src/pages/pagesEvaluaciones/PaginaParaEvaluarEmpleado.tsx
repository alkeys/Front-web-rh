import React, { useState, useEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
import { useUserContext } from "../../context/UserContext";

interface Departamento {
    id: number;
    nombre: string;
}

interface Empleado {
    id: number;
    nombre: string;
    apellido: string;
}

interface Evaluacion {
    id: number;
    descripcion: string;
}

interface Pregunta {
    id: number;
    pregunta: string;
}

const PaginaParaEvaluarEmpleado: React.FC = () => {
    const { user } = useUserContext();

    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
    const [selectedEvaluacionId, setSelectedEvaluacionId] = useState<number | "">("");
    const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<number | "">("");
    const [selectedEmpleadoId, setSelectedEmpleadoId] = useState<number | "">("");
    const [respuestas, setRespuestas] = useState<{ [key: string]: string }>({});
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
    const [Comentario, setComentario] = useState<string>("");

    const urlDepartamentos = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS;
    const urlEmpleadosDepartamento = import.meta.env.VITE_API_URL_EMPLEADOS_DEPARTAMENTO_ID;
    const urlEvaluacion = import.meta.env.VITE_API_URL_EVALUACIONES + "getEvaluacionByDepartamentoId/";
    const urlPreguntas = import.meta.env.VITE_API_URL_PREGUNTAS;
    const urlSaveEvaluacion = import.meta.env.VITE_API_URL_SAVE_RESPUESTAS;
    useEffect(() => {
        fetch(urlDepartamentos)
            .then(res => res.json())
            .then(setDepartamentos)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedDepartamentoId !== "") {
            fetch(urlEmpleadosDepartamento.replace("{id}", selectedDepartamentoId.toString()), {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then(res => res.json())
                .then(setEmpleados)
                .catch(console.error);

            fetch(`${urlEvaluacion}${selectedDepartamentoId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then(res => res.json())
                .then(setEvaluaciones)
                .catch(console.error);
        } else {
            setEmpleados([]);
            setEvaluaciones([]);
            setSelectedEvaluacionId("");
        }
    }, [selectedDepartamentoId]);

    useEffect(() => {
        if (selectedEvaluacionId !== "") {
            fetch(urlPreguntas.replace("{evaluacionId}", selectedEvaluacionId.toString()), {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then(res => res.json())
                .then((data) => {
                    const formatted = data.map((p: any) => ({ id: p.id.toString(), pregunta: p.pregunta }));
                    setPreguntas(formatted);
                })
                .catch(console.error);
        }
    }, [selectedEvaluacionId]);

    const handleRespuesta = (pregunta: string, valor: string) => {
        setRespuestas((prev) => ({ ...prev, [pregunta]: valor }));
    };

    const handleSubmit = (event: React.FormEvent) => {

        /*
        que se tiene que enviar al backend:
       cuerpo de la evaluacion a enviar  por cada pregunta se tiene que enviar la respuesta
            {
                "calificacion": 5,
                "comentario": "string",
                "fechaEvaluacion": "2025-05-21"
                } 
                la url #/rh-api/respuestas-evaluacion/saveRespuestasEvaluacion/{idPregunta}/{idempleado}

        */

       //modifica la url para que se ajuste a la nueva estructura remplazando el id de la pregunta y el id del empleado
        // Evita el comportamiento por defecto del formulario
      //url #/rh-api/respuestas-evaluacion/saveRespuestasEvaluacion/{idPregunta}/{idempleado}/
    event.preventDefault();

    if (!selectedEmpleadoId || !selectedEvaluacionId) {
        alert("Por favor selecciona un empleado y una evaluación antes de enviar.");
        return;
    }

    const fechaEvaluacion = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

    const promises = preguntas.map((pregunta) => {
        const respuesta = respuestas[pregunta.id];
        if (!respuesta) {
        alert(`Por favor responde todas las preguntas antes de enviar.`);
        throw new Error("Faltan respuestas.");
        }

        const calificacion = parseInt(respuesta, 10); // Asegúrate de usar base 10 para convertir la respuesta a un número
        if (calificacion < 1 || calificacion > 5) {
            alert(`La calificación para la pregunta "${pregunta.pregunta}" debe estar entre 1 y 5.`);
            throw new Error("Calificación fuera de rango.");
        }
        const comentario = encodeURIComponent(Comentario);
        const url = urlSaveEvaluacion
          .replace("{idPregunta}", pregunta.id)
          .replace("{idempleado}", selectedEmpleadoId.toString()) +
          `?calificacion=${calificacion}&comentario=${comentario}&fechaEvaluacion=${fechaEvaluacion}`;
        
        console.log("URL final:", url);
        
        // El fetch ya no necesita body:
        return fetch(url, {
          method: "POST",
        });
        


});

    Promise.all(promises)
        .then((responses) => {
        if (responses.every((res) => res.ok)) {
            alert("Evaluación enviada exitosamente.");
            setSelectedDepartamentoId("");
            setSelectedEmpleadoId("");
            setSelectedEvaluacionId("");
            setRespuestas({});
            setComentario("");
        } else {
            alert("Ocurrió un error al enviar la evaluación.");
        }
        })
        .catch((error) => {
        console.error("Error al enviar la evaluación:", error);
        alert("Ocurrió un error al enviar la evaluación.");
        });
    };

    const handleSalir = () => {
        window.location.href = "/"; // Redirige a la página de inicio o login
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-extrabold text-blue-700 flex items-center gap-3">
                        <FaUserCheck className="text-green-500" /> Evaluación de Empleados
                    </h1>
                    <button onClick={handleSalir} className="text-red-500 font-bold hover:underline">Salir</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-semibold mb-1">Evaluador</label>
                        <input
                            type="text"
                            value={user?.username || ""}
                            disabled
                            className="w-full border p-3 rounded-lg shadow-sm"
                        />
                    </div>

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

                    {empleados.length > 0 && (
                        <div>
                            <label className="block font-semibold mb-1">Empleado</label>
                            <select
                                className="w-full border p-3 rounded-lg"
                                value={selectedEmpleadoId}
                                onChange={(e) => setSelectedEmpleadoId(Number(e.target.value))}
                            >
                                <option value="">Selecciona un empleado</option>
                                {empleados.map((e) => (
                                    <option key={e.id} value={e.id}>{`${e.nombre} ${e.apellido}`}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {evaluaciones.length > 0 && (
                        <div>
                            <label className="block font-semibold mb-1">Evaluación</label>
                            <select
                                className="w-full border p-3 rounded-lg"
                                value={selectedEvaluacionId}
                                onChange={(e) => setSelectedEvaluacionId(Number(e.target.value))}
                            >
                                <option value="">Selecciona una evaluación</option>
                                {evaluaciones.map((ev) => (
                                    <option key={ev.id} value={ev.id}>{ev.descripcion}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {preguntas.length > 0 && (
                        <div className="space-y-5">
                            {preguntas.map((p, idx) => (
                                <div key={p.id}>
                                    <label className="block text-gray-700 font-medium mb-1">{idx + 1}. {p.pregunta}</label>
                                    <select
                                        className="w-full border p-2 rounded-lg"
                                        value={respuestas[p.id] || ""}
                                        onChange={(e) => handleRespuesta(p.id.toString(), e.target.value)}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="1">1 - Muy bajo</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5 - Excelente</option>
                                    </select>
                                </div>
                            ))}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Comentario adicional</label>
                                <textarea
                                    className="w-full border p-2 rounded-lg"
                                    rows={3}
                                    value={Comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                    placeholder="Escribe tu comentario aquí..."
                                ></textarea>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow"
                    >
                        Enviar Evaluación
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaginaParaEvaluarEmpleado;
