"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useUserContext } from "../../context/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Users,
  ClipboardList,
  UserPlus,
  FileText,
  FileQuestion,
  Edit,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  Plus,
} from "lucide-react"

// Importación de componentes
import Hola from "./hola"
import Empleados from "../admin/Empleados"
import Evaluaciones from "../admin/Evaluaciones"
import CrearTrabajador from "../ajustes/CrearTrabajador"
import CrearEvaluacion from "./EvaluacionCrear"
import CrearPregunta from "./CrearPregunta"
import EditarEvaluacionYPreguntas from "./EditarEvaluacionYPreguntas"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  category?: string
}

export default function RhPanel() {
  const [activeTab, setActiveTab] = useState("Welcome")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const { user } = useUserContext()
  const urlapiEstado = import.meta.env.VITE_API_URL_ESTADO_USER

  // Función para construir la URL para cambiar el estado del usuario
  const cargarUrlActivo = (estado: boolean) => {
    return user ? `${urlapiEstado}?id=${user.id}&active=${estado}` : ""
  }

  // Mostrar notificaciones
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    if (!user) {
      // window.location.href = '/login';
    } else {
      // Cambiar el estado del usuario a activo
      const url = cargarUrlActivo(true)
      if (url) {
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              console.log("Usuario activado")
            } else {
              console.log("Error al activar usuario")
            }
          })
          .catch(() => {
            console.log("Error al activar usuario")
          })
      }
    }
  }, [])

  const cerrarSesion = () => {
    setIsLoading(true)
    const url = cargarUrlActivo(false)
    if (url) {
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            showNotification("success", "Sesión cerrada correctamente")
            setTimeout(() => {
              window.location.href = "/"
            }, 1000)
          } else {
            showNotification("error", "Error al cerrar sesión")
            setIsLoading(false)
          }
        })
        .catch(() => {
          showNotification("error", "Error al cerrar sesión")
          setIsLoading(false)
        })
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Welcome":
        return <Hola nombre={user?.username || ""} />
      case "employees":
        return <Empleados />
      case "evaluaciones":
        return <Evaluaciones />
      case "newEmpleado":
        return <CrearTrabajador />
      case "newEvaluacion":
        return <CrearEvaluacion />
      case "NewPregutas":
        return <CrearPregunta />
      case "EditarEvaluacionAndPreguntas":
        return <EditarEvaluacionYPreguntas />
      default:
        return <Hola nombre={user?.username || ""} />
    }
  }

  // Elementos de navegación
  const navItems: NavItem[] = [
    { id: "Welcome", label: "Inicio", icon: <Home className="h-5 w-5" /> },
    { id: "employees", label: "Empleados", icon: <Users className="h-5 w-5" /> },
    { id: "evaluaciones", label: "Evaluaciones", icon: <ClipboardList className="h-5 w-5" /> },
    { id: "newEmpleado", label: "Nuevo Empleado", icon: <UserPlus className="h-5 w-5" />, category: "crear" },
    { id: "newEvaluacion", label: "Nueva Evaluación", icon: <FileText className="h-5 w-5" />, category: "crear" },
    { id: "NewPregutas", label: "Nueva Pregunta", icon: <FileQuestion className="h-5 w-5" />, category: "crear" },
    {
      id: "EditarEvaluacionAndPreguntas",
      label: "Editar Evaluación",
      icon: <Edit className="h-5 w-5" />,
      category: "editar",
    },
  ]

  // Filtrar elementos de navegación por categoría
  const mainNavItems = navItems.filter((item) => !item.category)
  const createNavItems = navItems.filter((item) => item.category === "crear")
  const editNavItems = navItems.filter((item) => item.category === "editar")

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y título */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden md:block ml-4">
                <h1 className="text-xl font-bold text-gray-900">Panel de Recursos Humanos</h1>
              </div>
            </div>

            {/* Navegación para escritorio */}
            <nav className="hidden md:flex space-x-1">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center ${
                    activeTab === item.id
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}

              {/* Menú desplegable para Crear */}
              <div className="relative group">
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center ${
                    createNavItems.some((item) => activeTab === item.id)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Crear
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {createNavItems.map((item) => (
                      <button
                        key={item.id}
                        className={`w-full text-left block px-4 py-2 text-sm ${
                          activeTab === item.id ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{item.icon}</span>
                          {item.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Menú desplegable para Editar */}
              <div className="relative group">
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center ${
                    editNavItems.some((item) => activeTab === item.id)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Edit className="mr-2 h-5 w-5" />
                  Editar
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {editNavItems.map((item) => (
                      <button
                        key={item.id}
                        className={`w-full text-left block px-4 py-2 text-sm ${
                          activeTab === item.id ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{item.icon}</span>
                          {item.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Acciones de usuario */}
            <div className="flex items-center">
              {/* Botón de búsqueda */}
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 mr-2">
                <Search className="h-5 w-5" />
              </button>

              {/* Botón de notificaciones */}
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 mr-2">
                <Bell className="h-5 w-5" />
              </button>

              {/* Menú de usuario */}
              <div className="relative ml-3">
                <div>
                  <button
                    className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-emerald-700" />
                    </div>
                    <span className="hidden md:flex items-center ml-2 text-sm font-medium text-gray-700">
                      {user?.username || "Usuario"}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </span>
                  </button>
                </div>

                {/* Menú desplegable de usuario */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.username || "Usuario"}</p>
                          <p className="text-xs text-gray-500 truncate">Recursos Humanos</p>
                        </div>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Perfil
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Configuración
                        </a>
                        <button
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={cerrarSesion}
                          disabled={isLoading}
                        >
                          {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Botón de menú móvil */}
              <div className="md:hidden ml-3">
                <button
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      activeTab === item.id
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      setActiveTab(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                <button
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  onClick={cerrarSesion}
                  disabled={isLoading}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow flex">
        <div className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mr-2">
                <Users className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} RRHH. Todos los derechos reservados.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Términos
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Privacidad
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </footer>

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
                <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex-shrink-0 h-5 w-5 text-red-500 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
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
  )
}
