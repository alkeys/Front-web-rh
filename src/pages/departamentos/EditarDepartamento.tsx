"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

interface Empleado {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  fechaContratacion?: string
  cargo?: { nombre: string }
}

interface Notification {
  id: number
  type: "success" | "error" | "warning"
  message: string
}

const EditarDepartamento: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState("")
  const [nombreOriginal, setNombreOriginal] = useState("")
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  const urlApiUpdate = import.meta.env.VITE_API_URL_UPDATE_DEPARTAMENTO
  const urlApiGetEmpleadosByDepartamento = import.meta.env.VITE_API_URL_GET_EMPLEADOS_BY_DEPARTAMENTO
  const urlApiGetDepartamentoById = import.meta.env.VITE_API_URL_GET_DEPARTAMENTO_BY_ID

  // Función para mostrar notificaciones
  const showNotification = (type: "success" | "error" | "warning", message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      type,
      message,
    }
    setNotifications((prev) => [...prev, newNotification])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
    }, 5000)
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Obtener datos del departamento al cargar
  useEffect(() => {
    if (id) {
      setIsLoading(true)

      Promise.all([
        axios.get(`${urlApiGetDepartamentoById.replace("{id}", id)}`),
        axios.get(`${urlApiGetEmpleadosByDepartamento.replace("{id}", id)}`),
      ])
        .then(([deptRes, empRes]) => {
          setNombre(deptRes.data.nombre)
          setNombreOriginal(deptRes.data.nombre)
          setEmpleados(empRes.data)
        })
        .catch((err) => {
          console.error("Error al obtener datos:", err)
          showNotification("error", "Error al cargar los datos del departamento")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [id])

  // Detectar cambios
  useEffect(() => {
    setHasChanges(nombre.trim() !== nombreOriginal.trim())
  }, [nombre, nombreOriginal])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(event.target.value)
  }

  const handleSubmit = () => {
    if (!id || !nombre.trim()) {
      showNotification("warning", "Debe proporcionar un nombre válido para el departamento")
      return
    }

    setIsSaving(true)

    axios
      .put(`${urlApiUpdate.replace("{id}", id)}`, {
        nombre: nombre.trim(),
      })
      .then(() => {
        setNombreOriginal(nombre.trim())
        showNotification("success", "Departamento actualizado correctamente")
      })
      .catch((err) => {
        console.error("Error al actualizar el departamento:", err)
        showNotification("error", "Ocurrió un error al actualizar el departamento")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando información del departamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      {/* Notificaciones */}
      {notifications.map((notification) => (
        <div key={notification.id} className="fixed top-4 right-4 z-50 max-w-sm animate-pulse">
          <div
            className={`
            rounded-lg shadow-lg p-4 border-l-4 bg-white
            ${notification.type === "success" ? "border-green-500" : ""}
            ${notification.type === "error" ? "border-red-500" : ""}
            ${notification.type === "warning" ? "border-yellow-500" : ""}
          `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">
                  {notification.type === "success" && "✅"}
                  {notification.type === "error" && "❌"}
                  {notification.type === "warning" && "⚠️"}
                </span>
                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate("/Dashboard")}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  ← Volver
                </button>
                <div className="flex items-center text-white">
                  <span className="text-2xl mr-3">🏢</span>
                  <h1 className="text-2xl font-bold">Editar Departamento</h1>
                </div>
                <div className="w-20"></div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  🏢
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <label htmlFor="nombre" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    ✏️ Nombre del Departamento
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    placeholder="Ingrese el nombre del departamento"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!hasChanges || isSaving}
                  className={`
                    w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                    ${
                      hasChanges && !isSaving
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>💾 {hasChanges ? "Guardar Cambios" : "Sin Cambios"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Empleados */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <div className="flex items-center text-white">
              <span className="text-xl mr-3">👥</span>
              <h2 className="text-xl font-bold">Empleados del Departamento</h2>
              <span className="ml-3 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {empleados.length} empleados
              </span>
            </div>
          </div>

          <div className="p-6">
            {empleados.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empleados</h3>
                <p className="text-gray-500">Este departamento no tiene empleados asignados.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {empleados.map((empleado) => (
                  <div
                    key={empleado.id}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {empleado.nombre.charAt(0)}
                        {empleado.apellido.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {empleado.nombre} {empleado.apellido}
                        </h3>
                        {empleado.cargo && <p className="text-sm text-blue-600 font-medium">{empleado.cargo.nombre}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">📧</span>
                        <span className="text-sm truncate">{empleado.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">📞</span>
                        <span className="text-sm">{empleado.telefono}</span>
                      </div>
                      {empleado.fechaContratacion && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">📅</span>
                          <span className="text-sm">
                            Desde {new Date(empleado.fechaContratacion).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditarDepartamento
