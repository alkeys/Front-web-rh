"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  Sparkles,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Target,
  FileText,
  Lightbulb,
  Heart,
  Star,
} from "lucide-react"

const API_DIMENSIONES_SAVE = import.meta.env.VITE_API_URL_CLIMA_DIMENSIONES_SAVE

const CrearDimension: React.FC = () => {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [touched, setTouched] = useState({ nombre: false, descripcion: false })

  const isValidNombre = nombre.trim().length >= 3
  const isValidDescripcion = descripcion.trim().length >= 10

  const guardarDimension = async () => {
    if (!isValidNombre) {
      setAlert({
        type: "error",
        message: "El nombre debe tener al menos 3 caracteres",
      })
      return
    }

    if (!isValidDescripcion) {
      setAlert({
        type: "error",
        message: "La descripción debe tener al menos 10 caracteres",
      })
      return
    }

    setLoading(true)
    setAlert({ type: null, message: "" })

    try {
      const respuesta = await axios.post(API_DIMENSIONES_SAVE, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
      })

      if (respuesta.status === 200 || respuesta.status === 201) {
        setAlert({
          type: "success",
          message: "¡Dimensión guardada exitosamente! 🎉",
        })
        setNombre("")
        setDescripcion("")
        setTouched({ nombre: false, descripcion: false })
      } else {
        throw new Error("Error en la respuesta del servidor")
      }
    } catch (error) {
      console.error("Error al guardar dimensión:", error)
      setAlert({
        type: "error",
        message: "Error al guardar la dimensión. Intenta nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearAlert = () => {
    setAlert({ type: null, message: "" })
  }

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value)
    if (!touched.nombre) setTouched((prev) => ({ ...prev, nombre: true }))
  }

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescripcion(e.target.value)
    if (!touched.descripcion) setTouched((prev) => ({ ...prev, descripcion: true }))
  }

  const ejemplosDimensiones = [
    { nombre: "Cooperación", descripcion: "Trabajo en equipo y colaboración entre compañeros" },
    { nombre: "Comunicación", descripcion: "Claridad y efectividad en la comunicación organizacional" },
    { nombre: "Liderazgo", descripcion: "Calidad del liderazgo y dirección en la organización" },
    { nombre: "Reconocimiento", descripcion: "Valoración y reconocimiento del trabajo realizado" },
  ]

  const [ejemploSeleccionado, setEjemploSeleccionado] = useState<number | null>(null)

  const aplicarEjemplo = (ejemplo: { nombre: string; descripcion: string }) => {
    setNombre(ejemplo.nombre)
    setDescripcion(ejemplo.descripcion)
    setTouched({ nombre: true, descripcion: true })
    setEjemploSeleccionado(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Alerts */}
        <AnimatePresence>
          {alert.type && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-2xl flex items-center justify-between ${
                alert.type === "success"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white"
                  : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
              } shadow-lg`}
            >
              <div className="flex items-center space-x-3">
                {alert.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <span className="font-medium">{alert.message}</span>
              </div>
              <button onClick={clearAlert} className="text-white hover:text-white/80 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Crear Nueva Dimensión
          </h1>
          <p className="text-gray-600 text-lg">¡Añade una nueva dimensión para evaluar el clima organizacional! 💖</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Información de la Dimensión</h2>
                    <p className="text-purple-100 mt-1">Completa los datos para crear una nueva dimensión</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Campo Nombre */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium flex items-center space-x-2">
                    <Star className="h-4 w-4 text-purple-500" />
                    <span>Nombre de la Dimensión</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={handleNombreChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, nombre: true }))}
                    className={`w-full px-5 py-4 border rounded-2xl text-gray-700 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      touched.nombre && !isValidNombre
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-purple-200 focus:ring-purple-500 bg-purple-50/30"
                    }`}
                    placeholder="Ej: Cooperación, Comunicación, Liderazgo..."
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <AnimatePresence>
                      {touched.nombre && !isValidNombre && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-red-500 flex items-center space-x-1"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>Mínimo 3 caracteres</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <span className={`${nombre.length >= 3 ? "text-green-600" : "text-gray-400"}`}>
                      {nombre.length}/50
                    </span>
                  </div>
                </div>

                {/* Campo Descripción */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span>Descripción</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={handleDescripcionChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, descripcion: true }))}
                    rows={5}
                    className={`w-full px-5 py-4 border rounded-2xl text-gray-700 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                      touched.descripcion && !isValidDescripcion
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-purple-200 focus:ring-purple-500 bg-purple-50/30"
                    }`}
                    placeholder="Describe qué aspectos del clima organizacional evaluará esta dimensión..."
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <AnimatePresence>
                      {touched.descripcion && !isValidDescripcion && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-red-500 flex items-center space-x-1"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>Mínimo 10 caracteres</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <span className={`${descripcion.length >= 10 ? "text-green-600" : "text-gray-400"}`}>
                      {descripcion.length}/500
                    </span>
                  </div>
                </div>

                {/* Botón Guardar */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={guardarDimension}
                  disabled={loading || !isValidNombre || !isValidDescripcion}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-xl flex items-center justify-center space-x-3 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Guardando dimensión...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6" />
                      <span>Guardar Dimensión</span>
                      <Sparkles className="h-6 w-6" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Panel de Ejemplos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Ejemplos de Dimensiones */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-cyan-100">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ejemplos de Dimensiones</h3>
                    <p className="text-cyan-100 text-sm">Haz clic para usar como plantilla</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {ejemplosDimensiones.map((ejemplo, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => aplicarEjemplo(ejemplo)}
                    className="w-full text-left p-4 rounded-2xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200"
                  >
                    <div className="font-semibold text-gray-800 mb-1">{ejemplo.nombre}</div>
                    <div className="text-sm text-gray-600">{ejemplo.descripcion}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-yellow-100">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tips para crear dimensiones</h3>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>Usa nombres claros y específicos</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>La descripción debe explicar qué se evaluará</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>Piensa en aspectos medibles del clima laboral</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>Evita dimensiones muy amplias o vagas</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CrearDimension
