"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

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

const InfoEmpleado: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [empleado, setEmpleado] = useState<Empleado | null>(null)
  const [departamentos, setDepartamentos] = useState<any[]>([])
  const [cargos, setCargos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const API_GET = import.meta.env.VITE_API_URL_GET_EMPLEADO_BY_ID
  const API_UPDATE = import.meta.env.VITE_API_URL_UPDATE_EMPLEADO
  const API_GET_ALL_DEPARTAMENTOS = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS
  const API_GET_ALL_CARGOS = import.meta.env.VITE_API_URL_GET_ALL_CARGOS

  useEffect(() => {
    setIsLoading(true)
    if (id) {
      fetch(API_GET.replace("{id}", id))
        .then((res) => res.json())
        .then((data) => {
          setEmpleado(data)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("Error al obtener el empleado:", err)
          setIsLoading(false)
        })

      fetch(API_GET_ALL_DEPARTAMENTOS)
        .then((res) => res.json())
        .then(setDepartamentos)
        .catch((err) => console.error("Error al obtener los departamentos:", err))

      fetch(API_GET_ALL_CARGOS)
        .then((res) => res.json())
        .then(setCargos)
        .catch((err) => console.error("Error al obtener los cargos:", err))
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (!empleado) return

    if (name === "departamento") {
      const dep = departamentos.find((d) => d.id === Number.parseInt(value))
      setEmpleado({ ...empleado, departamento: dep })
    } else if (name === "cargo") {
      const car = cargos.find((c) => c.id === Number.parseInt(value))
      setEmpleado({ ...empleado, cargo: car })
    } else {
      setEmpleado({ ...empleado, [name]: value })
    }
  }

  const guardarCambios = () => {
    if (!empleado) return
    if (!empleado.nombre || !empleado.apellido || !empleado.email || !empleado.telefono) {
      alert("❌ Todos los campos son obligatorios")
      return
    }

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
        alert("✅ Cambios guardados exitosamente")
        navigate("/Dashboard")
      })
      .catch((err) => {
        console.error("Error al guardar el empleado:", err)
        alert("❌ Error al guardar los cambios")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del empleado...</p>
        </div>
      </motion.div>
    )
  }

  if (!empleado) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <div className="text-amber-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Empleado no encontrado</h2>
          <p className="text-gray-600 mb-6">No se pudo encontrar la información del empleado solicitado.</p>
          <button
            onClick={() => navigate("/empleados")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            ⬅️ Volver al listado
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate("/empleados")}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                ⬅️
              </button>
              <h1 className="text-xl font-bold text-white">✏️ Editar Empleado</h1>
              <div className="w-8"></div> {/* Spacer para centrar el título */}
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {empleado.nombre.charAt(0)}
                {empleado.apellido.charAt(0)}
              </div>
            </motion.div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={empleado.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={empleado.apellido}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={empleado.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={empleado.telefono}
                  onChange={handleInputChange}
                  placeholder="Teléfono"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  name="departamento"
                  value={empleado.departamento.id}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                >
                  {departamentos.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <select
                  name="cargo"
                  value={empleado.cargo.id}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200"
                >
                  {cargos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-2">💰</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Salario base</p>
                    <p className="text-lg font-bold text-green-700">
                      ${empleado.cargo.salarioBase.toLocaleString("es")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={guardarCambios}
              disabled={isSaving}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>💾 Guardar Cambios</>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default InfoEmpleado
