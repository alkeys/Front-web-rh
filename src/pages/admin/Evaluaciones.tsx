
import { useRef } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type React from "react"
import { useEffect, useState } from "react"
import { Bar, Pie } from "react-chartjs-2"
import "chart.js/auto"
import type { ChartData } from "chart.js"
import { motion } from "framer-motion"
import {
  Users,
  BarChart,
  PieChart,
  Calendar,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Activity,
} from "lucide-react"

interface Evaluacion {
  pregunta: string
  puntaje: number
  comentario: string
  fecha: string
}

interface Empleado {
  nombre: string
  departamento: string
  evaluaciones: Evaluacion[]
}

const Evaluaciones: React.FC = () => {
  const exportRef = useRef<HTMLDivElement>(null)
  const url = import.meta.env.VITE_API_URL_EVALUACIONES_ALL
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [departamentos, setDepartamentos] = useState<string[]>([])
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<string>("")
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const exportarPDF = async () => {
    if (!exportRef.current) return
  
    const canvas = await html2canvas(exportRef.current, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${empleadoSeleccionado?.nombre || "evaluacion"}.pdf`)
  }
  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error("Error en la respuesta de la API")
        const data = await response.json()

        const agrupados: Empleado[] = data.reduce((acc: Empleado[], item: any) => {
          const nombreCompleto = `${item.empleado.nombre} ${item.empleado.apellido}`
          const departamento = item.empleado.departamento.nombre

          const nuevaEvaluacion: Evaluacion = {
            pregunta: item.pregunta.pregunta,
            puntaje: item.calificacion * 20,
            comentario: item.comentario,
            fecha: item.fechaEvaluacion,
          }

          const empleadoExistente = acc.find((e) => e.nombre === nombreCompleto)

          if (empleadoExistente) {
            empleadoExistente.evaluaciones.push(nuevaEvaluacion)
          } else {
            acc.push({
              nombre: nombreCompleto,
              departamento,
              evaluaciones: [nuevaEvaluacion],
            })
          }

          return acc
        }, [])

        setEmpleados(agrupados)
        setDepartamentos([...new Set(agrupados.map((e) => e.departamento))])
        setDepartamentoSeleccionado(agrupados[0]?.departamento || "")
        setEmpleadoSeleccionado(agrupados[0] || null)
      } catch (error) {
        console.error("Error al obtener los datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url])

  const empleadosFiltrados = empleados.filter((e) => e.departamento === departamentoSeleccionado)

  const preguntasFiltradas =
    empleadoSeleccionado?.evaluaciones
      .map((ev) => ev.pregunta)
      .filter((pregunta) =>
        empleadosFiltrados.some(
          (emp) =>
            emp.nombre !== empleadoSeleccionado.nombre && emp.evaluaciones.some((ev) => ev.pregunta === pregunta),
        ),
      ) || []

  // Colores modernos y minimalistas
  const colors = {
    primary: "#6366f1",
    secondary: "#a5b4fc",
    tertiary: "#818cf8",
    light: "#eef2ff",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    text: "#4b5563",
    background: "#ffffff",
    chart: ["#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca"],
  }

  const datasetSeleccionado = {
    label: empleadoSeleccionado?.nombre || "Empleado",
    data: preguntasFiltradas.map(
      (pregunta) => empleadoSeleccionado?.evaluaciones.find((ev) => ev.pregunta === pregunta)?.puntaje || 0,
    ),
    backgroundColor: colors.primary,
    borderRadius: 4,
  }

  const datasetPromedio = {
    label: "Promedio del Departamento",
    data: preguntasFiltradas.map((pregunta) => {
      const puntajes = empleadosFiltrados
        .filter((emp) => emp.nombre !== empleadoSeleccionado?.nombre)
        .map((emp) => emp.evaluaciones.find((ev) => ev.pregunta === pregunta)?.puntaje || 0)
        .filter((p) => p > 0)
      return puntajes.length ? puntajes.reduce((a, b) => a + b, 0) / puntajes.length : 0
    }),
    backgroundColor: colors.secondary,
    borderRadius: 4,
  }

  const barChartData: ChartData<"bar"> = {
    labels: preguntasFiltradas.map((str) => (str.length > 25 ? str.substring(0, 25) + "..." : str)),
    datasets: [datasetSeleccionado, datasetPromedio],
  }

  const barChartOptions = {
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
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`,
        },
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  }

  const pieChartData = {
    labels: empleadoSeleccionado?.evaluaciones.map((ev) =>
      ev.pregunta.length > 20 ? ev.pregunta.substring(0, 20) + "..." : ev.pregunta,
    ),
    datasets: [
      {
        label: "Distribución de Evaluaciones",
        data: empleadoSeleccionado?.evaluaciones.map((ev) => ev.puntaje),
        backgroundColor: colors.chart,
        borderWidth: 0,
      },
    ],
  }

  const pieChartOptions = {
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
    },
  }

  const requiereAtencion = empleadoSeleccionado?.evaluaciones.some((ev) => ev.puntaje < 60)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Calcular promedio general
  const promedio = empleadoSeleccionado?.evaluaciones.length
    ? empleadoSeleccionado.evaluaciones.reduce((acc, ev) => acc + ev.puntaje, 0) /
      empleadoSeleccionado.evaluaciones.length
    : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-800" ref={exportRef}>
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0 flex items-center">
              <Activity className="mr-2 h-6 w-6 text-indigo-500" />
              Evaluaciones de Desempeño
            </h1>

            <div className="w-full sm:w-auto max-w-xs">
              <label className="sr-only">Filtrar por departamento</label>
              <div className="relative">
                <select
                  className="w-full pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                  value={departamentoSeleccionado}
                  onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
                >
                  {departamentos.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <button
  onClick={exportarPDF}
  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
>
  Exportar a PDF
</button>

        </div>
    
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Dashboard layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
                <Users className="mr-2 h-4 w-4 text-indigo-500" />
                <h2 className="text-sm font-medium text-gray-700">Empleados</h2>
              </div>

              <div className="max-h-[600px] overflow-y-auto p-1">
                {empleadosFiltrados.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {empleadosFiltrados.map((empleado, idx) => (
                      <motion.li
                        key={idx}
                        onClick={() => setEmpleadoSeleccionado(empleado)}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          empleadoSeleccionado?.nombre === empleado.nombre ? "bg-indigo-50" : "hover:bg-gray-50"
                        }`}
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              empleadoSeleccionado?.nombre === empleado.nombre
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {empleado.nombre.charAt(0)}
                          </div>

                          <div>
                            <p
                              className={`text-sm font-medium ${
                                empleadoSeleccionado?.nombre === empleado.nombre ? "text-indigo-700" : "text-gray-700"
                              }`}
                            >
                              {empleado.nombre}
                            </p>
                            <p className="text-xs text-gray-500">{empleado.evaluaciones.length} evaluaciones</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">No hay empleados en este departamento</div>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {empleadoSeleccionado ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-indigo-50 mr-3">
                        <Activity className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Promedio</p>
                        <p className="text-xl font-bold text-gray-900">{promedio.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-indigo-50 mr-3">
                        <BarChart className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Evaluaciones</p>
                        <p className="text-xl font-bold text-gray-900">{empleadoSeleccionado.evaluaciones.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${requiereAtencion ? "bg-amber-50" : "bg-emerald-50"} mr-3`}>
                        {requiereAtencion ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Estado</p>
                        <p className={`text-sm font-bold ${requiereAtencion ? "text-amber-600" : "text-emerald-600"}`}>
                          {requiereAtencion ? "Requiere atención" : "Aceptable"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  {preguntasFiltradas.length > 0 ? (
                    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex items-center">
                        <BarChart className="mr-2 h-4 w-4 text-indigo-500" />
                        <h2 className="text-sm font-medium text-gray-700">Comparativa</h2>
                      </div>
                      <div className="p-4 h-[350px]">
                        <Bar data={barChartData} options={barChartOptions} />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center">
                      <BarChart className="h-10 w-10 text-gray-300 mb-2" />
                      <h3 className="text-sm font-medium text-gray-700">No hay datos comparativos</h3>
                      <p className="text-xs text-gray-500 mt-1">No hay preguntas en común para comparar</p>
                    </div>
                  )}

                  {/* Pie Chart */}
                  <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center">
                      <PieChart className="mr-2 h-4 w-4 text-indigo-500" />
                      <h2 className="text-sm font-medium text-gray-700">Distribución</h2>
                    </div>
                    <div className="p-4 h-[350px]">
                      <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                  </div>
                </div>

                {/* Evaluations Detail */}
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-indigo-500" />
                    <h2 className="text-sm font-medium text-gray-700">Detalle de Evaluaciones</h2>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {empleadoSeleccionado.evaluaciones.map((ev, idx) => (
                      <div key={idx} className="p-4 transition-colors hover:bg-gray-50">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                ev.puntaje < 60
                                  ? "bg-red-100 text-red-600"
                                  : ev.puntaje < 80
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-emerald-100 text-emerald-600"
                              }`}
                            >
                              {ev.puntaje}
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{ev.pregunta}</h3>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {formatDate(ev.fecha)}
                          </div>
                        </div>

                        <div className="pl-12">
                          <p className="text-xs text-gray-700 mt-1 whitespace-pre-wrap line-clamp-2 hover:line-clamp-none">
                            {ev.comentario || "Sin comentario"}
                          </p>

                          <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                ev.puntaje < 60 ? "bg-red-500" : ev.puntaje < 80 ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${ev.puntaje}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-center">
                <Users className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">Ningún empleado seleccionado</h3>
                <p className="text-sm text-gray-500 max-w-md mt-2">
                  Selecciona un empleado de la lista para ver sus evaluaciones detalladas y gráficos comparativos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Evaluaciones
