"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Check, User, Mail, Lock, Shield, Loader2, AlertCircle, EyeOff, Eye, CheckCircle2, XCircle, Info } from 'lucide-react'

const CrearUsuario: React.FC = () => {
  const urlsave = import.meta.env.VITE_API_URL_SAVE_USER

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rol: "",
    activo: true,
    email: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Función para mostrar toast
  const showToastMessage = (title: string, message: string, type: string) => {
    setToastMessage({ title, message, type })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Efecto para animación de desvanecimiento del toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { name: string; value: boolean | string },
  ) => {
    const name = "name" in e ? e.name : e.target.name
    const value = "value" in e ? e.value : e.target.type === "checkbox" ? e.target.checked : e.target.value

    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar mensajes de error cuando el usuario comienza a escribir
    if (error) setError(null)
  }

  const handleFocus = (field: string) => {
    setFocusedField(field)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await axios.post(urlsave, formData)
      setSuccess(true)
      showToastMessage("¡Éxito!", "Usuario creado correctamente", "success")

      // Resetear el formulario después de 1.5 segundos
      setTimeout(() => {
        setFormData({
          username: "",
          password: "",
          rol: "",
          activo: true,
          email: "",
        })
        setSuccess(false)
      }, 1500)
    } catch (error: any) {
      console.error("Error al crear el usuario:", error)
      setError(error.response?.data?.message || "Hubo un error al guardar el usuario. Por favor, inténtalo de nuevo.")
      showToastMessage("Error", "No se pudo crear el usuario", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Lista de roles predefinidos
  const roles = ["Administrador", "EmpleadoRH", "Evaluador","EmpleadoEV"]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">


      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl max-w-md ${
              toastMessage.type === "error"
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : "bg-gradient-to-r from-green-500 to-green-600"
            } text-white backdrop-blur-sm border border-white/10`}
          >
            <div className="flex items-center">
              {toastMessage.type === "error" ? (
                <XCircle className="h-6 w-6 mr-3 text-white" />
              ) : (
                <CheckCircle2 className="h-6 w-6 mr-3 text-white" />
              )}
              <div>
                <h4 className="font-bold text-lg">{toastMessage.title}</h4>
                <p className="text-sm opacity-90">{toastMessage.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
     

          {/* Form Card */}
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
              <div className="flex items-center">
                <motion.div
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm mr-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <User className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-semibold">Información del Usuario</h2>
                  <p className="text-purple-100 text-sm">Todos los campos marcados con * son obligatorios</p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded-xl"
                  >
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username field */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-purple-500" />
                      <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Nombre de usuario *
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={() => handleFocus("username")}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border ${
                          focusedField === "username" ? "border-purple-400 ring-2 ring-purple-100" : "border-gray-200"
                        } rounded-xl focus:outline-none transition-all duration-200 bg-gray-50/50`}
                        placeholder="Ingresa el nombre de usuario"
                        required
                      />
                      <AnimatePresence>
                        {formData.username && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                          >
                            <Check className="h-5 w-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-purple-500" />
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo electrónico *
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border ${
                          focusedField === "email" ? "border-purple-400 ring-2 ring-purple-100" : "border-gray-200"
                        } rounded-xl focus:outline-none transition-all duration-200 bg-gray-50/50`}
                        placeholder="ejemplo@correo.com"
                        required
                      />
                      <AnimatePresence>
                        {formData.email && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                          >
                            <Check className="h-5 w-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-purple-500" />
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Contraseña *
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => handleFocus("password")}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border ${
                          focusedField === "password" ? "border-purple-400 ring-2 ring-purple-100" : "border-gray-200"
                        } rounded-xl focus:outline-none transition-all duration-200 bg-gray-50/50 pr-10`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          <div
                            className={`h-1 flex-1 rounded-full ${
                              formData.password.length > 0 ? "bg-red-400" : "bg-gray-200"
                            }`}
                          ></div>
                          <div
                            className={`h-1 flex-1 rounded-full ${
                              formData.password.length >= 6 ? "bg-yellow-400" : "bg-gray-200"
                            }`}
                          ></div>
                          <div
                            className={`h-1 flex-1 rounded-full ${
                              formData.password.length >= 8 ? "bg-green-400" : "bg-gray-200"
                            }`}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formData.password.length < 6
                            ? "Contraseña débil"
                            : formData.password.length < 8
                              ? "Contraseña media"
                              : "Contraseña fuerte"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Role field */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-purple-500" />
                      <label htmlFor="rol" className="text-sm font-medium text-gray-700">
                        Rol *
                      </label>
                    </div>
                    <div className="relative">
                      <select
                        id="rol"
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        onFocus={() => handleFocus("rol")}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border ${
                          focusedField === "rol" ? "border-purple-400 ring-2 ring-purple-100" : "border-gray-200"
                        } rounded-xl focus:outline-none transition-all duration-200 bg-gray-50/50 appearance-none`}
                        required
                      >
                        <option value="" disabled>
                          Selecciona un rol
                        </option>
                        {roles.map((rol) => (
                          <option key={rol} value={rol}>
                            {rol}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active switch */}
                <div className="flex items-center justify-between pt-2 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="activo"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        onClick={() => handleChange({ name: "activo", value: !formData.activo })}
                        className={`block h-7 w-12 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                          formData.activo ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out shadow-md ${
                            formData.activo ? "transform translate-x-5" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                        Usuario activo
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.activo ? "El usuario podrá acceder al sistema" : "El usuario estará deshabilitado"}
                      </p>
                    </div>
                  </div>
                  <Info className="h-5 w-5 text-purple-400" />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 ${
                      isSubmitting || !formData.username || !formData.email || !formData.password || !formData.rol
                        ? "bg-gray-400 cursor-not-allowed opacity-70"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-200"
                    }`}
                    disabled={
                      isSubmitting || !formData.username || !formData.email || !formData.password || !formData.rol
                    }
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Guardando...
                      </span>
                    ) : success ? (
                      <span className="flex items-center justify-center">
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        ¡Usuario Creado!
                      </span>
                    ) : (
                      "Guardar Usuario"
                    )}
                  </motion.button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    Todos los campos marcados con * son obligatorios
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>


    </div>
  )
}

export default CrearUsuario
