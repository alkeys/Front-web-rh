"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Percent,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Calculator,
  Building,
  Users,
  Shield,
  Loader2,
  X,
  HelpCircle,
} from "lucide-react"

interface Obligaciones {
  id?: number
  afpEmpleado: number
  afpPatronal: number
  issEmpleado: number
  issPatronal: number
  fechaCreacion: string
}

const SaveUpdatePlanilla: React.FC = () => {
  const urlUpdate = import.meta.env.VITE_API_URL_UPDATE_OBLIGACIONES_ISS_AFP
  const urlSave = import.meta.env.VITE_API_URL_SAVE_OBLIGACIONES_ISS_AFP
  const urlGet = import.meta.env.VITE_API_URL_GET_ALL_OBLIGACIONES_ISS_AFP

  const [obligaciones, setObligaciones] = useState<Obligaciones>({
    afpEmpleado: 0,
    afpPatronal: 0,
    issEmpleado: 0,
    issPatronal: 0,
    fechaCreacion: new Date().toISOString(),
  })
  const [existingId, setExistingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | "info" | null; message: string }>({
    type: null,
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showTooltips, setShowTooltips] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchObligaciones = async () => {
      try {
        setLoading(true)
        const res = await fetch(urlGet)
        if (!res.ok) throw new Error("Error al obtener datos")

        const data: Obligaciones[] = await res.json()
        if (data.length === 1) {
          const o = data[0]
          setObligaciones(o)
          setExistingId(o.id ?? null)
          setAlert({
            type: "success",
            message: "Configuración cargada correctamente",
          })
        } else if (data.length > 1) {
          setAlert({
            type: "warning",
            message: "Se encontraron múltiples configuraciones. Se mostrará la primera.",
          })
          if (data[0]) {
            setObligaciones(data[0])
            setExistingId(data[0].id ?? null)
          }
        } else {
          setAlert({
            type: "info",
            message: "No se encontró configuración existente. Creando nueva configuración.",
          })
        }
      } catch (err) {
        setAlert({
          type: "error",
          message: "Error al cargar la configuración",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchObligaciones()
  }, [urlGet])

  const validateField = (name: string, value: number): string => {
    if (value < 0) return "El porcentaje no puede ser negativo"
    if (value > 100) return "El porcentaje no puede ser mayor a 100%"
    if (name.includes("afp") && value > 15) return "El porcentaje de AFP parece muy alto (máximo recomendado: 15%)"
    if (name.includes("iss") && value > 10) return "El porcentaje de ISS parece muy alto (máximo recomendado: 10%)"
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number(value)

    setObligaciones((prev) => ({
      ...prev,
      [name]: numValue,
    }))

    // Validar en tiempo real
    const error = validateField(name, numValue)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleSubmit = async () => {
    // Validar todos los campos
    const newErrors: Record<string, string> = {}
    Object.entries(obligaciones).forEach(([key, value]) => {
      if (key !== "id" && key !== "fechaCreacion") {
        const error = validateField(key, value as number)
        if (error) newErrors[key] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setAlert({
        type: "error",
        message: "Por favor corrige los errores antes de continuar",
      })
      return
    }

    setSaving(true)
    setAlert({ type: null, message: "" })

    try {
      if (existingId && existingId > 0) {
        // UPDATE
        const res = await fetch(`${urlUpdate.replace("{id}", existingId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obligaciones),
        })
        if (!res.ok) throw new Error("Error al actualizar")
        setAlert({
          type: "success",
          message: "Configuración actualizada exitosamente",
        })
      } else {
        // SAVE
        const res = await fetch(urlSave, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obligaciones),
        })
        if (!res.ok) throw new Error("Error al guardar")
        const newData = await res.json()
        setExistingId(newData.id)
        setAlert({
          type: "success",
          message: "Configuración guardada exitosamente",
        })
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: existingId ? "Error al actualizar la configuración" : "Error al guardar la configuración",
      })
    } finally {
      setSaving(false)
    }
  }

  const clearAlert = () => {
    setAlert({ type: null, message: "" })
  }

  const toggleTooltip = (field: string) => {
    setShowTooltips((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const getTooltipContent = (field: string): string => {
    const tooltips: Record<string, string> = {
      afpEmpleado:
        "Porcentaje que se descuenta del salario del empleado para AFP (Administradora de Fondos de Pensiones)",
      afpPatronal: "Porcentaje que aporta el empleador sobre el salario del empleado para AFP",
      issEmpleado:
        "Porcentaje que se descuenta del salario del empleado para ISSS (Instituto Salvadoreño del Seguro Social)",
      issPatronal: "Porcentaje que aporta el empleador sobre el salario del empleado para ISSS",
    }
    return tooltips[field] || ""
  }

  const getTotalDeductions = () => {
    return obligaciones.afpEmpleado + obligaciones.issEmpleado
  }

  const getTotalEmployerContributions = () => {
    return obligaciones.afpPatronal + obligaciones.issPatronal
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Alerts */}
      <AnimatePresence>
        {alert.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl flex items-center justify-between ${
              alert.type === "success"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                : alert.type === "error"
                  ? "bg-gradient-to-r from-red-500 to-orange-600 text-white"
                  : alert.type === "warning"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
            } shadow-lg`}
          >
            <div className="flex items-center space-x-3">
              {alert.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : alert.type === "error" ? (
                <AlertCircle className="h-5 w-5" />
              ) : alert.type === "warning" ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <Info className="h-5 w-5" />
              )}
              <span className="font-medium">{alert.message}</span>
            </div>
            <button onClick={clearAlert} className="text-white hover:text-white/80 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-400 to-pink-600 p-6 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Descuentos Empleado</p>
              <p className="text-3xl font-bold">{getTotalDeductions().toFixed(2)}%</p>
            </div>
            <Users className="h-8 w-8 text-red-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-400 to-yellow-600 p-6 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Aportes Patronales</p>
              <p className="text-3xl font-bold">{getTotalEmployerContributions().toFixed(2)}%</p>
            </div>
            <Building className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-400 to-cyan-600 p-6 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total AFP</p>
              <p className="text-3xl font-bold">{(obligaciones.afpEmpleado + obligaciones.afpPatronal).toFixed(2)}%</p>
            </div>
            <Shield className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-400 to-indigo-600 p-6 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total ISSS</p>
              <p className="text-3xl font-bold">{(obligaciones.issEmpleado + obligaciones.issPatronal).toFixed(2)}%</p>
            </div>
            <Calculator className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Porcentajes de Obligaciones</h3>
              <p className="text-blue-100 mt-1">Configura los porcentajes para AFP e ISSS</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AFP Section */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">AFP</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* AFP Empleado */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">Empleado (%)</label>
                      <button
                        type="button"
                        onClick={() => toggleTooltip("afpEmpleado")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        name="afpEmpleado"
                        value={obligaciones.afpEmpleado}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.afpEmpleado
                            ? "border-red-300 focus:ring-red-500 bg-red-50"
                            : "border-blue-200 focus:ring-blue-500 bg-blue-50/30"
                        }`}
                        placeholder="0.00"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Percent className="h-4 w-4" />
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.afpEmpleado && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.afpEmpleado}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* AFP Patronal */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">Patronal (%)</label>
                      <button
                        type="button"
                        onClick={() => toggleTooltip("afpPatronal")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        name="afpPatronal"
                        value={obligaciones.afpPatronal}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.afpPatronal
                            ? "border-red-300 focus:ring-red-500 bg-red-50"
                            : "border-orange-200 focus:ring-orange-500 bg-orange-50/30"
                        }`}
                        placeholder="0.00"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Percent className="h-4 w-4" />
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.afpPatronal && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.afpPatronal}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* ISSS Section */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-8 w-8 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">ISSS</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* ISS Empleado */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">Empleado (%)</label>
                      <button
                        type="button"
                        onClick={() => toggleTooltip("issEmpleado")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        name="issEmpleado"
                        value={obligaciones.issEmpleado}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.issEmpleado
                            ? "border-red-300 focus:ring-red-500 bg-red-50"
                            : "border-purple-200 focus:ring-purple-500 bg-purple-50/30"
                        }`}
                        placeholder="0.00"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Percent className="h-4 w-4" />
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.issEmpleado && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.issEmpleado}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ISS Patronal */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">Patronal (%)</label>
                      <button
                        type="button"
                        onClick={() => toggleTooltip("issPatronal")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        name="issPatronal"
                        value={obligaciones.issPatronal}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.issPatronal
                            ? "border-red-300 focus:ring-red-500 bg-red-50"
                            : "border-green-200 focus:ring-green-500 bg-green-50/30"
                        }`}
                        placeholder="0.00"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Percent className="h-4 w-4" />
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.issPatronal && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.issPatronal}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tooltips */}
          <AnimatePresence>
            {Object.keys(showTooltips).map(
              (field) =>
                showTooltips[field] && (
                  <motion.div
                    key={field}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 mb-6"
                  >
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" />
                      <p>{getTooltipContent(field)}</p>
                    </div>
                  </motion.div>
                ),
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={saving || Object.keys(errors).some((key) => errors[key])}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-4 px-6 rounded-2xl hover:shadow-lg flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{existingId ? "Actualizando..." : "Guardando..."}</span>
              </>
            ) : (
              <>
                {existingId ? <RefreshCw className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                <span>{existingId ? "Actualizar Configuración" : "Guardar Configuración"}</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
      >
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Información Importante</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Los porcentajes de AFP e ISSS se aplicarán automáticamente en el cálculo de la planilla</li>
              <li>• Los descuentos del empleado se restan del salario bruto</li>
              <li>• Los aportes patronales son costos adicionales para la empresa</li>
              <li>• Esta configuración afecta a todos los empleados en la planilla</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SaveUpdatePlanilla
