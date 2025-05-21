"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Phone, Calendar, Building, Briefcase, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const CrearTrabajador: React.FC = () => {
  const urlCrearEmpleado = import.meta.env.VITE_API_URL_SAVE_EMPLEADO
  const urlDepartamentos = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS
  const urlCargos = import.meta.env.VITE_API_URL_GET_ALL_CARGOS

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fecha_contratacion: "",
    departamento_id: "",
    cargo_id: "",
  })

  const [departamentos, setDepartamentos] = useState<any[]>([])
  const [cargos, setCargos] = useState<any[]>([])
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error" | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depResponse, cargoResponse] = await Promise.all([fetch(urlDepartamentos), fetch(urlCargos)])

        if (depResponse.ok && cargoResponse.ok) {
          const depData = await depResponse.json()
          const cargoData = await cargoResponse.json()
          setDepartamentos(depData)
          setCargos(cargoData)
        } else {
          console.error("Error al obtener datos")
        }
      } catch (error) {
        console.error("Error en la conexión:", error)
      }
    }

    fetchData()
  }, [urlDepartamentos, urlCargos])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

    // Validar que todos los campos estén completos
    const queryParams = new URLSearchParams({
      DepartamentoId: formData.departamento_id,
      CargoId: formData.cargo_id,
    }).toString()

    try {
      const response = await fetch(`${urlCrearEmpleado}?${queryParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          fechaContratacion: formData.fecha_contratacion,
        }),
      })

      if (response.ok) {
        setTipoMensaje("success")
        setMensaje("Trabajador creado correctamente.")
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          fecha_contratacion: "",
          departamento_id: "",
          cargo_id: "",
        })
      } else {
        const error = await response.text()
        console.error("Error en la respuesta:", error)
        setTipoMensaje("error")
        setMensaje("Error al crear el trabajador.")
      }
    } catch (error) {
      console.error("Error en el envío:", error)
      setTipoMensaje("error")
      setMensaje("Error en la conexión.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setMensaje("")
        setTipoMensaje("")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">


      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 flex items-center">
            <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Crear Nuevo Trabajador</h2>
              <p className="text-gray-500 mt-1">Ingresa la información del nuevo empleado</p>
            </div>
          </div>

          {/* Notification */}
          <AnimatePresence>
            {mensaje && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 mb-6 rounded-lg flex items-start ${
                  tipoMensaje === "success" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {tipoMensaje === "success" ? (
                  <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                )}
                <span>{mensaje}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-800">Información del Trabajador</h3>
              <p className="text-sm text-gray-500 mt-1">Todos los campos son obligatorios</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre del trabajador"
                      value={formData.nombre}
                      onChange={handleChange}
                      onFocus={() => handleFocus("nombre")}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        focusedField === "nombre" ? "border-teal-500 ring-1 ring-teal-200" : "border-gray-300"
                      } rounded-lg focus:outline-none transition-colors`}
                      required
                    />
                  </div>
                </div>

                {/* Apellido */}
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      placeholder="Apellido del trabajador"
                      value={formData.apellido}
                      onChange={handleChange}
                      onFocus={() => handleFocus("apellido")}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        focusedField === "apellido" ? "border-teal-500 ring-1 ring-teal-200" : "border-gray-300"
                      } rounded-lg focus:outline-none transition-colors`}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        focusedField === "email" ? "border-teal-500 ring-1 ring-teal-200" : "border-gray-300"
                      } rounded-lg focus:outline-none transition-colors`}
                      required
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      placeholder="+1 (555) 123-4567"
                      value={formData.telefono}
                      onChange={handleChange}
                      onFocus={() => handleFocus("telefono")}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        focusedField === "telefono" ? "border-teal-500 ring-1 ring-teal-200" : "border-gray-300"
                      } rounded-lg focus:outline-none transition-colors`}
                      required
                    />
                  </div>
                </div>

                {/* Fecha de Contratación */}
                <div>
                  <label htmlFor="fecha_contratacion" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Contratación
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="fecha_contratacion"
                      name="fecha_contratacion"
                      value={formData.fecha_contratacion}
                      onChange={handleChange}
                      onFocus={() => handleFocus("fecha_contratacion")}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        focusedField === "fecha_contratacion"
                          ? "border-teal-500 ring-1 ring-teal-200"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none transition-colors`}
                      required
                    />
                  </div>
                </div>

                {/* Departamento */}
                <div>
                  <label htmlFor="departamento_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      id="departamento_id"
                      name="departamento_id"
                      value={formData.departamento_id}
                      onChange={handleChange}
                      onFocus={() => handleFocus("departamento_id")}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        focusedField === "departamento_id" ? "border-teal-500 ring-1 ring-teal-200" : "border-gray-300"
                      } rounded-lg focus:outline-none transition-colors appearance-none bg-white`}
                      required
                    >
                      <option value="">Seleccione Departamento</option>
                      {departamentos.map((dep: any) => (
                        <option key={dep.id} value={dep.id}>
                          {dep.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
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

                {/* Cargo */}
                <div className="sm:col-span-2">
                  <label htmlFor="cargo_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      id="cargo_id"
                      name="cargo_id"
                      value={formData.cargo_id}
                      onChange={handleChange}
                      onFocus={() => handleFocus("cargo_id")}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        focusedField === "cargo_id" ? "border-teal-500 ring-1 ring-teal-200" : "border-gray-300"
                      } rounded-lg focus:outline-none transition-colors appearance-none bg-white`}
                      required
                    >
                      <option value="">Seleccione Cargo</option>
                      {cargos.map((cargo: any) => (
                        <option key={cargo.id} value={cargo.id}>
                          {cargo.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
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

              {/* Submit Button */}
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Registrando...
                    </span>
                  ) : (
                    "Registrar Trabajador"
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </main>


    </div>
  )
}

export default CrearTrabajador
