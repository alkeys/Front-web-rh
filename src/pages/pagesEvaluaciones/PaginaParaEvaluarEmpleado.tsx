"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useUserContext } from "../../context/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  UserCheck,
  Building,
  Users,
  ClipboardList,
  MessageSquare,
  Send,
  LogOut,
  Star,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react"

interface Departamento {
  id: number
  nombre: string
}

interface Empleado {
  id: number
  nombre: string
  apellido: string
}

interface Evaluacion {
  id: number
  descripcion: string
}

interface Pregunta {
  id: number
  pregunta: string
}

const PaginaParaEvaluarEmpleado: React.FC = () => {
  const { user } = useUserContext()

  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [selectedEvaluacionId, setSelectedEvaluacionId] = useState<number | "">("")
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<number | "">("")
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState<number | "">("")
  const [respuestas, setRespuestas] = useState<{ [key: string]: string }>({})
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [Comentario, setComentario] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const urlDepartamentos = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS
  const urlEmpleadosDepartamento = import.meta.env.VITE_API_URL_EMPLEADOS_DEPARTAMENTO_ID
  const urlEvaluacion = import.meta.env.VITE_API_URL_EVALUACIONES + "getEvaluacionByDepartamentoId/"
  const urlPreguntas = import.meta.env.VITE_API_URL_PREGUNTAS
  const urlSaveEvaluacion = import.meta.env.VITE_API_URL_SAVE_RESPUESTAS

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const questionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  }

  const notificationVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  useEffect(() => {
    fetch(urlDepartamentos)
      .then((res) => res.json())
      .then(setDepartamentos)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (selectedDepartamentoId !== "") {
      fetch(urlEmpleadosDepartamento.replace("{id}", selectedDepartamentoId.toString()), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then(setEmpleados)
        .catch(console.error)

      fetch(`${urlEvaluacion}${selectedDepartamentoId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then(setEvaluaciones)
        .catch(console.error)
    } else {
      setEmpleados([])
      setEvaluaciones([])
      setSelectedEvaluacionId("")
    }
  }, [selectedDepartamentoId])

  useEffect(() => {
    if (selectedEvaluacionId !== "") {
      fetch(urlPreguntas.replace("{evaluacionId}", selectedEvaluacionId.toString()), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map((p: any) => ({ id: p.id.toString(), pregunta: p.pregunta }))
          setPreguntas(formatted)
        })
        .catch(console.error)
    }
  }, [selectedEvaluacionId])

  const handleRespuesta = (pregunta: string, valor: string) => {
    setRespuestas((prev) => ({ ...prev, [pregunta]: valor }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    if (!selectedEmpleadoId || !selectedEvaluacionId) {
      showNotification("error", "Por favor selecciona un empleado y una evaluación antes de enviar.")
      setIsSubmitting(false)
      return
    }

    const fechaEvaluacion = new Date().toISOString().split("T")[0]

    try {
      const promises = preguntas.map((pregunta) => {
        const respuesta = respuestas[pregunta.id]
        if (!respuesta) {
          throw new Error(`Por favor responde todas las preguntas antes de enviar.`)
        }

        const calificacion = Number.parseInt(respuesta, 10)
        if (calificacion < 1 || calificacion > 5) {
          throw new Error(`La calificación para la pregunta "${pregunta.pregunta}" debe estar entre 1 y 5.`)
        }

        const comentario = encodeURIComponent(Comentario)
        const url =
          urlSaveEvaluacion
            .replace("{idPregunta}", pregunta.id)
            .replace("{idempleado}", selectedEmpleadoId.toString()) +
          `?calificacion=${calificacion}&comentario=${comentario}&fechaEvaluacion=${fechaEvaluacion}`

        return fetch(url, {
          method: "POST",
        })
      })

      const responses = await Promise.all(promises)

      if (responses.every((res) => res.ok)) {
        showNotification("success", "Evaluación enviada exitosamente.")
        setSelectedDepartamentoId("")
        setSelectedEmpleadoId("")
        setSelectedEvaluacionId("")
        setRespuestas({})
        setComentario("")
      } else {
        showNotification("error", "Ocurrió un error al enviar la evaluación.")
      }
    } catch (error: any) {
      console.error("Error al enviar la evaluación:", error)
      showNotification("error", error.message || "Ocurrió un error al enviar la evaluación.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSalir = () => {
    window.location.href = "/"
  }

  const getStarRating = (value: string) => {
    const rating = Number.parseInt(value)
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-200 shadow-sm py-4"
      >
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <UserCheck className="h-5 w-5 text-white" />
            </motion.div>
            <h1 className="text-xl font-bold text-gray-900">Evaluación de Empleados</h1>
          </div>
          <motion.button
            onClick={handleSalir}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Salir
          </motion.button>
        </div>
      </motion.header>

      {/* Notificaciones */}
      <AnimatePresence>
        {notification && (
          <motion.div
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
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

      {/* Main Content */}
      <main className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden"
        >
          {/* Card Header */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center">
              <motion.div
                className="flex items-center justify-center h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm mr-4"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <ClipboardList className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold">Sistema de Evaluación</h2>
                <p className="text-blue-100 text-sm">Complete la evaluación del empleado seleccionado</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Evaluador */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <UserCheck className="h-4 w-4 mr-1 text-blue-500" />
                  Evaluador
                </label>
                <input
                  type="text"
                  value={user?.username || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 shadow-sm"
                />
              </motion.div>

              {/* Departamento */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Building className="h-4 w-4 mr-1 text-blue-500" />
                  Departamento
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                    value={selectedDepartamentoId}
                    onChange={(e) => setSelectedDepartamentoId(Number(e.target.value))}
                  >
                    <option value="">Selecciona un departamento</option>
                    {departamentos.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>

              {/* Empleado */}
              <AnimatePresence>
                {empleados.length > 0 && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-blue-500" />
                      Empleado
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                        value={selectedEmpleadoId}
                        onChange={(e) => setSelectedEmpleadoId(Number(e.target.value))}
                      >
                        <option value="">Selecciona un empleado</option>
                        {empleados.map((e) => (
                          <option key={e.id} value={e.id}>
                            {`${e.nombre} ${e.apellido}`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Evaluación */}
              <AnimatePresence>
                {evaluaciones.length > 0 && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                      <ClipboardList className="h-4 w-4 mr-1 text-blue-500" />
                      Evaluación
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                        value={selectedEvaluacionId}
                        onChange={(e) => setSelectedEvaluacionId(Number(e.target.value))}
                      >
                        <option value="">Selecciona una evaluación</option>
                        {evaluaciones.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.descripcion}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Preguntas */}
              <AnimatePresence>
                {preguntas.length > 0 && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        Preguntas de Evaluación
                      </h3>
                      <div className="space-y-5">
                        {preguntas.map((p, idx) => (
                          <motion.div
                            key={p.id}
                            variants={questionVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <label className="block text-gray-700 font-medium mb-3">
                              {idx + 1}. {p.pregunta}
                            </label>
                            <div className="relative">
                              <select
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                                value={respuestas[p.id] || ""}
                                onChange={(e) => handleRespuesta(p.id.toString(), e.target.value)}
                              >
                                <option value="">Selecciona una calificación</option>
                                <option value="1">1 - Muy bajo</option>
                                <option value="2">2 - Bajo</option>
                                <option value="3">3 - Regular</option>
                                <option value="4">4 - Bueno</option>
                                <option value="5">5 - Excelente</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            {respuestas[p.id] && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center mt-2"
                              >
                                <span className="text-sm text-gray-600 mr-2">Calificación:</span>
                                <div className="flex">{getStarRating(respuestas[p.id])}</div>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}

                        {/* Comentario */}
                        <motion.div
                          variants={questionVariants}
                          initial="hidden"
                          animate="visible"
                          className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                        >
                          <label className="block text-gray-700 font-medium mb-3 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
                            Comentario adicional
                          </label>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                            rows={4}
                            value={Comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Escribe tu comentario aquí... (opcional)"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-6 border-t border-gray-200">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || preguntas.length === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Enviando evaluación...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Enviar Evaluación
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default PaginaParaEvaluarEmpleado
