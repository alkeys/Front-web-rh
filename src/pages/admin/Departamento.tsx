"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building,
  Search,
  Users,
  Edit,
  RefreshCw,
  BarChart,
  ArrowUpRight,
  Filter,
  ChevronDown,
  ArrowDownAZ,
  ArrowUpAZ,
  AlertTriangle,
} from "lucide-react"

interface DepartamentoData {
  id: number
  nombre: string
  cantidad: number
}

const Departamento: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<DepartamentoData[]>([])
  const [departamentosFiltrados, setDepartamentosFiltrados] = useState<DepartamentoData[]>([])
  const [count, setCount] = useState<number | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "cantidad-asc" | "cantidad-desc">("asc")
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // URLs de API
  const urlapiDerpartamentoAllCantEmpleado = import.meta.env.VITE_API_URL_GET_DEPARTAMENTO_ALL_CANT_EMPLEADOS
  const urlapiDerpartamentoCount = import.meta.env.VITE_API_URL_COUNT_DEPARTAMENTOS

  const cargarDatos = async () => {
    setIsLoading(true)
    setIsRefreshing(true)
    try {
      const [resDep, resCount] = await Promise.all([
        fetch(urlapiDerpartamentoAllCantEmpleado),
        fetch(urlapiDerpartamentoCount),
      ])

      if (!resDep.ok || !resCount.ok) throw new Error("Error al obtener los datos")

      const dataDeps = await resDep.json()
      const dataCount = await resCount.json()

      setDepartamentos(dataDeps)
      setDepartamentosFiltrados(dataDeps)
      setCount(dataCount)
      setLastUpdated(new Date())
      showNotification("success", "Datos actualizados correctamente")
    } catch (error) {
      console.error("Error al cargar datos:", error)
      showNotification("error", "Error al cargar los datos")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    let resultado = [...departamentos]

    // Aplicar filtro de búsqueda
    if (busqueda) {
      resultado = resultado.filter((dep) => dep.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    }

    // Aplicar ordenamiento
    switch (sortOrder) {
      case "asc":
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre))
        break
      case "desc":
        resultado.sort((a, b) => b.nombre.localeCompare(a.nombre))
        break
      case "cantidad-asc":
        resultado.sort((a, b) => a.cantidad - b.cantidad)
        break
      case "cantidad-desc":
        resultado.sort((a, b) => b.cantidad - a.cantidad)
        break
    }

    setDepartamentosFiltrados(resultado)
  }, [busqueda, departamentos, sortOrder])

  // Colores para el gráfico
  const colores = [
    "#818cf8", // Indigo
    "#34d399", // Emerald
    "#fbbf24", // Amber
    "#f87171", // Red
    "#a78bfa", // Violet
    "#14b8a6", // Teal
    "#f472b6", // Pink
    "#f97316", // Orange
    "#38bdf8", // Sky
    "#84cc16", // Lime
    "#6366f1", // Indigo
    "#06b6d4", // Cyan
    "#fb923c", // Orange
  ]

  // Configuración del gráfico
  const chartData = {
    labels: departamentosFiltrados.map((d) => d.nombre),
    datasets: [
      {
        label: "Empleados",
        data: departamentosFiltrados.map((d) => d.cantidad),
        backgroundColor: departamentosFiltrados.map((_, i) => colores[i % colores.length]),
        borderRadius: 6,
        barThickness: 40,
        maxBarThickness: 60,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Distribución de Empleados por Departamento",
        font: {
          size: 14,
          weight: "bold" as "bold",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: (context: any) => `${context.parsed.y} empleados`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "Número de Empleados",
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  }

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Animación para los números
  const CounterAnimation = ({ value }: { value: number | null }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (value === null) return

      let start = 0
      const end = value
      const duration = 1500
      const increment = end / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }, [value])

    return <>{value === null ? "-" : count}</>
  }

  // Calcular estadísticas
  const departamentoConMasEmpleados = departamentos.reduce((max, dep) => (dep.cantidad > max.cantidad ? dep : max), {
    id: 0,
    nombre: "",
    cantidad: 0,
  })

  const promedioEmpleadosPorDepartamento =
    departamentos.length > 0 ? departamentos.reduce((sum, dep) => sum + dep.cantidad, 0) / departamentos.length : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Building className="mr-2 h-5 w-5 text-indigo-600" />
              Gestión de Departamentos
            </h1>

            <div className="flex items-center gap-3">
              <button
                onClick={cargarDatos}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefreshing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Actualizar
              </button>

    
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Última actualización */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <RefreshCw className="h-4 w-4 mr-1" />
          <span>Última actualización: {formatDate(lastUpdated)}</span>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de Total Departamentos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-indigo-100 mr-3">
                    <Building className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">Total Departamentos</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">Total</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                  ) : (
                    <CounterAnimation value={count} />
                  )}
                </div>
                <div className="flex items-center text-sm text-indigo-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>Activos</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-indigo-500"></div>
          </motion.div>

          {/* Tarjeta de Departamento con más empleados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-emerald-100 mr-3">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">Departamento más grande</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Máximo
                </span>
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {isLoading ? (
                    <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
                  ) : departamentoConMasEmpleados.nombre ? (
                    departamentoConMasEmpleados.nombre
                  ) : (
                    "No hay datos"
                  )}
                </div>
                <div className="flex items-center text-sm text-emerald-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span>
                    {isLoading ? (
                      <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
                    ) : departamentoConMasEmpleados.cantidad ? (
                      `${departamentoConMasEmpleados.cantidad} empleados`
                    ) : (
                      "0 empleados"
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-emerald-500"></div>
          </motion.div>

          {/* Tarjeta de Promedio de empleados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-amber-100 mr-3">
                    <BarChart className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">Promedio de empleados</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">Promedio</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                  ) : (
                    promedioEmpleadosPorDepartamento.toFixed(1)
                  )}
                </div>
                <div className="flex items-center text-sm text-amber-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Por departamento</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-amber-500"></div>
          </motion.div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar departamento..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <button
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "cantidad-asc" : "cantidad-desc")
                  }
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Ordenar por{" "}
                  {sortOrder === "asc" || sortOrder === "desc"
                    ? "Nombre"
                    : sortOrder === "cantidad-asc" || sortOrder === "cantidad-desc"
                      ? "Cantidad"
                      : ""}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                <div className="absolute right-2 top-2">
                  {sortOrder === "asc" || sortOrder === "cantidad-asc" ? (
                    <ArrowUpAZ className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ArrowDownAZ className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gráfico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 flex items-center">
            <BarChart className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Distribución de Empleados por Departamento</h3>
          </div>
          <div className="p-5 h-80">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : departamentosFiltrados.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <p className="text-gray-600 text-center">No hay datos para mostrar con los filtros actuales</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabla de departamentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Lista de Departamentos</h3>
            </div>
            <span className="text-xs text-gray-500">
              {departamentosFiltrados.length} de {departamentos.length} departamentos
            </span>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : departamentosFiltrados.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Cantidad de Empleados</th>
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {departamentosFiltrados.map((dep, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{
                        backgroundColor: idx % 2 === 0 ? "white" : "rgb(249, 250, 251)",
                      }}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${colores[idx % colores.length]}20` }}
                          >
                            <Building className="h-4 w-4" style={{ color: colores[idx % colores.length] }} />
                          </div>
                          {dep.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{dep.cantidad} empleados</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron departamentos con los filtros actuales</p>
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-500">
            <p>Sistema de Gestión de Recursos Humanos</p>
          </div>
        </motion.div>
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

export default Departamento
