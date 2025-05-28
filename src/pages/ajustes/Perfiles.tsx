"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Edit3, Trash2, UserPlus, Search, Filter, AlertTriangle, CheckCircle } from "lucide-react"

interface Usuario {
  id: number
  username: string
  email: string
  rol: string
}

const Perfiles: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const url = import.meta.env.VITE_API_URL_GET_All_USERS
  const urlDeleteUser = import.meta.env.VITE_API_URL_DELETE_USER_BY_ID
  const navigate = useNavigate()

  const roles = ["all", "Administrador", "EmpleadoRH", "Evaluador"]

  const getRoleColor = (rol: string) => {
    switch (rol?.toLowerCase()) {
      case "administrador":
      case "admin":
        return "bg-gradient-to-r from-pink-400 to-purple-500 text-white"
      case "empleadorh":
        return "bg-gradient-to-r from-blue-400 to-cyan-500 text-white"
      case "evaluador":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
      default:
        return "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
    }
  }

  const borrarUsuario = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      return
    }

    try {
      const response = await fetch(`${urlDeleteUser.replace("{id}", id.toString())}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        throw new Error(`Error al eliminar usuario: ${response.status}`)
      }
      setSuccess("Usuario eliminado correctamente")
      cargarDatos()
    } catch (error) {
      console.error("Error eliminando usuario:", error)
      setError("No se pudo eliminar el usuario. Por favor, inténtalo de nuevo.")
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    let filtered = usuarios

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.rol === selectedRole)
    }

    setFilteredUsuarios(filtered)
  }, [usuarios, searchTerm, selectedRole])

  const cargarDatos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUsuarios(data)
      setFilteredUsuarios(data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Error al cargar los usuarios")
    } finally {
      setIsLoading(false)
    }
  }

  const clearAlerts = () => {
    setTimeout(() => {
      setError(null)
      setSuccess(null)
    }, 3000)
  }

  useEffect(() => {
    if (error || success) {
      clearAlerts()
    }
  }, [error, success])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-4 rounded-2xl flex items-center space-x-3 shadow-lg"
          >
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-4 rounded-2xl flex items-center space-x-3 shadow-lg"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gestión de Perfiles
          </h2>
          <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
   
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-pink-400 to-purple-600 p-6 rounded-3xl text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <div className="bg-white/20 p-2 rounded-xl">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{usuarios.length}</div>
          <p className="text-pink-100">Total Usuarios</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-400 to-cyan-600 p-6 rounded-3xl text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <div className="bg-white/20 p-2 rounded-xl">
              <span className="text-2xl">👑</span>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {usuarios.filter((u) => u.rol?.toLowerCase() === "administrador").length}
          </div>
          <p className="text-blue-100">Administradores</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-400 to-orange-600 p-6 rounded-3xl text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <div className="bg-white/20 p-2 rounded-xl">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {usuarios.filter((u) => u.rol?.toLowerCase() === "evaluador").length}
          </div>
          <p className="text-yellow-100">Evaluadores</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-400 to-emerald-600 p-6 rounded-3xl text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <div className="bg-white/20 p-2 rounded-xl">
              <span className="text-2xl">💼</span>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">
            {usuarios.filter((u) => u.rol?.toLowerCase() === "empleadorh").length}
          </div>
          <p className="text-green-100">Empleados RH</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pl-12 pr-8 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50/50 appearance-none min-w-[200px]"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "all" ? "Todos los roles" : role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Lista de Usuarios</h3>
          <p className="text-gray-600 mt-1">
            {filteredUsuarios.length} de {usuarios.length} usuarios
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuario</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rol</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-2xl text-sm font-semibold ${getRoleColor(user.rol)}`}>
                        {user.rol || "Usuario"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/Dashboard/Users/${user.id}`)}
                          className="p-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                        >
                          <Edit3 className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => borrarUsuario(user.id)}
                          className="p-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No hay usuarios</p>
                      <p className="text-sm">No se encontraron usuarios que coincidan con los filtros.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default Perfiles
