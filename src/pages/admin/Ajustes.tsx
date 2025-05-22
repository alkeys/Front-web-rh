"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useUserContext } from "../../context/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  UserCog,
  ClipboardList,
  UserPlus,
  Building,
  Users,
  ChevronRight,
  Bell,
  Shield,
  Home,
  Search,
  LogOut,
} from "lucide-react"

// Importación de componentes
import Config from "../ajustes/Config"
import Perfiles from "../ajustes/Perfiles"
import Logs from "../ajustes/Logs"
import CreateDepartamento from "../ajustes/CreateDepartamento"
import CrearTrabajador from "../ajustes/CrearTrabajador"
import CrearUsuario from "../ajustes/CrearUsuario"

type TabOption = {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  color: string
}

const Ajustes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Configuración")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { user } = useUserContext()

  useEffect(() => {
    if (!user) {
      // Redirección comentada para pruebas
      // window.location.href = '/';
    }
    console.log(user)
  }, [user])

  // Definición de opciones con colores y descripciones
  const opciones: TabOption[] = [
    {
      id: "Configuración",
      label: "Configuración",
      icon: <Settings className="h-5 w-5" />,
      description: "Ajustes generales del sistema y preferencias",
      color: "indigo",
    },
    {
      id: "Perfiles",
      label: "Perfiles",
      icon: <UserCog className="h-5 w-5" />,
      description: "Gestión de perfiles de usuario y permisos",
      color: "purple",
    },
    {
      id: "Logs",
      label: "Logs",
      icon: <ClipboardList className="h-5 w-5" />,
      description: "Registro de actividades y eventos del sistema",
      color: "blue",
    },
    {
      id: "Crear Trabajador",
      label: "Crear Trabajador",
      icon: <Users className="h-5 w-5" />,
      description: "Añadir nuevos empleados al sistema",
      color: "emerald",
    },
    {
      id: "Crear Departamento",
      label: "Crear Departamento",
      icon: <Building className="h-5 w-5" />,
      description: "Crear y configurar nuevos departamentos",
      color: "amber",
    },
    {
      id: "Crear Usuario",
      label: "Crear Usuario",
      icon: <UserPlus className="h-5 w-5" />,
      description: "Registrar nuevos usuarios en el sistema",
      color: "rose",
    },
  ]

  // Filtrar opciones basadas en la búsqueda
  const filteredOptions = searchQuery
    ? opciones.filter(
        (opcion) =>
          opcion.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opcion.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : opciones

  const renderContent = () => {
    switch (activeTab) {
      case "Configuración":
        return <Config />
      case "Perfiles":
        return <Perfiles />
      case "Logs":
        return <Logs />
      case "Crear Trabajador":
        return <CrearTrabajador />
      case "Crear Departamento":
        return <CreateDepartamento />
      case "Crear Usuario":
        return <CrearUsuario />
      default:
        return (
          <div className="text-center py-12">
            <div className="bg-gray-50 inline-block p-6 rounded-full mb-4">
              <Settings className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-600">Selecciona una opción para comenzar.</p>
          </div>
        )
    }
  }

  // Función para obtener las clases de color según la opción
  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap: Record<string, { bg: string; text: string; border: string; activeBg: string; hoverBg: string }> = {
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
        activeBg: "bg-indigo-100",
        hoverBg: "hover:bg-indigo-50",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        activeBg: "bg-purple-100",
        hoverBg: "hover:bg-purple-50",
      },
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        activeBg: "bg-blue-100",
        hoverBg: "hover:bg-blue-50",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        activeBg: "bg-emerald-100",
        hoverBg: "hover:bg-emerald-50",
      },
      amber: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        activeBg: "bg-amber-100",
        hoverBg: "hover:bg-amber-50",
      },
      rose: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        activeBg: "bg-rose-100",
        hoverBg: "hover:bg-rose-50",
      },
    }

    const colorClasses = colorMap[color] || colorMap.indigo

    return isActive
      ? `${colorClasses.activeBg} ${colorClasses.text} border ${colorClasses.border}`
      : `bg-white ${colorClasses.hoverBg} text-gray-700 hover:${colorClasses.text} border border-gray-200`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-3">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Panel de Ajustes</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-700 font-medium">{user?.username?.charAt(0) || "U"}</span>
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8"
        >
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Bienvenido, <span className="text-white">{user?.username || "Usuario"}</span>
                </h2>
                <p className="text-indigo-100 max-w-2xl">
                  Desde este panel puedes administrar las configuraciones de tu cuenta y gestionar los recursos del
                  sistema. Selecciona una opción para comenzar.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md shadow-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                    <Shield className="mr-2 h-4 w-4" />
                    Permisos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar ajustes..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <nav className="p-2">
                <ul className="space-y-1">
                  {filteredOptions.map((opcion) => (
                    <motion.li
                      key={opcion.id}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(opcion.id)}
                      className={`rounded-lg cursor-pointer transition-all duration-200 ${getColorClasses(
                        opcion.color,
                        activeTab === opcion.id,
                      )}`}
                    >
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-md mr-3 ${
                                activeTab === opcion.id
                                  ? `bg-${opcion.color}-200 text-${opcion.color}-700`
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {opcion.icon}
                            </div>
                            <div>
                              <div className="font-medium">{opcion.label}</div>
                              <div className="text-xs text-gray-500 mt-0.5 max-w-[180px] truncate">
                                {opcion.description}
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            className={`h-4 w-4 ${
                              activeTab === opcion.id ? `text-${opcion.color}-500` : "text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </nav>

     
            </div>
          </motion.div>

          {/* Contenido principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 p-4 bg-gray-50 flex items-center">
                {opciones.find((o) => o.id === activeTab)?.icon && (
                  <div
                    className={`p-2 rounded-md mr-3 bg-${
                      opciones.find((o) => o.id === activeTab)?.color
                    }-100 text-${opciones.find((o) => o.id === activeTab)?.color}-700`}
                  >
                    {opciones.find((o) => o.id === activeTab)?.icon}
                  </div>
                )}
                <h2 className="text-lg font-medium text-gray-900">{activeTab}</h2>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Ajustes
