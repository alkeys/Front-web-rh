"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useUserContext } from "../../context/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, UserCog, ClipboardList, UserPlus, Building, Users, Bell, ChevronDown, Car } from "lucide-react"

// Importación de componentes
import Config from "../ajustes/Config"
import Perfiles from "../ajustes/Perfiles"
import Logs from "../ajustes/Logs"
import CreateDepartamento from "../ajustes/CreateDepartamento"
import CrearTrabajador from "../ajustes/CrearTrabajador"
import CrearUsuario from "../ajustes/CrearUsuario"
import Cargos from "../ajustes/Cargos"
import SaveUpdatePlanilla from "../planilla/SaveUpdatePlanilla"

type TabOption = {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  color: string
}

const Ajustes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Configuración")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user } = useUserContext()

  useEffect(() => {
    if (!user) {
      // Redirección comentada para pruebas
      // window.location.href = '/';
    }
    console.log(user)
  }, [user])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".dropdown-container")) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Definición de opciones con colores amigables
  const opciones: TabOption[] = [
    {
      id: "Configuración",
      label: "Configuración",
      icon: <Settings className="h-5 w-5" />,
      description: "Ajustes generales del sistema y preferencias",
      color: "blue",
    },
    {
      id: "Perfiles",
      label: "Perfiles",
      icon: <UserCog className="h-5 w-5" />,
      description: "Gestión de perfiles de usuario y permisos",
      color: "emerald",
    },
    {
      id: "Logs",
      label: "Logs",
      icon: <ClipboardList className="h-5 w-5" />,
      description: "Registro de actividades y eventos del sistema",
      color: "purple",
    },
    {
      id: "Crear Trabajador",
      label: "Crear Trabajador",
      icon: <Users className="h-5 w-5" />,
      description: "Añadir nuevos empleados al sistema",
      color: "orange",
    },
    {
      id: "Crear Departamento",
      label: "Crear Departamento",
      icon: <Building className="h-5 w-5" />,
      description: "Crear y configurar nuevos departamentos",
      color: "teal",
    },
    {
      id: "Crear Usuario",
      label: "Crear Usuario",
      icon: <UserPlus className="h-5 w-5" />,
      description: "Registrar nuevos usuarios en el sistema",
      color: "indigo",
    },
    {
      id: "Cargo",
      label: "Cargos",
      icon: <Car className="h-5 w-5" />,
      description: "Administrar cargos y posiciones laborales",
      color: "blue",
    },
    {
      id: "Configuración de la Planilla",
      label: "Configuración de la Planilla",
      icon: <Settings className="h-5 w-5" />,
      description: "Ajustes para la gestión de la planilla de pagos",
      color: "emerald",
    },

  ]

  const getColorClasses = (color: string, isActive = false) => {
    const colorMap: Record<string, { bg: string; text: string; hover: string; active: string }> = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        hover: "hover:bg-blue-100",
        active: "bg-blue-500 text-white",
      },
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        hover: "hover:bg-emerald-100",
        active: "bg-emerald-500 text-white",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        hover: "hover:bg-purple-100",
        active: "bg-purple-500 text-white",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        hover: "hover:bg-orange-100",
        active: "bg-orange-500 text-white",
      },
      teal: {
        bg: "bg-teal-50",
        text: "text-teal-700",
        hover: "hover:bg-teal-100",
        active: "bg-teal-500 text-white",
      },
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        hover: "hover:bg-indigo-100",
        active: "bg-indigo-500 text-white",
      },
    }

    const colors = colorMap[color] || colorMap.blue
    return isActive ? colors.active : `${colors.bg} ${colors.text} ${colors.hover}`
  }

  const getCurrentOption = () => {
    return opciones.find((o) => o.id === activeTab) || opciones[0]
  }

  const handleOptionSelect = (optionId: string) => {
    setActiveTab(optionId)
    setIsDropdownOpen(false)
  }

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
      case "Cargo":
        return <Cargos />
      case "Configuración de la Planilla":
        return <SaveUpdatePlanilla />
      default:
        return (
          <div className="text-center py-16">
            <div className="bg-blue-50 inline-block p-8 rounded-2xl mb-6">
              <Settings className="h-12 w-12 text-blue-400" />
            </div>
            <p className="text-gray-600 text-lg">Selecciona una opción para comenzar.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menú desplegable - CORREGIDO */}
        <div className="dropdown-container relative mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-between w-full px-6 py-4 rounded-2xl transition-all duration-200 ${getColorClasses(
              getCurrentOption().color,
              true,
            )} shadow-lg`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-white/20">{getCurrentOption().icon}</div>
              <div className="text-left">
                <div className="font-semibold text-lg">{getCurrentOption().label}</div>
                <div className="text-sm opacity-90">{getCurrentOption().description}</div>
              </div>
            </div>
            <ChevronDown
              className={`h-6 w-6 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </motion.button>

          {/* Dropdown menu - CORREGIDO */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ position: "absolute", top: "calc(100% + 12px)", left: 0, right: 0, zIndex: 100 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xl"
              >
                <div className="py-3">
                  {opciones.map((opcion, index) => (
                    <motion.button
                      key={opcion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                      onClick={() => handleOptionSelect(opcion.id)}
                      className={`w-full flex items-center space-x-4 px-6 py-4 transition-all duration-200 ${
                        activeTab === opcion.id
                          ? getColorClasses(opcion.color, true)
                          : `${getColorClasses(opcion.color)} hover:shadow-md`
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          activeTab === opcion.id ? "bg-white/20 shadow-lg" : "bg-white shadow-sm"
                        }`}
                      >
                        {opcion.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-base">{opcion.label}</div>
                        <div className="text-sm opacity-75">{opcion.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contenido principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
            <div className={`border-b border-gray-100 p-6 ${getColorClasses(getCurrentOption().color)} bg-opacity-30`}>
              <div className="flex items-center">
                <div className={`p-4 rounded-2xl mr-4 ${getColorClasses(getCurrentOption().color, true)} shadow-lg`}>
                  {getCurrentOption().icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{activeTab}</h2>
                  <p className="text-sm text-gray-600 mt-1">{getCurrentOption().description}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Ajustes
