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
  Target,
  Search,
  FileText,
  Calendar,
  Settings,
  Database,
  BarChart3,
} from "lucide-react"

interface Dimension {
  id: number
  nombre: string
  descripcion: string
}

const API_DIMENSIONES_ALL = import.meta.env.VITE_API_URL_CLIMA_DIMENSIONES_ALL
const API_DIMENSIONES_UPDATE = import.meta.env.VITE_API_URL_CLIMA_DIMENSIONES_UPDATE
const API_DIMENSIONES_DELETE = import.meta.env.VITE_API_URL_CLIMA_DIMENSIONES_DELETE

const EditarDimensiones: React.FC = () => {
  const [dimensiones, setDimensiones] = useState<Dimension[]>([])
  const [filteredDimensiones, setFilteredDimensiones] = useState<Dimension[]>([])
  const [editando, setEditando] = useState<Dimension | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean; dimension: Dimension | null }>({
    show: false,
    dimension: null,
  })
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | null; message: string }>({
    type: null,
    message: "",
  })
  const [errors, setErrors] = useState<{ nombre: string; descripcion: string }>({
    nombre: "",
    descripcion: "",
  })

  const cargarDimensiones = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API_DIMENSIONES_ALL)
      setDimensiones(res.data)
      setFilteredDimensiones(res.data)
      if (res.data.length === 0) {
        setAlert({
          type: "warning",
          message: "No hay dimensiones registradas en el sistema.",
        })
      }
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error al cargar las dimensiones del sistema.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDimensiones()
  }, [])

  useEffect(() => {
    const filtered = dimensiones.filter(
      (dim) =>
        dim.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dim.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredDimensiones(filtered)
  }, [dimensiones, searchTerm])

  const validateForm = (dimension: Dimension) => {
    const newErrors = { nombre: "", descripcion: "" }

    if (!dimension.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    } else if (dimension.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres"
    }

    if (!dimension.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria"
    } else if (dimension.descripcion.trim().length < 10) {
      newErrors.descripcion = "La descripción debe tener al menos 10 caracteres"
    }

    setErrors(newErrors)
    return !newErrors.nombre && !newErrors.descripcion
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
      await axios.put(API_DIMENSIONES_UPDATE.replace("{id}", editando.id.toString()), {
        nombre: editando.nombre.trim(),
        descripcion: editando.descripcion.trim(),
      })

      setAlert({
        type: "success",
        message: "Dimensión actualizada correctamente",
      })
      setEditando(null)
      setErrors({ nombre: "", descripcion: "" })
      cargarDimensiones()
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error al actualizar la dimensión",
      })
    } finally {
      setSaving(false)
    }
  }

  const eliminarDimension = async () => {
    if (!showDeleteModal.dimension) return

    setDeleting(showDeleteModal.dimension.id)
    setAlert({ type: null, message: "" })

    try {
      await axios.delete(API_DIMENSIONES_DELETE.replace("{id}", showDeleteModal.dimension.id.toString()))

      setAlert({
        type: "success",
        message: "Dimensión eliminada correctamente",
      })
      setShowDeleteModal({ show: false, dimension: null })
      cargarDimensiones()
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error al eliminar la dimensión",
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
    setErrors({ nombre: "", descripcion: "" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando dimensiones...</p>
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
                  ? "bg-green-50 border-green-200 text-green-800"
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
              <div className="h-12 w-12 rounded-lg bg-gray-900 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Gestión de Dimensiones</h1>
                <p className="text-gray-600 mt-1">Administre las dimensiones del sistema de evaluación</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Dimensiones</p>
                <p className="text-2xl font-semibold text-gray-900">{dimensiones.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Resultados Filtrados</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredDimensiones.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar dimensiones por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
            />
          </div>
        </motion.div>

        {/* Dimensiones List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {filteredDimensiones.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No se encontraron dimensiones" : "No hay dimensiones registradas"}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? "Intente con otros términos de búsqueda" : "Registre la primera dimensión para comenzar"}
              </p>
            </div>
          ) : (
            filteredDimensiones.map((dimension, index) => (
              <motion.div
                key={dimension.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {editando?.id === dimension.id ? (
                  // Modo Edición
                  <div>
                    <div className="bg-gray-50 border-b border-gray-200 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                          <Edit3 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Editando Dimensión</h3>
                          <p className="text-gray-600 text-sm">Modifique los datos de la dimensión</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Nombre de la Dimensión</label>
                        <input
                          type="text"
                          value={editando.nombre}
                          onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors ${
                            errors.nombre ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Ingrese el nombre de la dimensión"
                        />
                        {errors.nombre && (
                          <p className="text-red-600 text-sm flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.nombre}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                          value={editando.descripcion}
                          onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
                          rows={4}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors resize-none ${
                            errors.descripcion ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="Ingrese la descripción de la dimensión"
                        />
                        {errors.descripcion && (
                          <p className="text-red-600 text-sm flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.descripcion}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-4 pt-4 border-t border-gray-200">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={guardarCambios}
                          disabled={saving}
                          className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Guardando...</span>
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              <span>Guardar Cambios</span>
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={cancelarEdicion}
                          disabled={saving}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Cancelar
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Modo Vista
                  <>
                    <div className="bg-gray-50 border-b border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{dimension.nombre}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">ID: {dimension.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>Descripción</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                          {dimension.descripcion}
                        </p>
                      </div>

                      <div className="flex space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEditando(dimension)}
                          className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Editar</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowDeleteModal({ show: true, dimension })}
                          disabled={deleting === dimension.id}
                          className="px-6 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                          {deleting === dimension.id ? (
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
                    ¿Está seguro de que desea eliminar la dimensión{" "}
                    <span className="font-medium text-gray-900">"{showDeleteModal.dimension?.nombre}"</span>? Esta
                    acción no se puede deshacer y eliminará todas las preguntas asociadas.
                  </p>
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteModal({ show: false, dimension: null })}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={eliminarDimension}
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

export default EditarDimensiones
