"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Lock,
  Shield,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react"

interface UserData {
  username: string
  password: string
  rol: string
  activo: boolean
  email: string
}

const EditarUser: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [userData, setUserData] = useState<UserData>({
    username: "",
    password: "",
    rol: "",
    activo: true,
    email: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [alert, setAlert] = useState<{ visible: boolean; message: string; type: string }>({
    visible: false,
    message: "",
    type: "",
  })

  const urlapiget = import.meta.env.VITE_API_URL_GET_USER_BY_ID.replace("{id}", id || "")
  const urlApiUpdate = import.meta.env.VITE_API_URL_UPDATE_USER_BY_ID.replace("{id}", id || "")
  const roles = ["Administrador", "EmpleadoRH", "Evaluador"]

  useEffect(() => {
    if (id) {
      fetch(urlapiget)
        .then((res) => res.json())
        .then((data) => {
          setUserData({
            username: data.username,
            password: "",
            rol: data.rol,
            activo: data.activo,
            email: data.email,
          })
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("Error al obtener usuario:", err)
          setAlert({
            visible: true,
            message: "Error al cargar los datos del usuario",
            type: "error",
          })
          setIsLoading(false)
        })
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(urlApiUpdate, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (res.ok) {
        setAlert({
          visible: true,
          message: "Usuario actualizado correctamente",
          type: "success",
        })
        setTimeout(() => {
          // navigate('/Dashboard');
        }, 1500)
      } else {
        const error = await res.text()
        console.error("Error en actualización:", error)
        setAlert({
          visible: true,
          message: "Error al actualizar usuario",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Error al conectar con la API:", err)
      setAlert({
        visible: true,
        message: "Error de conexión con el servidor",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setAlert({ visible: false, message: "", type: "" })
      }, 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-900 border-t-transparent"></div>
            <span className="text-gray-600">Cargando datos del usuario...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </button>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Editar Usuario</h1>
              <p className="text-gray-500 mt-1">Modifica la información del usuario seleccionado</p>
            </div>
          </div>
        </motion.div>

        {/* Alert */}
        <AnimatePresence>
          {alert.visible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center space-x-3 ${
                alert.type === "success" ? "bg-gray-900 text-white" : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {alert.type === "success" ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span>{alert.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      required
                      className="pl-12 pr-4 py-3.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                      placeholder="Nombre de usuario"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      required
                      className="pl-12 pr-4 py-3.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                      placeholder="Correo electrónico"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2.5">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                  <span className="text-gray-500 font-normal ml-2">(dejar en blanco si no se cambia)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    className="pl-12 pr-12 py-3.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    placeholder="Nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2.5">
                <label className="block text-sm font-medium text-gray-700">Rol del usuario</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="rol"
                    value={userData.rol}
                    onChange={handleChange}
                    required
                    className="pl-12 pr-4 py-3.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors appearance-none"
                  >
                    <option value="">Seleccione un rol</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Status */}
              <div className="space-y-2.5">
                <label className="block text-sm font-medium text-gray-700">Estado del usuario</label>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={userData.activo}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      onClick={() => setUserData((prev) => ({ ...prev, activo: !prev.activo }))}
                      className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                        userData.activo ? "bg-gray-900" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform transform ${
                          userData.activo ? "translate-x-6" : "translate-x-0.5"
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Usuario {userData.activo ? "activo" : "inactivo"}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-100">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-900 text-white font-medium py-3.5 px-6 rounded-xl hover:bg-gray-800 flex items-center justify-center space-x-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSubmitting ? "Guardando cambios..." : "Guardar Cambios"}</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 bg-gray-50/70 rounded-xl p-5 text-sm text-gray-500"
        >
          <p>
            Los cambios realizados en este formulario afectarán inmediatamente al usuario seleccionado. Si no deseas
            cambiar la contraseña, deja el campo en blanco.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default EditarUser
