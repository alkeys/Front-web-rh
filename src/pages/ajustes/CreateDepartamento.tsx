"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building, Check, AlertCircle, Loader2, X } from "lucide-react"

const CreateDepartamento: React.FC = () => {
  const [nombre, setNombre] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [touched, setTouched] = useState(false)
  const url = import.meta.env.VITE_API_URL_GET_DEPARTAMENTO_CREATE_Departamento

  const isValid = nombre.trim().length >= 3

  const handleSubmit = async () => {
    if (!isValid) {
      setAlert({
        type: "error",
        message: "El nombre debe tener al menos 3 caracteres",
      })
      return
    }

    setIsLoading(true)
    setAlert({ type: null, message: "" })

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Success:", data)
      setNombre("")
      setTouched(false)
      setAlert({
        type: "success",
        message: "¡Departamento creado correctamente!",
      })
    } catch (error) {
      console.error("Error en la petición:", error)
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Error al crear el departamento",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearAlert = () => {
    setAlert({ type: null, message: "" })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {alert.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-2xl flex items-center justify-between ${
              alert.type === "success"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                : "bg-gradient-to-r from-red-500 to-orange-600 text-white"
            } shadow-lg`}
          >
            <div className="flex items-center space-x-3">
              {alert.type === "success" ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <AlertCircle className="h-5 w-5 text-white" />
              )}
              <span className="font-medium">{alert.message}</span>
            </div>
            <button onClick={clearAlert} className="text-white hover:text-white/80 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-100"
      >
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Crear Nuevo Departamento</h2>
              <p className="text-teal-100 mt-1">Añade un nuevo departamento a tu organización</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-gray-700 font-medium">
                Nombre del Departamento
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Ej: Recursos Humanos, Marketing, Ventas..."
                  className={`w-full px-5 py-4 border rounded-2xl text-gray-700 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    touched && !isValid
                      ? "border-red-300 focus:ring-red-500 bg-red-50"
                      : "border-teal-200 focus:ring-teal-500 bg-teal-50/30"
                  }`}
                  disabled={isLoading}
                />
                {touched && !isValid && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
              <AnimatePresence>
                {touched && !isValid && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    El nombre debe tener al menos 3 caracteres
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creando departamento...</span>
                </>
              ) : (
                <>
                  <Building className="h-5 w-5" />
                  <span>Crear Departamento</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="mt-8 bg-teal-50 rounded-2xl p-4 border border-teal-100">
            <p className="text-sm text-teal-700">
              <span className="font-medium">Nota:</span> Los departamentos creados estarán disponibles inmediatamente
              para asignar a los trabajadores y organizar la estructura de tu empresa.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CreateDepartamento
