"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ClipboardList,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  Save,
  Search,
  Info,
  PlusCircle,
} from "lucide-react"

interface Departamento {
  id: number
  nombre: string
}

const CrearEvaluacion: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [filtroDepartamento, setFiltroDepartamento] = useState("")
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<number | "">("")
  const [descripcion, setDescripcion] = useState<string>("")
  const [fecha, setFecha] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [evaluacionesRecientes, setEvaluacionesRecientes] = useState<{ descripcion: string; departamento: string }[]>(
    [],
  )

  const urlDepartamentos = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS
  const urlGuardarEvaluacion = import.meta.env.VITE_API_URL_SAVE_EVALUACION

  useEffect(() => {
    const fetchDepartamentos = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(urlDepartamentos)
        if (!response.ok) throw new Error("Error al cargar departamentos")
        const data = await response.json()
        setDepartamentos(data)
      } catch (error) {
        console.error("Error al cargar departamentos:", error)
        showNotification("error", "No se pudieron cargar los departamentos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartamentos()

    // Establecer la fecha actual como valor predeterminado
    const today = new Date()
    const formattedDate = today.toISOString().split("T")[0]
    setFecha(formattedDate)
  }, [])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!descripcion || !fecha || selectedDepartamentoId === "") {
      showNotification("error", "Por favor completa todos los campos")
      return
    }

    setIsSaving(true)
    try {
      const url =
        urlGuardarEvaluacion.replace("{idDepartamento}", String(selectedDepartamentoId)) +
        `?fecha=${fecha}&descripcion=${encodeURIComponent(descripcion)}`

      const response = await fetch(url, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Error al guardar la evaluación")

      // Guardar en evaluaciones recientes
      const departamentoSeleccionado = departamentos.find((d) => d.id === selectedDepartamentoId)
      if (departamentoSeleccionado) {
        setEvaluacionesRecientes((prev) => [
          {
            descripcion,
            departamento: departamentoSeleccionado.nombre,
          },
          ...prev.slice(0, 4), // Mantener solo las 5 más recientes
        ])
      }

      showNotification("success", "Evaluación creada exitosamente")

      // Limpiar campos después del éxito
      setDescripcion("")
      // No reseteamos la fecha ni el departamento para facilitar la creación de múltiples evaluaciones
    } catch (error) {
      console.error("Error al guardar la evaluación:", error)
      showNotification("error", "Error al guardar la evaluación")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredDepartamentos = departamentos.filter((dep) =>
    dep.nombre.toLowerCase().includes(filtroDepartamento.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-teal-600" />
              Crear Nueva Evaluación
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Lista de departamentos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-medium text-gray-700 flex items-center">
                  <Building className="mr-2 h-4 w-4 text-teal-600" />
                  Seleccionar departamento
                </h2>

                <div className="mt-3 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar departamento..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={filtroDepartamento}
                    onChange={(e) => setFiltroDepartamento(e.target.value)}
                  />
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : filteredDepartamentos.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {filteredDepartamentos.map((dep) => (
                      <motion.li
                        key={dep.id}
                        whileHover={{ backgroundColor: "rgba(240, 240, 240, 0.5)" }}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          selectedDepartamentoId === dep.id ? "bg-teal-50 border-l-4 border-teal-500" : ""
                        }`}
                        onClick={() => setSelectedDepartamentoId(dep.id)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              selectedDepartamentoId === dep.id
                                ? "bg-teal-100 text-teal-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {dep.nombre.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-800">{dep.nombre}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center">
                    <Building className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      {filtroDepartamento
                        ? "No se encontraron departamentos que coincidan con tu búsqueda"
                        : "No hay departamentos disponibles"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Evaluaciones recientes */}
            {evaluacionesRecientes.length > 0 && (
              <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-sm font-medium text-gray-700 flex items-center">
                    <ClipboardList className="mr-2 h-4 w-4 text-teal-600" />
                    Evaluaciones recientes
                  </h2>
                </div>
                <ul className="divide-y divide-gray-100">
                  {evaluacionesRecientes.map((item, index) => (
                    <li key={index} className="px-4 py-3">
                      <p className="text-sm text-gray-800 mb-1">{item.descripcion}</p>
                      <p className="text-xs text-gray-500">Departamento: {item.departamento}</p>
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
                  Nueva evaluación
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {selectedDepartamentoId ? (
                  <div className="mb-6 bg-teal-50 border border-teal-100 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-teal-800 mb-1">Departamento seleccionado</h3>
                    {(() => {
                      const dep = departamentos.find((d) => d.id === selectedDepartamentoId)
                      return dep ? (
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mr-3">
                            {dep.nombre.charAt(0)}
                          </div>
                          <p className="text-sm text-teal-700 font-medium">{dep.nombre}</p>
                        </div>
                      ) : null
                    })()}
                  </div>
                ) : (
                  <div className="mb-6 bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-amber-800 mb-1">Selecciona un departamento</h3>
                        <p className="text-xs text-amber-700">
                          Debes seleccionar un departamento de la lista para poder crear una evaluación
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-1">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                      Descripción de la evaluación
                    </label>
                    <input
                      id="descripcion"
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Ej. Evaluación de desempeño trimestral"
                      disabled={!selectedDepartamentoId}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Proporciona un nombre descriptivo para identificar fácilmente esta evaluación.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                      Fecha de la evaluación
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
                        disabled={!selectedDepartamentoId}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Fecha en la que se realizará o publicará la evaluación.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving || !selectedDepartamentoId || !descripcion.trim() || !fecha}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Crear Evaluación
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Guía de ayuda */}
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Acerca de las evaluaciones</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      Las evaluaciones permiten medir el desempeño de los empleados en diferentes áreas. Después de
                      crear una evaluación, podrás:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                      <li>Añadir preguntas específicas para esta evaluación</li>
                      <li>Asignar la evaluación a empleados del departamento</li>
                      <li>Establecer plazos para completar la evaluación</li>
                      <li>Revisar y analizar los resultados</li>
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

export default CrearEvaluacion
