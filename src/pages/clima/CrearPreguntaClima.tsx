"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  MessageSquare,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  HelpCircle,
  Lightbulb,
  Target,
  Sparkles,
  Heart,
  Star,
  ChevronDown,
  Eye,
  Plus,
} from "lucide-react"

interface Dimension {
  id: number
  nombre: string
  descripcion: string
}

const API_PREGUNTA_SAVE = import.meta.env.VITE_API_URL_CLIMA_PREGUNTAS_SAVE
const API_DIMENSIONES_ALL = import.meta.env.VITE_API_URL_CLIMA_DIMENSIONES_ALL

const CrearPreguntaClima: React.FC = () => {
  const [texto, setTexto] = useState("")
  const [dimensiones, setDimensiones] = useState<Dimension[]>([])
  const [dimensionSeleccionada, setDimensionSeleccionada] = useState<number | "">("")
  const [loading, setLoading] = useState(false)
  const [loadingDimensiones, setLoadingDimensiones] = useState(true)
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | null; message: string }>({
    type: null,
    message: "",
  })
  const [touched, setTouched] = useState({ texto: false, dimension: false })
  const [showPreview, setShowPreview] = useState(false)

  const isValidTexto = texto.trim().length >= 10
  const isValidDimension = dimensionSeleccionada !== ""

  useEffect(() => {
    setLoadingDimensiones(true)
    axios
      .get(API_DIMENSIONES_ALL)
      .then((res) => {
        setDimensiones(res.data)
        if (res.data.length === 0) {
          setAlert({
            type: "warning",
            message: "No hay dimensiones disponibles. Crea una dimensión primero.",
          })
        }
      })
      .catch((err) => {
        console.error(err)
        setAlert({
          type: "error",
          message: "No se pudieron cargar las dimensiones.",
        })
      })
      .finally(() => setLoadingDimensiones(false))
  }, [])

  const guardarPregunta = async () => {
    if (!isValidTexto) {
      setAlert({
        type: "error",
        message: "El texto de la pregunta debe tener al menos 10 caracteres",
      })
      return
    }

    if (!isValidDimension) {
      setAlert({
        type: "error",
        message: "Debes seleccionar una dimensión",
      })
      return
    }

    setLoading(true)
    setAlert({ type: null, message: "" })

    try {
      await axios.post(API_PREGUNTA_SAVE, {
        texto: texto.trim(),
        idDim: {
          id: dimensionSeleccionada,
        },
      })

      setAlert({
        type: "success",
        message: "¡Pregunta guardada exitosamente! 🎉",
      })
      setTexto("")
      setDimensionSeleccionada("")
      setTouched({ texto: false, dimension: false })
      setShowPreview(false)
    } catch (err) {
      console.error(err)
      setAlert({
        type: "error",
        message: "Error al guardar la pregunta. Intenta nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearAlert = () => {
    setAlert({ type: null, message: "" })
  }

  const handleTextoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTexto(e.target.value)
    if (!touched.texto) setTouched((prev) => ({ ...prev, texto: true }))
  }

  const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDimensionSeleccionada(Number(e.target.value) || "")
    if (!touched.dimension) setTouched((prev) => ({ ...prev, dimension: true }))
  }

  const getDimensionColor = (index: number) => {
    const colors = [
      "from-pink-400 to-rose-500",
      "from-purple-400 to-indigo-500",
      "from-blue-400 to-cyan-500",
      "from-green-400 to-emerald-500",
      "from-yellow-400 to-orange-500",
      "from-red-400 to-pink-500",
    ]
    return colors[index % colors.length]
  }

  const ejemplosPreguntas = [
    "¿Sientes que puedes proponer mejoras en tu área de trabajo?",
    "¿Consideras que la comunicación con tu jefe inmediato es efectiva?",
    "¿Te sientes valorado por el trabajo que realizas?",
    "¿Crees que existe un buen ambiente de trabajo en tu equipo?",
    "¿Tienes las herramientas necesarias para realizar tu trabajo?",
    "¿Sientes que tu opinión es tomada en cuenta en las decisiones?",
  ]

  const aplicarEjemplo = (ejemplo: string) => {
    setTexto(ejemplo)
    setTouched((prev) => ({ ...prev, texto: true }))
  }

  const dimensionSeleccionadaObj = dimensiones.find((d) => d.id === dimensionSeleccionada)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
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
                  : alert.type === "warning"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
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
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Crear Nueva Pregunta
          </h1>
          <p className="text-gray-600 text-lg">¡Diseña preguntas increíbles para evaluar el clima organizacional! 💖</p>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Información de la Pregunta</h2>
                      <p className="text-purple-100 mt-1">Completa los datos para crear una nueva pregunta</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Campo Texto */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                    <span>Texto de la Pregunta</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={texto}
                    onChange={handleTextoChange}
                    onBlur={() => setTouched((prev) => ({ ...prev, texto: true }))}
                    rows={4}
                    className={`w-full px-5 py-4 border rounded-2xl text-gray-700 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                      touched.texto && !isValidTexto
                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-purple-200 focus:ring-purple-500 bg-purple-50/30"
                    }`}
                    placeholder="Ej: ¿Sientes que puedes proponer mejoras en tu área de trabajo?"
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <AnimatePresence>
                      {touched.texto && !isValidTexto && (
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
                    <span className={`${texto.length >= 10 ? "text-green-600" : "text-gray-400"}`}>
                      {texto.length}/300
                    </span>
                  </div>
                </div>

                {/* Campo Dimensión */}
                <div className="space-y-2">
                  <label className="block text-gray-700 font-medium flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span>Dimensión</span>
                    <span className="text-red-500">*</span>
                  </label>
                  {loadingDimensiones ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                      <span className="ml-2 text-gray-600">Cargando dimensiones...</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={dimensionSeleccionada}
                        onChange={handleDimensionChange}
                        onBlur={() => setTouched((prev) => ({ ...prev, dimension: true }))}
                        className={`w-full px-5 py-4 border rounded-2xl text-gray-700 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                          touched.dimension && !isValidDimension
                            ? "border-red-300 focus:ring-red-500 bg-red-50"
                            : "border-purple-200 focus:ring-purple-500 bg-purple-50/30"
                        }`}
                        disabled={loading || dimensiones.length === 0}
                      >
                        <option value="">-- Selecciona una dimensión --</option>
                        {dimensiones.map((dim) => (
                          <option key={dim.id} value={dim.id}>
                            {dim.nombre}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  )}
                  <AnimatePresence>
                    {touched.dimension && !isValidDimension && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 flex items-center space-x-1 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>Debes seleccionar una dimensión</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dimensión Seleccionada Info */}
                <AnimatePresence>
                  {dimensionSeleccionadaObj && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{dimensionSeleccionadaObj.nombre}</h4>
                          <p className="text-sm text-gray-600 mt-1">{dimensionSeleccionadaObj.descripcion}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Preview */}
                <AnimatePresence>
                  {showPreview && texto.trim() && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                          <Eye className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-800">Vista Previa</h4>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <p className="text-gray-800 font-medium">{texto}</p>
                        <div className="flex space-x-2 mt-4">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <div
                              key={num}
                              className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border border-purple-200"
                            >
                              <span className="text-sm font-semibold text-purple-600">{num}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botón Guardar */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={guardarPregunta}
                  disabled={loading || !isValidTexto || !isValidDimension || dimensiones.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-xl flex items-center justify-center space-x-3 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Guardando pregunta...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-6 w-6" />
                      <span>Guardar Pregunta</span>
                      <Sparkles className="h-6 w-6" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Panel de Ayuda */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Ejemplos de Preguntas */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-cyan-100">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ejemplos de Preguntas</h3>
                    <p className="text-cyan-100 text-sm">Haz clic para usar como plantilla</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {ejemplosPreguntas.map((ejemplo, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => aplicarEjemplo(ejemplo)}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 text-sm"
                  >
                    <div className="flex items-start space-x-2">
                      <Plus className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{ejemplo}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Dimensiones Disponibles */}
            {!loadingDimensiones && dimensiones.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Dimensiones Disponibles</h3>
                      <p className="text-green-100 text-sm">{dimensiones.length} dimensiones</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                  {dimensiones.map((dimension, index) => (
                    <motion.div
                      key={dimension.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        dimensionSeleccionada === dimension.id
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`h-6 w-6 rounded-lg bg-gradient-to-br ${getDimensionColor(index)} flex items-center justify-center flex-shrink-0`}
                        >
                          <Star className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{dimension.nombre}</div>
                          <div className="text-xs text-gray-600 mt-1">{dimension.descripcion}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-yellow-100">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tips para crear preguntas</h3>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>Usa preguntas claras y específicas</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>Evita preguntas con doble negación</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>Enfócate en aspectos medibles</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500 font-bold">•</span>
                  <span>Usa un lenguaje comprensible</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CrearPreguntaClima
