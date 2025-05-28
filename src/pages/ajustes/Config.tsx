"use client"

import type React from "react"
import { useState } from "react"
import { useUserContext } from "../../context/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import { Save, User, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react"

const Config: React.FC = () => {
  const { user } = useUserContext()
  const urlApiUpdateUser = import.meta.env.VITE_API_URL_UPDATE_USER
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: user?.password || "",
    active: user?.activo || true,
  })
  const [alert, setAlert] = useState<{ visible: boolean; message: string; type: string }>({
    visible: false,
    message: "",
    type: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${urlApiUpdateUser}/${user?.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setAlert({
          visible: true,
          message: "Datos actualizados correctamente",
          type: "success",
        })
      } else {
        throw new Error("Error al actualizar los datos")
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error)
      setAlert({
        visible: true,
        message: "Error al actualizar los datos",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setAlert({ visible: false, message: "", type: "" })
      }, 3000)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Configuración de Usuario</h2>
        <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-600" />
        </div>
      </div>

      <AnimatePresence>
        {alert.visible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-xl text-sm font-medium flex items-center space-x-3 ${
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2.5">
            <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="pl-12 pr-4 py-3.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                placeholder="Nombre de usuario"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-12 pr-4 py-3.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                placeholder="Correo electrónico"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-12 pr-4 py-3.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                placeholder="Contraseña"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-900 text-white font-medium py-3.5 px-6 rounded-xl hover:bg-gray-800 flex items-center justify-center space-x-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            <span>{isSubmitting ? "Guardando..." : "Guardar Cambios"}</span>
          </motion.button>
        </div>
      </form>

      <div className="border-t border-gray-100 pt-6 mt-8">
        <div className="bg-gray-50/70 rounded-xl p-5 text-sm text-gray-500">
          <p>
            Los cambios realizados en esta configuración afectarán a tu cuenta de usuario y cómo interactúas con el
            sistema. Asegúrate de utilizar una contraseña segura y un correo electrónico válido.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Config
