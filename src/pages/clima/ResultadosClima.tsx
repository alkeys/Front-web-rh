"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import {
  TrendingUp,
  Award,
  BarChart3,
  Target,
  Star,
  Trophy,
  Sparkles,
  Heart,
  ThumbsUp,
  Zap,
  Crown,
  Loader2,
  Download,
  PieChart,
  BarChart,
  FileText,
} from "lucide-react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface Respuesta {
  id: number
  calificacion: number
  idPregunta: {
    id: number
    texto: string
    idDim: {
      id: number
      nombre: string
      descripcion: string
    }
  }
}

interface ResultadoDimension {
  dimension: string
  promedio: number
  porcentaje: string
  calificacion: string
}

const API_RESPUESTAS = import.meta.env.VITE_API_URL_CLIMA_RESPUESTAS_ALL

const clasificar = (prom: number): string => {
  if (prom >= 4.5) return "Superior"
  if (prom >= 4.0) return "Excelente"
  if (prom >= 3.5) return "Satisfactorio"
  return "No satisfactorio"
}

const COLORS = [
  "#FF6B9D", // Rosa chicle
  "#A855F7", // Púrpura
  "#06B6D4", // Cyan
  "#10B981", // Esmeralda
  "#F59E0B", // Ámbar
  "#EF4444", // Rojo
  "#8B5CF6", // Violeta
  "#F97316", // Naranja
]

const ResultadosClima: React.FC = () => {
  const [resultados, setResultados] = useState<ResultadoDimension[]>([])
  const [indiceGeneral, setIndiceGeneral] = useState<{ porcentaje: string; calificacion: string }>({
    porcentaje: "",
    calificacion: "",
  })
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [activeChart, setActiveChart] = useState<"bar" | "pie" | "radar">("bar")

  useEffect(() => {
    setLoading(true)
    axios
      .get<Respuesta[]>(API_RESPUESTAS)
      .then((res) => {
        const agrupado: { [dim: string]: number[] } = {}

        res.data.forEach((r) => {
          const dim = r.idPregunta.idDim.nombre
          if (!agrupado[dim]) agrupado[dim] = []
          agrupado[dim].push(r.calificacion)
        })

        const resultadosTemp: ResultadoDimension[] = []
        const todasLasNotas: number[] = []

        for (const [dimension, calificaciones] of Object.entries(agrupado)) {
          const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length
          const porcentaje = promedio * 20
          todasLasNotas.push(...calificaciones)

          resultadosTemp.push({
            dimension,
            promedio: Number.parseFloat(promedio.toFixed(2)),
            porcentaje: `${porcentaje.toFixed(2)}%`,
            calificacion: clasificar(promedio),
          })
        }

        const promGeneral = todasLasNotas.reduce((a, b) => a + b, 0) / todasLasNotas.length
        const porcGeneral = promGeneral * 20

        setResultados(resultadosTemp)
        setIndiceGeneral({
          porcentaje: `${porcGeneral.toFixed(2)}%`,
          calificacion: clasificar(promGeneral),
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const getCalificacionColor = (calificacion: string) => {
    switch (calificacion) {
      case "Superior":
        return "from-emerald-400 to-teal-500"
      case "Excelente":
        return "from-blue-400 to-cyan-500"
      case "Satisfactorio":
        return "from-yellow-400 to-orange-500"
      default:
        return "from-red-400 to-pink-500"
    }
  }

  const getCalificacionIcon = (calificacion: string) => {
    switch (calificacion) {
      case "Superior":
        return <Crown className="h-5 w-5" />
      case "Excelente":
        return <Trophy className="h-5 w-5" />
      case "Satisfactorio":
        return <ThumbsUp className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const getCalificacionEmoji = (calificacion: string) => {
    switch (calificacion) {
      case "Superior":
        return "🏆"
      case "Excelente":
        return "⭐"
      case "Satisfactorio":
        return "👍"
      default:
        return "📈"
    }
  }

  const getDimensionColor = (index: number) => {
    const colors = [
      "from-pink-400 to-rose-500",
      "from-purple-400 to-indigo-500",
      "from-blue-400 to-cyan-500",
      "from-green-400 to-emerald-500",
      "from-yellow-400 to-orange-500",
      "from-red-400 to-pink-500",
      "from-teal-400 to-cyan-500",
      "from-indigo-400 to-purple-500",
    ]
    return colors[index % colors.length]
  }

  const getProgressWidth = (porcentaje: string) => {
    return Number.parseFloat(porcentaje.replace("%", ""))
  }

  // Preparar datos para gráficas
  const chartData = resultados.map((resultado, index) => ({
    name: resultado.dimension.length > 12 ? resultado.dimension.substring(0, 12) + "..." : resultado.dimension,
    fullName: resultado.dimension,
    promedio: Number(resultado.promedio),
    porcentaje: getProgressWidth(resultado.porcentaje),
    fill: COLORS[index % COLORS.length],
  }))

  const pieData = resultados.map((resultado, index) => ({
    name: resultado.dimension,
    value: resultado.promedio,
    fill: COLORS[index % COLORS.length],
  }))

  const radarData = resultados.map((resultado) => ({
    dimension: resultado.dimension.length > 10 ? resultado.dimension.substring(0, 10) + "..." : resultado.dimension,
    fullName: resultado.dimension,
    value: resultado.promedio,
  }))

  const exportToPDF = async () => {
    setExporting(true)
    try {
      const element = document.getElementById("dashboard-content")
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fdf2f8",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`clima-organizacional-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error al exportar PDF:", error)
    } finally {
      setExporting(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-purple-100">
          <p className="font-semibold text-gray-800 mb-2">{data?.fullName || label}</p>
          <p className="text-purple-600">
            <span className="font-medium">Promedio: </span>
            {data?.promedio?.toFixed(2)}/5
          </p>
          <p className="text-cyan-600">
            <span className="font-medium">Porcentaje: </span>
            {(data?.promedio * 20)?.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto" id="dashboard-content">
        {/* Header con botón de exportar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            Resultados del Clima Organizacional
          </h1>
          <p className="text-gray-600 text-lg mb-6">¡Descubre cómo se siente tu equipo! 💖</p>

          {/* Botón de exportar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToPDF}
            disabled={exporting}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transition-shadow disabled:opacity-70"
          >
            {exporting ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Generando PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-6 w-6" />
                <span>Exportar a PDF</span>
                <FileText className="h-6 w-6" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Índice General */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100">
            <div className={`bg-gradient-to-r ${getCalificacionColor(indiceGeneral.calificacion)} p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 rounded-3xl">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Índice General del Clima Organizacional</h2>
                    <p className="text-white/90 mt-1">Resultado consolidado de todas las dimensiones</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-6xl mb-2">{getCalificacionEmoji(indiceGeneral.calificacion)}</div>
                  <div className="text-3xl font-bold">{indiceGeneral.porcentaje}</div>
                  <div className="text-xl font-semibold">{indiceGeneral.calificacion}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gráficas Comparativas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-cyan-100">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Análisis Comparativo Visual</h2>
                    <p className="text-cyan-100 mt-1">Gráficas interactivas para comparar dimensiones</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveChart("bar")}
                    className={`p-2 rounded-xl transition-colors ${
                      activeChart === "bar" ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <BarChart className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveChart("pie")}
                    className={`p-2 rounded-xl transition-colors ${
                      activeChart === "pie" ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <PieChart className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveChart("radar")}
                    className={`p-2 rounded-xl transition-colors ${
                      activeChart === "radar" ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <Target className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfica Principal */}
                <div className="bg-gradient-to-br from-gray-50 to-cyan-50 rounded-2xl p-6 border border-cyan-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    {activeChart === "bar" && <BarChart className="h-5 w-5 text-cyan-600" />}
                    {activeChart === "pie" && <PieChart className="h-5 w-5 text-cyan-600" />}
                    {activeChart === "radar" && <Target className="h-5 w-5 text-cyan-600" />}
                    <span>
                      {activeChart === "bar" && "Comparación por Barras"}
                      {activeChart === "pie" && "Distribución Circular"}
                      {activeChart === "radar" && "Análisis Radar"}
                    </span>
                  </h3>
                  <div className="h-80">
                    {activeChart === "bar" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                          />
                          <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} domain={[0, 5]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="promedio" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    )}
                    {activeChart === "pie" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, value }) => `${name.substring(0, 8)}: ${value.toFixed(1)}`}
                            labelLine={false}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                    {activeChart === "radar" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e0e7ff" />
                          <PolarAngleAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
                          <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10, fill: "#6b7280" }} />
                          <Radar
                            name="Promedio"
                            dataKey="value"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.3}
                            strokeWidth={3}
                          />
                          <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Gráfica de Tendencias */}
                <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span>Línea de Tendencias</span>
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} domain={[0, 5]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="promedio"
                          stroke="#8b5cf6"
                          strokeWidth={4}
                          dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: "#a855f7" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resultados por Dimensión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100">
            <div className="bg-gradient-to-r from-purple-400 to-cyan-500 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Resultados por Dimensión</h2>
                  <p className="text-purple-100 mt-1">Análisis detallado de cada área evaluada</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {resultados.map((resultado, index) => (
                  <motion.div
                    key={resultado.dimension}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-6 border border-purple-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-10 w-10 rounded-xl bg-gradient-to-br ${getDimensionColor(index)} flex items-center justify-center text-white`}
                        >
                          <Star className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-800">{resultado.dimension}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl">{getCalificacionEmoji(resultado.calificacion)}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Promedio */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Promedio:</span>
                        <span className="font-bold text-lg text-gray-800">{resultado.promedio}/5</span>
                      </div>

                      {/* Porcentaje */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Porcentaje:</span>
                        <span className="font-bold text-lg text-gray-800">{resultado.porcentaje}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progreso</span>
                          <span className="text-gray-500">{resultado.porcentaje}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgressWidth(resultado.porcentaje)}%` }}
                            className={`bg-gradient-to-r ${getDimensionColor(index)} rounded-full h-3`}
                            transition={{ duration: 1, delay: index * 0.1 + 0.6 }}
                          />
                        </div>
                      </div>

                      {/* Calificación */}
                      <div
                        className={`bg-gradient-to-r ${getCalificacionColor(resultado.calificacion)} text-white rounded-xl p-3 flex items-center justify-center space-x-2`}
                      >
                        {getCalificacionIcon(resultado.calificacion)}
                        <span className="font-semibold">{resultado.calificacion}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clasificación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-yellow-100"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Clasificación de Resultados</h2>
                <p className="text-yellow-100 mt-1">Escala de evaluación del clima organizacional</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-3">🏆</div>
                <div className="font-bold text-lg mb-2">Superior</div>
                <div className="text-emerald-100 text-sm">90–100%</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-3">⭐</div>
                <div className="font-bold text-lg mb-2">Excelente</div>
                <div className="text-blue-100 text-sm">80–89%</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-3">👍</div>
                <div className="font-bold text-lg mb-2">Satisfactorio</div>
                <div className="text-yellow-100 text-sm">70–79%</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-red-400 to-pink-500 text-white rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-3">📈</div>
                <div className="font-bold text-lg mb-2">No satisfactorio</div>
                <div className="text-red-100 text-sm">0–69%</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResultadosClima
