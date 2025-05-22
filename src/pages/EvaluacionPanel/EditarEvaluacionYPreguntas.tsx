"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ClipboardEdit,
  Calendar,
  Save,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  FileQuestion,
  Search,
  CheckCircle2,
  Building,
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

interface Pregunta {
  id: number
  pregunta: string
}

const EditarEvaluaciones: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [filtroEvaluacion, setFiltroEvaluacion] = useState("")
  const [selectedEvaluacionId, setSelectedEvaluacionId] = useState<number | "">("")
  const [descripcion, setDescripcion] = useState<string>("")
  const [fecha, setFecha] = useState<string>("")
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [editandoPreguntaId, setEditandoPreguntaId] = useState<number | null>(null)
  const [nuevoTextoPregunta, setNuevoTextoPregunta] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [showConfirmDeletePregunta, setShowConfirmDeletePregunta] = useState<number | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const urlEvaluaciones = import.meta.env.VITE_API_URL_GET_EVALUACION_ALL
  const urlPreguntas = import.meta.env.VITE_API_URL_PREGUNTAS
  const urlUpdateEvaluacion = import.meta.env.VITE_API_URL_UPDATE_EVALUACION_DEPARTAMENTO
  const urlDeleteEvaluacion = import.meta.env.VITE_API_URL_DELETE_EVALUACION
  const urlDeletePregunta = import.meta.env.VITE_API_URL_DELETE_PREGUNTAS
  const urlUpdatePregunta = import.meta.env.VITE_API_URL_UPDATE_PREGUNTAS_EVALUACION

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(urlEvaluaciones)
        if (!res.ok) throw new Error("Error al cargar evaluaciones")
        const data = await res.json()
        setEvaluaciones(data)
      } catch (error) {
        console.error(error)
        showNotification("error", "Error al cargar las evaluaciones")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvaluaciones()
  }, [])

  useEffect(() => {
    if (selectedEvaluacionId !== "") {
      const fetchPreguntas = async () => {
        setIsLoading(true)
        try {
          const evaluacion = evaluaciones.find((e) => e.id === selectedEvaluacionId)
          if (evaluacion) {
            setDescripcion(evaluacion.descripcion)
            setFecha(evaluacion.fecha)

            const res = await fetch(urlPreguntas.replace("{evaluacionId}", String(selectedEvaluacionId)))
            if (!res.ok) throw new Error("Error al cargar preguntas")
            const data = await res.json()
            setPreguntas(data)
          }
        } catch (error) {
          console.error(error)
          showNotification("error", "Error al cargar las preguntas")
        } finally {
          setIsLoading(false)
        }
      }

      fetchPreguntas()
    } else {
      setDescripcion("")
      setFecha("")
      setPreguntas([])
    }
  }, [selectedEvaluacionId])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleActualizar = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!descripcion || !fecha || selectedEvaluacionId === "") {
      showNotification("error", "Por favor completa todos los campos")
      return
    }

    setIsSaving(true)
    try {
      const evaluacion = evaluaciones.find((e) => e.id === selectedEvaluacionId)
      if (!evaluacion) throw new Error("Evaluación no encontrada")

      const idDepartamento = evaluacion.departamento.id
      const url = urlUpdateEvaluacion
        .replace("{idDepartamento}", String(idDepartamento))
        .replace("{idEvaluacion}", String(selectedEvaluacionId))

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha, descripcion }),
      })

      if (!response.ok) throw new Error("Error al actualizar")

      // Actualizar la lista de evaluaciones
      setEvaluaciones((prev) => prev.map((e) => (e.id === selectedEvaluacionId ? { ...e, descripcion, fecha } : e)))

      showNotification("success", "Evaluación actualizada exitosamente")
    } catch (error) {
      console.error("Error al actualizar la evaluación:", error)
      showNotification("error", "Error al actualizar la evaluación")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBorrar = async () => {
    if (!selectedEvaluacionId) return

    setIsSaving(true)
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        const url = urlDeleteEvaluacion.replace("{id}", String(selectedEvaluacionId))
        const response = await fetch(url, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Error al eliminar")

        setEvaluaciones((prev) => prev.filter((e) => e.id !== selectedEvaluacionId))
        setSelectedEvaluacionId("")
        showNotification("success", "Evaluación eliminada exitosamente")
        break
      } catch (error) {
        attempts++
        console.error(`Intento ${attempts} - Error al eliminar:`, error)
        if (attempts >= maxAttempts) {
          showNotification("error", "Error al eliminar la evaluación después de varios intentos")
        }
      }
    }

    setIsSaving(false)
    setShowConfirmDelete(false)
  }

  const handleGuardarPregunta = async () => {
    if (!editandoPreguntaId || !nuevoTextoPregunta.trim()) return

    setIsSaving(true)
    try {
      const url = urlUpdatePregunta
        .replace("{evaluacionId}", String(selectedEvaluacionId))
        .replace("{preguntaId}", String(editandoPreguntaId))

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: nuevoTextoPregunta }),
      })

      if (!response.ok) throw new Error("Error al actualizar pregunta")

      setPreguntas((prev) =>
        prev.map((p) => (p.id === editandoPreguntaId ? { ...p, pregunta: nuevoTextoPregunta } : p)),
      )

      showNotification("success", "Pregunta actualizada correctamente")
    } catch (error) {
      console.error("Error al actualizar pregunta:", error)
      showNotification("error", "Error al actualizar la pregunta")
    } finally {
      setIsSaving(false)
      setEditandoPreguntaId(null)
      setNuevoTextoPregunta("")
    }
  }

  const handleEditarPregunta = (id: number, texto: string) => {
    setEditandoPreguntaId(id)
    setNuevoTextoPregunta(texto)
  }

  const handleBorrarPregunta = async (id: number) => {
    setIsSaving(true)
    try {
      const response = await fetch(urlDeletePregunta.replace("{id}", String(id)), {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Error al eliminar pregunta")

      setPreguntas((prev) => prev.filter((p) => p.id !== id))
      showNotification("success", "Pregunta eliminada correctamente")
    } catch (error) {
      console.error("Error eliminando pregunta:", error)
      showNotification("error", "Error al eliminar la pregunta")
    } finally {
      setIsSaving(false)
      setShowConfirmDeletePregunta(null)
    }
  }

  const filteredEvaluaciones = evaluaciones.filter(
    (ev) =>
      ev.descripcion.toLowerCase().includes(filtroEvaluacion.toLowerCase()) ||
      ev.departamento.nombre.toLowerCase().includes(filtroEvaluacion.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <ClipboardEdit className="mr-2 h-5 w-5 text-teal-600" />
              Gestión de Evaluaciones
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
                  <FileQuestion className="mr-2 h-4 w-4 text-teal-600" />
                  Evaluaciones disponibles
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
                {isLoading && !selectedEvaluacionId ? (
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
                            <span>{new Date(ev.fecha).toLocaleDateString()}</span>
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
          </div>

          {/* Contenido principal - Formulario de edición */}
          <div className="lg:col-span-2">
            {selectedEvaluacionId ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h2 className="text-sm font-medium text-gray-700 flex items-center">
                    <Edit className="mr-2 h-4 w-4 text-teal-600" />
                    Editar evaluación
                  </h2>

                  <button
                    type="button"
                    onClick={() => setSelectedEvaluacionId("")}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleActualizar} className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                        Descripción
                      </label>
                      <input
                        id="descripcion"
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción de la evaluación"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                        Fecha
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="fecha"
                          type="date"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          value={fecha}
                          onChange={(e) => setFecha(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Actualizar Evaluación
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmDelete(true)}
                        disabled={isSaving}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar Evaluación
                      </button>
                    </div>
                  </div>
                </form>

                {/* Sección de preguntas */}
                <div className="border-t border-gray-100">
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <FileQuestion className="mr-2 h-4 w-4 text-teal-600" />
                      Preguntas de la evaluación
                    </h3>

                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {preguntas.length} {preguntas.length === 1 ? "pregunta" : "preguntas"}
                    </span>
                  </div>

                  <div className="p-4">
                    {isLoading && selectedEvaluacionId ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                      </div>
                    ) : preguntas.length > 0 ? (
                      <ul className="space-y-3">
                        {preguntas.map((p) => (
                          <li
                            key={p.id}
                            className={`border rounded-lg overflow-hidden ${
                              editandoPreguntaId === p.id ? "border-teal-300 bg-teal-50" : "border-gray-200"
                            }`}
                          >
                            {editandoPreguntaId === p.id ? (
                              <div className="p-3">
                                <div className="flex items-center mb-2">
                                  <Edit className="h-4 w-4 text-teal-600 mr-2" />
                                  <span className="text-xs font-medium text-teal-600">Editando pregunta</span>
                                </div>
                                <textarea
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-3"
                                  value={nuevoTextoPregunta}
                                  onChange={(e) => setNuevoTextoPregunta(e.target.value)}
                                  rows={3}
                                  placeholder="Texto de la pregunta"
                                />
                                <div className="flex justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditandoPreguntaId(null)
                                      setNuevoTextoPregunta("")
                                    }}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                  >
                                    <X className="mr-1 h-3 w-3" />
                                    Cancelar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleGuardarPregunta}
                                    disabled={!nuevoTextoPregunta.trim() || isSaving}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isSaving ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                                    ) : (
                                      <Check className="mr-1 h-3 w-3" />
                                    )}
                                    Guardar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 flex justify-between items-start">
                                <div className="flex-1 pr-4">
                                  <p className="text-sm text-gray-800">{p.pregunta}</p>
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => handleEditarPregunta(p.id, p.pregunta)}
                                    className="p-1 rounded-md text-gray-400 hover:text-teal-600 hover:bg-teal-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmDeletePregunta(p.id)}
                                    className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8 px-4">
                        <FileQuestion className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">No hay preguntas asociadas a esta evaluación</p>
                        <p className="text-xs text-gray-400">
                          Las preguntas se pueden añadir desde la sección de creación de evaluaciones
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                <ClipboardEdit className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Selecciona una evaluación</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Elige una evaluación de la lista para ver y editar sus detalles y preguntas asociadas.
                </p>
              </div>
            )}
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

      {/* Modal de confirmación para borrar evaluación */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center mb-5">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">¿Eliminar esta evaluación?</h3>
                <p className="text-sm text-gray-500">
                  Esta acción eliminará permanentemente la evaluación y todas sus preguntas asociadas. Esta acción no se
                  puede deshacer.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleBorrar}
                  className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación para borrar pregunta */}
      <AnimatePresence>
        {showConfirmDeletePregunta !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center mb-5">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">¿Eliminar esta pregunta?</h3>
                <p className="text-sm text-gray-500">
                  Esta acción eliminará permanentemente la pregunta de la evaluación. Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmDeletePregunta(null)}
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleBorrarPregunta(showConfirmDeletePregunta)}
                  className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EditarEvaluaciones
