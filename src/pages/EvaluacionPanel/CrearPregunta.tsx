"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileQuestion,
  Search,
  PlusCircle,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react"

interface Evaluacion {
  id: number
  descripcion: string
  fecha: string
  departamento: {
    id: number
    nombre: string
  }
}

const CrearPregunta: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [filtroEvaluacion, setFiltroEvaluacion] = useState("")
  const [selectedEvaluacionId, setSelectedEvaluacionId] = useState<number | "">("")
  const [pregunta, setPregunta] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [preguntasRecientes, setPreguntasRecientes] = useState<{ texto: string; evaluacion: string }[]>([])

  const urlGetEvaluaciones = import.meta.env.VITE_API_URL_GET_EVALUACION_ALL
  const urlSavePregunta = import.meta.env.VITE_API_URL_SAVE_PREGUNTAS

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(urlGetEvaluaciones)
        if (!response.ok) throw new Error("Error al cargar evaluaciones")
        const data = await response.json()
        setEvaluaciones(data)
      } catch (error) {
        console.error("Error al cargar evaluaciones:", error)
        showNotification("error", "No se pudieron cargar las evaluaciones")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvaluaciones()
  }, [])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvaluacionId || pregunta.trim() === "") {
      showNotification("error", "Por favor, selecciona una evaluación y escribe la pregunta")
      return
    }

    setIsSaving(true)
    try {
      const url =
        urlSavePregunta.replace("{evaluacionId}", selectedEvaluacionId.toString()) +
        `?pregunta=${encodeURIComponent(pregunta)}`

      const response = await fetch(url, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Error al guardar la pregunta")

      // Guardar en preguntas recientes
      const evaluacionSeleccionada = evaluaciones.find((ev) => ev.id === selectedEvaluacionId)
      if (evaluacionSeleccionada) {
        setPreguntasRecientes((prev) => [
          {
            texto: pregunta,
            evaluacion: evaluacionSeleccionada.descripcion,
          },
          ...prev.slice(0, 4), // Mantener solo las 5 más recientes
        ])
      }

      showNotification("success", "Pregunta guardada exitosamente")
      setPregunta("")
    } catch (error) {
      console.error("Error al enviar:", error)
      showNotification("error", "Error al guardar la pregunta")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredEvaluaciones = evaluaciones.filter(
    (ev) =>
      ev.descripcion.toLowerCase().includes(filtroEvaluacion.toLowerCase()) ||
      ev.departamento.nombre.toLowerCase().includes(filtroEvaluacion.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <FileQuestion className="mr-2 h-5 w-5 text-teal-600" />
              Crear Pregunta de Evaluación
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Lista de evaluaciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-700 flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4 text-teal-600" />
                  Seleccionar evaluación
                </h2>

                <div className="mt-3 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar evaluación..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={filtroEvaluacion}
                    onChange={(e) => setFiltroEvaluacion(e.target.value)}
                  />
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : filteredEvaluaciones.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredEvaluaciones.map((ev) => (
                      <motion.li
                        key={ev.id}
                        whileHover={{ backgroundColor: "rgba(240, 240, 240, 0.5)" }}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          selectedEvaluacionId === ev.id ? "bg-teal-50 border-l-4 border-teal-500" : ""
                        }`}
                        onClick={() => setSelectedEvaluacionId(ev.id)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{ev.descripcion}</span>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Building className="h-3 w-3 mr-1" />
                            <span>{ev.departamento.nombre}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(ev.fecha)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center">
                    <FileQuestion className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      {filtroEvaluacion
                        ? "No se encontraron evaluaciones que coincidan con tu búsqueda"
                        : "No hay evaluaciones disponibles"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Preguntas recientes */}
            {preguntasRecientes.length > 0 && (
              <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-sm font-medium text-gray-700 flex items-center">
                    <FileQuestion className="mr-2 h-4 w-4 text-teal-600" />
                    Preguntas recientes
                  </h2>
                </div>
                <ul className="divide-y divide-gray-100">
                  {preguntasRecientes.map((item, index) => (
                    <li key={index} className="px-4 py-3">
                      <p className="text-sm text-gray-800 mb-1">{item.texto}</p>
                      <p className="text-xs text-gray-500">Evaluación: {item.evaluacion}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Formulario de creación */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-700 flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4 text-teal-600" />
                  Nueva pregunta
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {selectedEvaluacionId ? (
                  <div className="mb-6 bg-teal-50 border border-teal-100 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-teal-800 mb-1">Evaluación seleccionada</h3>
                    {(() => {
                      const ev = evaluaciones.find((e) => e.id === selectedEvaluacionId)
                      return ev ? (
                        <div>
                          <p className="text-sm text-teal-700 font-medium">{ev.descripcion}</p>
                          <div className="flex items-center mt-1 text-xs text-teal-600">
                            <Building className="h-3 w-3 mr-1" />
                            <span>{ev.departamento.nombre}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(ev.fecha)}</span>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                ) : (
                  <div className="mb-6 bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-amber-800 mb-1">Selecciona una evaluación</h3>
                        <p className="text-xs text-amber-700">
                          Debes seleccionar una evaluación de la lista para poder crear una pregunta
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-1">
                    <label htmlFor="pregunta" className="block text-sm font-medium text-gray-700">
                      Texto de la pregunta
                    </label>
                    <textarea
                      id="pregunta"
                      rows={4}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      value={pregunta}
                      onChange={(e) => setPregunta(e.target.value)}
                      placeholder="Escribe aquí la pregunta para la evaluación..."
                      disabled={!selectedEvaluacionId}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      La pregunta debe ser clara y específica para obtener respuestas útiles.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving || !selectedEvaluacionId || !pregunta.trim()}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Guardar Pregunta
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Guía de ayuda */}
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Consejos para crear buenas preguntas</h3>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                      <li>Utiliza un lenguaje claro y directo</li>
                      <li>Evita preguntas con respuestas de sí/no</li>
                      <li>Enfócate en aspectos específicos del desempeño</li>
                      <li>Considera incluir ejemplos para mayor claridad</li>
                      <li>Asegúrate de que la pregunta sea relevante para el departamento</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              )}
              <p
                className={`text-sm font-medium ${notification.type === "success" ? "text-green-800" : "text-red-800"}`}
              >
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CrearPregunta
