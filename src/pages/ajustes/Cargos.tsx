"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  DollarSign,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Users,
} from "lucide-react"

interface Cargo {
  id?: number
  nombre: string
  salarioBase: number
}

const Cargos: React.FC = () => {
  const urlApiCargosAll = import.meta.env.VITE_API_URL_GET_ALL_CARGOS
  const urlApiCargosSave = import.meta.env.VITE_API_URL_SAVE_CARGO
  const urlApiCargosUpdate = import.meta.env.VITE_API_URL_UPDATE_CARGO
  const urlApiCargosDelete = import.meta.env.VITE_API_URL_DELETE_CARGO

  const [cargos, setCargos] = useState<Cargo[]>([])
  const [formData, setFormData] = useState<Cargo>({ nombre: "", salarioBase: 0 })
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; cargo: Cargo | null }>({
    show: false,
    cargo: null,
  })
  const [alert, setAlert] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })

  useEffect(() => {
    fetchCargos()
  }, [])

  const fetchCargos = async () => {
    try {
      setLoading(true)
      const response = await fetch(urlApiCargosAll)
      if (!response.ok) throw new Error("Error al obtener los cargos")
      const data = await response.json()
      setCargos(data)
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error al obtener los cargos",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salarioBase" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim() || formData.salarioBase <= 0) {
      setAlert({
        type: "error",
        message: "Por favor completa todos los campos correctamente",
      })
      return
    }

    const url = editId ? urlApiCargosUpdate.replace("{id}", editId.toString()) : urlApiCargosSave
    const method = editId ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Error al guardar/actualizar cargo")
      }

      setAlert({
        type: "success",
        message: `Cargo ${editId ? "actualizado" : "creado"} correctamente`,
      })
      resetForm()
      fetchCargos()
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error al guardar/actualizar cargo",
      })
    }
  }

  const handleEdit = (cargo: Cargo) => {
    setFormData({ nombre: cargo.nombre, salarioBase: cargo.salarioBase })
    setEditId(cargo.id || null)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteModal.cargo?.id) return

    try {
      const response = await fetch(urlApiCargosDelete.replace("{id}", deleteModal.cargo.id.toString()), {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Error al eliminar cargo")
      }

      setAlert({
        type: "success",
        message: "Cargo eliminado correctamente",
      })
      setDeleteModal({ show: false, cargo: null })
      fetchCargos()
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error al eliminar cargo",
      })
    }
  }

  const resetForm = () => {
    setFormData({ nombre: "", salarioBase: 0 })
    setEditId(null)
    setShowForm(false)
  }

  const clearAlert = () => {
    setAlert({ type: null, message: "" })
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(salary)
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
                : "bg-gradient-to-r from-red-500 to-orange-600 text-white"
            } shadow-lg`}
          >
            <div className="flex items-center space-x-3">
              {alert.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              <span className="font-medium">{alert.message}</span>
            </div>
            <button onClick={clearAlert} className="text-white hover:text-white/80 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Cargos</h2>
            <p className="text-gray-600 mt-1">Administra los cargos y salarios de tu organización</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Cargo</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-400 to-cyan-600 p-6 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Cargos</p>
              <p className="text-3xl font-bold">{cargos.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-400 to-teal-600 p-6 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Salario Promedio</p>
              <p className="text-3xl font-bold">
                {cargos.length > 0
                  ? formatSalary(cargos.reduce((acc, cargo) => acc + cargo.salarioBase, 0) / cargos.length)
                  : "$0"}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-400 to-indigo-600 p-6 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Salario Máximo</p>
              <p className="text-3xl font-bold">
                {cargos.length > 0 ? formatSalary(Math.max(...cargos.map((c) => c.salarioBase))) : "$0"}
              </p>
            </div>
            <Briefcase className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100"
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{editId ? "Editar Cargo" : "Crear Nuevo Cargo"}</h3>
                    <p className="text-purple-100 mt-1">
                      {editId ? "Modifica la información del cargo" : "Añade un nuevo cargo a tu organización"}
                    </p>
                  </div>
                </div>
                <button onClick={resetForm} className="text-white hover:text-white/80 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="block text-gray-700 font-medium">
                    Nombre del Cargo
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Gerente de Ventas, Desarrollador..."
                    className="w-full px-5 py-4 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50/30 transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="salarioBase" className="block text-gray-700 font-medium">
                    Salario Base
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="salarioBase"
                      type="number"
                      name="salarioBase"
                      value={formData.salarioBase}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-12 pr-5 py-4 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50/30 transition-all duration-200"
                      required
                      min={0}
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow"
                >
                  <Save className="h-5 w-5" />
                  <span>{editId ? "Actualizar" : "Guardar"}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Lista de Cargos</h3>
          <p className="text-gray-600 mt-1">{cargos.length} cargos registrados</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
              <span className="text-gray-600">Cargando cargos...</span>
            </div>
          </div>
        ) : cargos.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No hay cargos registrados</p>
            <p className="text-gray-400 text-sm">Crea tu primer cargo para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cargo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Salario Base</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cargos.map((cargo, index) => (
                  <motion.tr
                    key={cargo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{cargo.nombre}</div>
                          <div className="text-sm text-gray-500">ID: {cargo.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-emerald-600">{formatSalary(cargo.salarioBase)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(cargo)}
                          className="p-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                        >
                          <Edit3 className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteModal({ show: true, cargo })}
                          className="p-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Eliminar cargo?</h3>
                <p className="text-gray-600 mb-6">
                  ¿Estás seguro de que deseas eliminar el cargo{" "}
                  <span className="font-semibold text-gray-900">"{deleteModal.cargo?.nombre}"</span>? Esta acción no se
                  puede deshacer.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteModal({ show: false, cargo: null })}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
                  >
                    Eliminar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Cargos
