"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  Edit3,
  Trash2,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  Search,
  FileText,
  Target,
  Database,
  BarChart3,
} from "lucide-react"

interface Dimension {
  id: number
  nombre: string
  descripcion: string
}

interface Pregunta {
  id: number
  texto: string
  idDim: Dimension
}

const API_PREGUNTAS_ALL = import.meta.env.VITE_API_URL_CLIMA_PREGUNTAS_ALL
const API_PREGUNTAS_UPDATE = import.meta.env.VITE_API_URL_CLIMA_PREGUNTAS_UPDATE
const API_PREGUNTAS_DELETE = import.meta.env.VITE_API_URL_CLIMA_PREGUNTAS_DELETE
const API_DIMENSIONES_ALL = import.meta.env.VITE_API_URL_CLIMA_DIMENSIONES_ALL

const EditarPreguntasClima: React.FC = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [filteredPreguntas, setFilteredPreguntas] = useState<Pregunta[]>([])
  const [dimensiones, setDimensiones] = useState<Dimension[]>([])
  const [editando, setEditando] = useState<Pregunta | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDimension, setSelectedDimension] = useState<string>("all")
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; pregunta: Pregunta | null }>({
    show: false,
    pregunta: null,
  })
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | null; message: string }>({
    type: null,
    message: "",
  })
  const [errors, setErrors] = useState<{ texto: string; dimension: string }>({
    texto: "",
    dimension: "",
  })

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [resPreg, resDim] = await Promise.all([axios.get(API_PREGUNTAS_ALL), axios.get(API_DIMENSIONES_ALL)])
      setPreguntas(resPreg.data)
      setFilteredPreguntas(resPreg.data)
      setDimensiones(resDim.data)

      if (resPreg.data.length === 0) {
        setAlert({
          type: "warning",
          message: "No hay preguntas registradas en el sistema.",
        })
      }
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error al cargar los datos del sistema.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    let filtered = preguntas

    if (searchTerm) {
      filtered = filtered.filter(
        (pregunta) =>
          pregunta.texto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pregunta.idDim.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDimension !== "all") {
      filtered = filtered.filter((pregunta) => pregunta.idDim.id.toString() === selectedDimension)
    }

    setFilteredPreguntas(filtered)
  }, [preguntas, searchTerm, selectedDimension])

  const validateForm = (pregunta: Pregunta) => {
    const newErrors = { texto: "", dimension: "" }

    if (!pregunta.texto.trim()) {
      newErrors.texto = "El texto de la pregunta es obligatorio"
    } else if (pregunta.texto.trim().length < 10) {
      newErrors.texto = "El texto debe tener al menos 10 caracteres"
    }

    if (!pregunta.idDim.id) {
      newErrors.dimension = "Debe seleccionar una dimensión"
    }

    setErrors(newErrors)
    return !newErrors.texto && !newErrors.dimension
  }

  const guardarCambios = async () => {
    if (!editando) return

    if (!validateForm(editando)) {
      setAlert({
        type: "error",
        message: "Por favor corrija los errores antes de continuar",
      })
      return
    }

    setSaving(true)
    setAlert({ type: null, message: "" })

    try {
      await axios.put(API_PREGUNTAS_UPDATE.replace("{id}", editando.id.toString()), {
        texto: editando.texto.trim(),
        idDim: { id: editando.idDim.id },
      })

      setAlert({
        type: "success",
        message: "Pregunta actualizada correctamente",
      })
      setEditando(null)
      setErrors({ texto: "", dimension: "" })
      cargarDatos()
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error al actualizar la pregunta",
      })
    } finally {
      setSaving(false)
    }
  }

  const eliminarPregunta = async () => {
    if (!showDeleteModal.pregunta) return

    setDeleting(showDeleteModal.pregunta.id)
    setAlert({ type: null, message: "" })

    try {
      await axios.delete(API_PREGUNTAS_DELETE.replace("{id}", showDeleteModal.pregunta.id.toString()))

      setAlert({
        type: "success",
        message: "Pregunta eliminada correctamente",
      })
      setShowDeleteModal({ show: false, pregunta: null })
      cargarDatos()
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error al eliminar la pregunta",
      })
    } finally {
      setDeleting(null)
    }
  }

  const clearAlert = () => {
    setAlert({ type: null, message: "" })
  }

  const cancelarEdicion = () => {
    setEditando(null)
    setErrors({ texto: "", dimension: "" })
  }

  const editarPregunta = (pregunta: Pregunta) => {
    setEditando(pregunta)
    // Scroll automático después de un pequeño delay para que el DOM se actualice
    setTimeout(() => {
      const element = document.getElementById(`pregunta-${pregunta.id}`)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        })
      }
    }, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando preguntas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Alerts */}
        <AnimatePresence>
          {alert.type && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg border flex items-center justify-between ${
                alert.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : alert.type === "warning"
                    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                    : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                {alert.type === "success" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : alert.type === "warning" ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="font-medium">{alert.message}</span>
              </div>
              <button onClick={clearAlert} className="hover:opacity-70 transition-opacity">
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-600 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Gestión de Preguntas</h1>
                <p className="text-gray-600 mt-1">Administre las preguntas del sistema de evaluación</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Preguntas</p>
                <p className="text-2xl font-semibold text-gray-900">{preguntas.length}</p>
              </div>
              <Database className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Edición</p>
                <p className="text-2xl font-semibold text-gray-900">{editando ? 1 : 0}</p>
              </div>
              <Edit3 className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dimensiones</p>
                <p className="text-2xl font-semibold text-gray-900">{dimensiones.length}</p>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filtradas</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredPreguntas.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar preguntas por texto o dimensión..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedDimension}
                onChange={(e) => setSelectedDimension(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none"
              >
                <option value="all">📋 Todas las dimensiones ({preguntas.length} preguntas)</option>
                {dimensiones.map((dimension) => {
                  const preguntasPorDimension = preguntas.filter((p) => p.idDim.id === dimension.id).length
                  return (
                    <option key={dimension.id} value={dimension.id.toString()}>
                      🎯 {dimension.nombre} ({preguntasPorDimension} preguntas)
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Resumen por Dimensiones */}
        {!editando && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Distribución de Preguntas por Dimensión</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dimensiones.map((dimension, index) => {
                const preguntasPorDimension = preguntas.filter((p) => p.idDim.id === dimension.id)
                const isSelected = selectedDimension === dimension.id.toString()
                return (
                  <motion.button
                    key={dimension.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDimension(dimension.id.toString())}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>
                        {dimension.nombre}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isSelected ? "bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {preguntasPorDimension.length} preguntas
                      </span>
                    </div>
                    <p className={`text-sm ${isSelected ? "text-emerald-700" : "text-gray-600"}`}>
                      {dimension.descripcion}
                    </p>
                    {preguntasPorDimension.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {preguntasPorDimension.slice(0, 2).map((pregunta) => (
                          <div
                            key={pregunta.id}
                            className={`text-xs p-2 rounded ${
                              isSelected ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            "{pregunta.texto.substring(0, 60)}..."
                          </div>
                        ))}
                        {preguntasPorDimension.length > 2 && (
                          <div className={`text-xs ${isSelected ? "text-emerald-600" : "text-gray-500"}`}>
                            +{preguntasPorDimension.length - 2} preguntas más
                          </div>
                        )}
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
            {selectedDimension !== "all" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedDimension("all")}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Ver todas las dimensiones
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Preguntas List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {filteredPreguntas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedDimension !== "all"
                  ? "No se encontraron preguntas"
                  : "No hay preguntas registradas"}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedDimension !== "all"
                  ? "Intente con otros criterios de búsqueda"
                  : "Registre la primera pregunta para comenzar"}
              </p>
            </div>
          ) : (
            filteredPreguntas.map((pregunta, index) => (
              <motion.div
                key={pregunta.id}
                id={`pregunta-${pregunta.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${editando?.id === pregunta.id ? "border-emerald-500 shadow-emerald-200" : ""}`}
              >
                {editando?.id === pregunta.id ? (
                  // Modo Edición
                  <div>
                    <div className="sticky top-0 z-10 bg-emerald-50 border-b border-emerald-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                            <Edit3 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Editando Pregunta</h3>
                            <p className="text-gray-600 text-sm">Modifique los datos de la pregunta</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={guardarCambios}
                            disabled={saving}
                            className="bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Guardando...</span>
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4" />
                                <span>Guardar</span>
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelarEdicion}
                            disabled={saving}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancelar
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Texto de la Pregunta</label>
                        <textarea
                          value={editando.texto}
                          onChange={(e) => setEditando({ ...editando, texto: e.target.value })}
                          rows={4}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none ${
                            errors.texto ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Ingrese el texto de la pregunta"
                        />
                        {errors.texto && (
                          <p className="text-red-600 text-sm flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.texto}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Dimensión</label>
                        <select
                          value={editando.idDim.id}
                          onChange={(e) => {
                            const selectedDim = dimensiones.find((d) => d.id === Number.parseInt(e.target.value))
                            if (selectedDim) {
                              setEditando({ ...editando, idDim: selectedDim })
                            }
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                            errors.dimension ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        >
                          <option value="">Seleccione una dimensión</option>
                          {dimensiones.map((dim) => (
                            <option key={dim.id} value={dim.id}>
                              {dim.nombre}
                            </option>
                          ))}
                        </select>
                        {errors.dimension && (
                          <p className="text-red-600 text-sm flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.dimension}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Modo Vista
                  <>
                    <div className="bg-gray-50 border-b border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Pregunta #{pregunta.id}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                {pregunta.idDim.nombre}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>Texto de la Pregunta</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                          {pregunta.texto}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span>Información de la Dimensión</span>
                        </h4>
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-200 text-emerald-800">
                              {pregunta.idDim.nombre}
                            </span>
                            <span className="text-sm text-emerald-600">
                              {preguntas.filter((p) => p.idDim.id === pregunta.idDim.id).length} preguntas en esta
                              dimensión
                            </span>
                          </div>
                          <p className="text-sm text-emerald-700">{pregunta.idDim.descripcion}</p>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => editarPregunta(pregunta)}
                          className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Editar</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowDeleteModal({ show: true, pregunta })}
                          disabled={deleting === pregunta.id}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {deleting === pregunta.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span>Eliminar</span>
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Delete Modal */}
        <AnimatePresence>
          {showDeleteModal.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
              >
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar Eliminación</h3>
                  <p className="text-gray-600 mb-6">
                    ¿Está seguro de que desea eliminar esta pregunta? Esta acción no se puede deshacer y eliminará todas
                    las respuestas asociadas.
                  </p>
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteModal({ show: false, pregunta: null })}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={eliminarPregunta}
                      disabled={deleting !== null}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Eliminando...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span>Eliminar</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EditarPreguntasClima
