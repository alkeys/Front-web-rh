
import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  Heart,
  Star,
  Smile,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
  X,
  Users,
  MessageSquare,
  TrendingUp,
  Sparkles,
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



const API_DIMENSIONES = import.meta.env.VITE_API_URL_CLIMA_DIMENSIONES_ALL
const API_PREGUNTAS = import.meta.env.VITE_API_URL_CLIMA_PREGUNTAS_BY_DIMENSION_ID
const API_RESPUESTAS = import.meta.env.VITE_API_URL_CLIMA_SAVE_RESPUESTAS

const ClimaForm: React.FC = () => {
  const [dimensiones, setDimensiones] = useState<Dimension[]>([])
  const [dimensionSeleccionada, setDimensionSeleccionada] = useState<number | null>(null)
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [respuestas, setRespuestas] = useState<Record<number, number>>({})
  const [enviando, setEnviando] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })

  useEffect(() => {
    axios.get(API_DIMENSIONES).then((res) => setDimensiones(res.data))
  }, [])

  useEffect(() => {
    if (dimensionSeleccionada) {
      const url = API_PREGUNTAS.replace("{dimensionId}", String(dimensionSeleccionada))
      axios.get(url).then((res) => {
        setPreguntas(res.data)
        setRespuestas({}) // Limpiar respuestas anteriores
      })
    }
  }, [dimensionSeleccionada])

  const handleChange = (idPregunta: number, valor: number) => {
    setRespuestas((prev) => ({ ...prev, [idPregunta]: valor }))
  }
  const enviarRespuestas = async () => {
    const ahora = new Date().toISOString()
    setEnviando(true)
    setAlert({ type: null, message: "" })

    try {
      for (const [id, valor] of Object.entries(respuestas)) {
        const payload = {
          idPregunta: { id: Number.parseInt(id) },
          calificacion: valor,
          fechaRespuesta: ahora,
        }

        await axios.post(API_RESPUESTAS, payload)
      }

      setAlert({
        type: "success",
        message: "¡Todas las respuestas fueron enviadas correctamente! 🎉",
      })
      setRespuestas({})
      window.scrollTo({ top: 0, behavior: "smooth" }) // Scroll to the top of the page
    } catch (err) {
      console.error("Error al enviar una respuesta:", err)
      setAlert({
        type: "error",
        message: "Hubo un error al enviar las respuestas. Intenta nuevamente.",
      })
    } finally {
      setEnviando(false)
    }
  }

  const clearAlert = () => {
    setAlert({ type: null, message: "" })
  }

  const getScaleColor = (value: number) => {
    const colors = [
      "from-red-400 to-pink-500", // 1
      "from-orange-400 to-red-500", // 2
      "from-yellow-400 to-orange-500", // 3
      "from-green-400 to-emerald-500", // 4
      "from-emerald-400 to-teal-500", // 5
    ]
    return colors[value - 1] || "from-gray-400 to-gray-500"
  }

  const getScaleEmoji = (value: number) => {
    const emojis = ["😞", "😕", "😐", "😊", "😍"]
    return emojis[value - 1] || "❓"
  }

  const getScaleText = (value: number) => {
    const texts = ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]
    return texts[value - 1] || ""
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

  const getCompletionPercentage = () => {
    if (preguntas.length === 0) return 0
    const respondidas = Object.keys(respuestas).length
    return Math.round((respondidas / preguntas.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-4">
      {/* boton para salir*/}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => window.history.back()}
          className="bg-white/80 hover:bg-white/90 text-gray-800 font-semibold py-2 px-4 rounded-full shadow-lg transition-colors"
        >
          Volver
        </button>
      </div>

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
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
              <Smile className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Encuesta de Clima Organizacional
          </h1>
          <p className="text-gray-600 text-lg">¡Tu opinión es súper importante para nosotros! 💖</p>
        </motion.div>

        {/* Dimension Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100 mb-8"
        >
          <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Selecciona una Dimensión</h2>
                <p className="text-pink-100 mt-1">Elige el área que quieres evaluar</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dimensiones.map((dim, index) => (
                <motion.button
                  key={dim.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDimensionSeleccionada(dim.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    dimensionSeleccionada === dim.id
                      ? `bg-gradient-to-br ${getDimensionColor(index)} text-white border-transparent shadow-lg`
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                        dimensionSeleccionada === dim.id ? "bg-white/20" : "bg-gray-200"
                      }`}
                    >
                      <Star className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{dim.nombre}</h3>
                  </div>
                  <p className={`text-sm ${dimensionSeleccionada === dim.id ? "text-white/90" : "text-gray-500"}`}>
                    {dim.descripcion}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Questions Section */}
        <AnimatePresence>
          {dimensionSeleccionada && preguntas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100"
            >
              <div className="bg-gradient-to-r from-purple-400 to-cyan-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Preguntas de Evaluación</h2>
                      <p className="text-purple-100 mt-1">
                        {dimensiones.find((d) => d.id === dimensionSeleccionada)?.nombre}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{getCompletionPercentage()}%</div>
                    <div className="text-purple-100 text-sm">Completado</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getCompletionPercentage()}%` }}
                    className="bg-white rounded-full h-2"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="p-6 space-y-6">
                {preguntas.map((pregunta, index) => (
                  <motion.div
                    key={pregunta.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-6 border border-purple-100"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium leading-relaxed">{pregunta.texto}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {[1, 2, 3, 4, 5].map((valor) => (
                        <motion.button
                          key={valor}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChange(pregunta.id, valor)}
                          className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                            respuestas[pregunta.id] === valor
                              ? `bg-gradient-to-br ${getScaleColor(valor)} text-white border-transparent shadow-lg`
                              : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{getScaleEmoji(valor)}</div>
                            <div className="font-semibold text-lg mb-1">{valor}</div>
                            <div className="text-xs leading-tight">{getScaleText(valor)}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: preguntas.length * 0.1 + 0.2 }}
                  className="pt-6 border-t border-purple-100"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={enviarRespuestas}
                    disabled={enviando || Object.keys(respuestas).length !== preguntas.length}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-xl flex items-center justify-center space-x-3 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {enviando ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Enviando respuestas...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6" />
                        <span>Enviar Respuestas</span>
                        <Sparkles className="h-6 w-6" />
                      </>
                    )}
                  </motion.button>

                  {Object.keys(respuestas).length !== preguntas.length && (
                    <p className="text-center text-gray-500 text-sm mt-3">
                      Responde todas las preguntas para continuar ({Object.keys(respuestas).length}/{preguntas.length})
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {dimensionSeleccionada && preguntas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center border border-yellow-100"
          >
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay preguntas disponibles</h3>
            <p className="text-gray-600">Esta dimensión aún no tiene preguntas configuradas.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ClimaForm
