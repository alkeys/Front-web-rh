"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Building,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  UserCog,
  Clock,
  DollarSign,
  Info,
} from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"

interface Empleado {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  fechaContratacion: string
  departamento: { id: number; nombre: string }
  cargo: { id: number; nombre: string; salarioBase: number }
}

interface Departamento {
  id: number
  nombre: string
}

interface Cargo {
  id: number
  nombre: string
  salarioBase: number
}

const InfoEmpleado: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [empleado, setEmpleado] = useState<Empleado | null>(null)
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [formChanged, setFormChanged] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const API_GET = import.meta.env.VITE_API_URL_GET_EMPLEADO_BY_ID
  const API_UPDATE = import.meta.env.VITE_API_URL_UPDATE_EMPLEADO
  const API_GET_ALL_DEPARTAMENTOS = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS
  const API_GET_ALL_CARGOS = import.meta.env.VITE_API_URL_GET_ALL_CARGOS

  useEffect(() => {
    if (!id) return
    setIsLoading(true)

    Promise.all([
      fetch(API_GET.replace("{id}", id)).then((res) => res.json()),
      fetch(API_GET_ALL_DEPARTAMENTOS).then((res) => res.json()),
      fetch(API_GET_ALL_CARGOS).then((res) => res.json()),
    ])
      .then(([emp, deps, cars]) => {
        setEmpleado(emp)
        setDepartamentos(deps)
        setCargos(cars)
      })
      .catch(() => {
        showNotification("error", "Error al cargar los datos del empleado")
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!empleado?.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    if (!empleado?.apellido.trim()) newErrors.apellido = "El apellido es obligatorio"
    if (!empleado?.email.trim()) newErrors.email = "El email es obligatorio"
    if (empleado?.email && !/\S+@\S+\.\S+/.test(empleado.email)) newErrors.email = "Formato de email no válido"
    if (!empleado?.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio"
    if (!empleado?.fechaContratacion) newErrors.fechaContratacion = "La fecha de contratación es obligatoria"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (!empleado) return

    if (name === "departamento") {
      const dep = departamentos.find((d) => d.id === Number(value))
      if (dep) setEmpleado({ ...empleado, departamento: dep })
    } else if (name === "cargo") {
      const car = cargos.find((c) => c.id === Number(value))
      if (car) setEmpleado({ ...empleado, cargo: car })
    } else {
      setEmpleado({ ...empleado, [name]: value })
    }
    setFormChanged(true)
  }

  const guardarCambios = () => {
    if (!empleado || !validateForm()) return

    setIsSaving(true)
    const datosEnviar = {
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      email: empleado.email,
      telefono: empleado.telefono,
      fechaContratacion: empleado.fechaContratacion,
    }

    const url = API_UPDATE.replace("{id}", empleado.id.toString())
      .replace("{idDepartamento}", empleado.departamento.id.toString())
      .replace("{idCargo}", empleado.cargo.id.toString())

    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosEnviar),
    })
      .then((res) => res.json())
      .then(() => {
        showNotification("success", "Empleado actualizado correctamente")
        setFormChanged(false)
      })
      .catch(() => {
        showNotification("error", "No se pudo actualizar el empleado")
      })
      .finally(() => setIsSaving(false))
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es", { year: "numeric", month: "long", day: "numeric" }).format(date)
    } catch (e) {
      return dateString
    }
  }

  return     <div className="min-h-screen bg-gray-50">
  {/* Header */}
  <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/Dashboard")}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <UserCog className="mr-2 h-5 w-5 text-teal-600" />
            Información del Empleado
          </h1>
        </div>

        <div>
          <button
            onClick={guardarCambios}
            disabled={isSaving || !formChanged}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Información general */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center mb-6">
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
            <div className="w-20 h-20 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-bold">
              {empleado?.nombre?.charAt(0) || ""}
              {empleado?.apellido?.charAt(0) || ""}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {empleado?.nombre} {empleado?.apellido}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                <Building className="mr-1 h-3 w-3" />
                {empleado?.departamento.nombre}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Briefcase className="mr-1 h-3 w-3" />
                {empleado?.cargo.nombre}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <Clock className="mr-1 h-3 w-3" />
                Contratado: {empleado ? formatDate(empleado.fechaContratacion) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información personal */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <User className="mr-2 h-4 w-4 text-teal-600" />
              Información personal
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <div className="relative">
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={empleado?.nombre || ""}
                    onChange={handleInputChange}
                    className={`block w-full pl-3 pr-3 py-2 border ${
                      errors.nombre ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                  />
                  {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <div className="relative">
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    value={empleado?.apellido || ""}
                    onChange={handleInputChange}
                    className={`block w-full pl-3 pr-3 py-2 border ${
                      errors.apellido ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                  />
                  {errors.apellido && <p className="mt-1 text-xs text-red-600">{errors.apellido}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={empleado?.email || ""}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="telefono"
                    name="telefono"
                    type="text"
                    value={empleado?.telefono || ""}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.telefono ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                  />
                  {errors.telefono && <p className="mt-1 text-xs text-red-600">{errors.telefono}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Información laboral */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <Briefcase className="mr-2 h-4 w-4 text-teal-600" />
              Información laboral
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="fechaContratacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de contratación
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="fechaContratacion"
                    name="fechaContratacion"
                    type="date"
                    value={empleado?.fechaContratacion || ""}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.fechaContratacion ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
                    } rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                  />
                  {errors.fechaContratacion && (
                    <p className="mt-1 text-xs text-red-600">{errors.fechaContratacion}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="departamento"
                    name="departamento"
                    value={empleado?.departamento?.id || ""}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {departamentos.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="cargo"
                    name="cargo"
                    value={empleado?.cargo?.id || ""}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {cargos.map((cargo) => (
                      <option key={cargo.id} value={cargo.id}>
                        {cargo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Salario base</p>
                    <p className="text-lg font-bold text-green-700">
                      ${empleado?.cargo?.salarioBase?.toLocaleString("es") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={() => navigate("/Dashboard")}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancelar y volver
        </button>

        <div className="flex gap-4">
          <button
            onClick={guardarCambios}
            disabled={isSaving || !formChanged}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-600">
              Los cambios realizados en esta página actualizarán la información del empleado en el sistema.
              Asegúrate de verificar todos los datos antes de guardar.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Notificaciones */}
  <AnimatePresence>
    {notification && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === "success"
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <div className="flex items-center">
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
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
</div>
}

export default InfoEmpleado
