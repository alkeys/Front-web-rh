"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title } from "chart.js"
import { motion } from "framer-motion"
import {
  Users,
  Building,
  Briefcase,
  TrendingUp,
  BarChart,
  PieChart,
  RefreshCw,
  Calendar,
  Award,
  Activity,
} from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title)

const Dashboard: React.FC = () => {
  const [cantidad, setCantidad] = useState<number | null>(null)
  const [departamentos, setDepartamentos] = useState<number | null>(null)
  const [cargos, setCargos] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // URLs de API
  const urlapiEmpleadoCantidad = import.meta.env.VITE_API_URL_COUNT_EMPLEADOS
  const utlDepartamento = import.meta.env.VITE_API_URL_COUNT_DEPARTAMENTOS
  const urlapiCargosCantidad = import.meta.env.VITE_API_URL_COUNT_CARGOS

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Cargar datos en paralelo
      const [empleadosRes, departamentosRes, cargosRes] = await Promise.all([
        fetch(urlapiEmpleadoCantidad),
        fetch(utlDepartamento),
        fetch(urlapiCargosCantidad),
      ])

      // Procesar respuestas
      const empleadosData = await empleadosRes.json()
      const departamentosData = await departamentosRes.json()
      const cargosData = await cargosRes.json()

      // Actualizar estados
      setCantidad(empleadosData)
      setDepartamentos(departamentosData)
      setCargos(cargosData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Configuración de gráficos
  const barData = {
    labels: ["Empleados", "Departamentos", "Cargos"],
    datasets: [
      {
        label: "Totales",
        data: [cantidad, departamentos, cargos],
        backgroundColor: ["#818cf8", "#34d399", "#fbbf24"],
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  }

  const barOptions = {
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
        text: "Distribución de Recursos",
        font: {
          size: 14,
          weight: 700, // Use a numeric value for weight
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 11,
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

  const pieData = {
    labels: ["Empleados", "Departamentos", "Cargos"],
    datasets: [
      {
        data: [cantidad, departamentos, cargos],
        backgroundColor: ["#818cf8", "#34d399", "#fbbf24"],
        borderWidth: 0,
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: "Proporción de Recursos",
        font: {
          size: 14,
          weight: 700,
        },
        padding: {
          bottom: 20,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-indigo-600" />
              By aviles Para mi perrita Dolly
            </h1>

            <button
              onClick={fetchData}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Actualizar datos
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Última actualización */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Última actualización: {formatDate(lastUpdated)}</span>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tarjeta de Empleados */}
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
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">Empleados</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">Total</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                  ) : (
                    <CounterAnimation value={cantidad} />
                  )}
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Activos</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-indigo-500"></div>
          </motion.div>

          {/* Tarjeta de Departamentos */}
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
                    <Building className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">Departamentos</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Total
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                  ) : (
                    <CounterAnimation value={departamentos} />
                  )}
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Activos</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-emerald-500"></div>
          </motion.div>

          {/* Tarjeta de Cargos */}
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
                    <Briefcase className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">Cargos</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">Total</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                  ) : (
                    <CounterAnimation value={cargos} />
                  )}
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Activos</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-amber-500"></div>
          </motion.div>

          {/* Tarjeta de Rendimiento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 mr-3">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-700">Rendimiento</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                  Promedio
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">95%</div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Óptimo</span>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-purple-500"></div>
          </motion.div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Barras */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 flex items-center">
              <BarChart className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Análisis Comparativo</h3>
            </div>
            <div className="p-5 h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <Bar data={barData} options={barOptions} />
              )}
            </div>
          </motion.div>

          {/* Gráfico Circular */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 flex items-center">
              <PieChart className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Distribución Proporcional</h3>
            </div>
            <div className="p-5 h-80">
                {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
                ) : (
                <Pie data={pieData} options={pieOptions} />
                )}
            </div>
          </motion.div>
        </div>

        {/* Resumen y Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 flex items-center">
            <Activity className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Resumen del Sistema</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="h-4 w-4 text-indigo-600 mr-2" />
                  Empleados por Departamento
                </h4>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    Promedio:{" "}
                    <span className="font-medium text-gray-900">
                      {isLoading || !cantidad || !departamentos ? "-" : Math.round(cantidad / departamentos)}
                    </span>{" "}
                    empleados
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-indigo-600 h-1.5 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Building className="h-4 w-4 text-emerald-600 mr-2" />
                  Cargos por Departamento
                </h4>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    Promedio:{" "}
                    <span className="font-medium text-gray-900">
                      {isLoading || !cargos || !departamentos ? "-" : Math.round(cargos / departamentos)}
                    </span>{" "}
                    cargos
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-emerald-600 h-1.5 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Briefcase className="h-4 w-4 text-amber-600 mr-2" />
                  Empleados por Cargo
                </h4>
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    Promedio:{" "}
                    <span className="font-medium text-gray-900">
                      {isLoading || !cantidad || !cargos ? "-" : Math.round(cantidad / cargos)}
                    </span>{" "}
                    empleados
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-amber-600 h-1.5 rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
