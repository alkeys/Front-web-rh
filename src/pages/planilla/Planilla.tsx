"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import {
  Calculator,
  Users,
  DollarSign,
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Calendar,
  Gift,
  Plane,
  Clock,
} from "lucide-react"

interface Departamento {
  id: number
  nombre: string
}

interface Cargo {
  id: number
  nombre: string
  salarioBase: number
}

interface Empleado {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  fechaContratacion: string
  departamento: Departamento
  cargo: Cargo
}

interface ObligacionesData {
  afpEmpleado: number
  afpPatronal: number
  issEmpleado: number
  issPatronal: number
}

const Planilla: React.FC = () => {
  const urlApiEmpleados = import.meta.env.VITE_API_URL_GET_ALL_EMPLEADOS
  const urlApiObligacionesIssAfp = import.meta.env.VITE_API_URL_GET_ALL_OBLIGACIONES_ISS_AFP

  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [filteredEmpleados, setFilteredEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isExporting, setIsExporting] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })

  const [obligaciones, setObligaciones] = useState<ObligacionesData>({
    afpEmpleado: 0,
    afpPatronal: 0,
    issEmpleado: 0,
    issPatronal: 0,
  })

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true)

        // Obtener obligaciones
        const respuestaObligaciones = await fetch(urlApiObligacionesIssAfp)
        if (respuestaObligaciones.ok) {
          const dataObligaciones = await respuestaObligaciones.json()
          if (dataObligaciones.length > 0) {
            setObligaciones(dataObligaciones[0])
          }
        }

        // Obtener empleados
        const respuestaEmpleados = await fetch(urlApiEmpleados)
        if (!respuestaEmpleados.ok) {
          throw new Error("Error al obtener empleados")
        }
        const dataEmpleados = await respuestaEmpleados.json()
        setEmpleados(dataEmpleados)
        setFilteredEmpleados(dataEmpleados)
      } catch (error) {
        console.error("Error al obtener datos:", error)
        setAlert({
          type: "error",
          message: "Error al cargar los datos de la planilla",
        })
      } finally {
        setLoading(false)
      }
    }

    obtenerDatos()
  }, [urlApiEmpleados, urlApiObligacionesIssAfp])

  useEffect(() => {
    let filtered = empleados

    if (searchTerm) {
      filtered = filtered.filter(
        (empleado) =>
          empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empleado.cargo.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((empleado) => empleado.departamento.nombre === selectedDepartment)
    }

    setFilteredEmpleados(filtered)
  }, [empleados, searchTerm, selectedDepartment])

  const calcularAniosTrabajados = (fechaContratacion: string): number => {
    const inicio = new Date(fechaContratacion)
    const hoy = new Date()
    let anios = hoy.getFullYear() - inicio.getFullYear()
    const mes = hoy.getMonth() - inicio.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < inicio.getDate())) {
      anios--
    }
    return anios >= 1 ? anios : 0
  }

  const calcularVacaciones = (salario: number, fecha: string): number => {
    const anios = calcularAniosTrabajados(fecha)
    if (anios < 1) return 0
    const salarioDiario = salario / 30
    return salarioDiario * 15 * 1.3 * anios
  }

  const calcularAguinaldo = (salario: number, fecha: string): number => {
    const anios = calcularAniosTrabajados(fecha)
    if (anios < 1) return 0
    const salarioDiario = salario / 30
    let dias = 15
    if (anios > 10) dias = 21
    else if (anios > 3) dias = 19
    return salarioDiario * dias
  }

  const calcularDeducciones = (salario: number) => {
    const topeAFP = 7000
    const topeISSS = 1000

    const baseAFP = Math.min(salario, topeAFP)
    const baseISSS = Math.min(salario, topeISSS)

    const afpEmp = (baseAFP * obligaciones.afpEmpleado) / 100
    const afpPat = (baseAFP * obligaciones.afpPatronal) / 100
    const issEmp = (baseISSS * obligaciones.issEmpleado) / 100
    const issPat = (baseISSS * obligaciones.issPatronal) / 100

    const totalDeducciones = afpEmp + issEmp
    const salarioNeto = salario - totalDeducciones

    return {
      afpEmp,
      afpPat,
      issEmp,
      issPat,
      totalDeducciones,
      salarioNeto,
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha)
    return date.toLocaleDateString("es-SV", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const exportarAExcel = async () => {
    try {
      setIsExporting(true)
      const datos = filteredEmpleados.map((emp) => {
        const salario = emp.cargo.salarioBase
        const deducciones = calcularDeducciones(salario)
        const anios = calcularAniosTrabajados(emp.fechaContratacion)
        const vacaciones = calcularVacaciones(salario, emp.fechaContratacion)
        const aguinaldo = calcularAguinaldo(salario, emp.fechaContratacion)

        return {
          Nombre: `${emp.nombre} ${emp.apellido}`,
          Departamento: emp.departamento.nombre,
          Cargo: emp.cargo.nombre,
          "Fecha Contratación": formatearFecha(emp.fechaContratacion),
          "Años Servicio": anios,
          "Salario Base": salario,
          "AFP (Empleado)": deducciones.afpEmp,
          "AFP (Patronal)": deducciones.afpPat,
          "ISS (Empleado)": deducciones.issEmp,
          "ISS (Patronal)": deducciones.issPat,
          Deducciones: deducciones.totalDeducciones,
          "Salario Neto": deducciones.salarioNeto,
          Vacaciones: vacaciones,
          Aguinaldo: aguinaldo,
        }
      })

      const hoja = XLSX.utils.json_to_sheet(datos)
      const libro = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(libro, hoja, "Planilla")

      const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" })
      const archivo = new Blob([excelBuffer], { type: "application/octet-stream" })
      saveAs(archivo, `planilla_${new Date().toISOString().split("T")[0]}.xlsx`)

      setAlert({
        type: "success",
        message: "Planilla exportada exitosamente",
      })
    } catch (error) {
      console.error("Error al exportar:", error)
      setAlert({
        type: "error",
        message: "Error al exportar la planilla",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const getTotales = () => {
    const totales = filteredEmpleados.reduce(
      (acc, empleado) => {
        const deducciones = calcularDeducciones(empleado.cargo.salarioBase)
        const vacaciones = calcularVacaciones(empleado.cargo.salarioBase, empleado.fechaContratacion)
        const aguinaldo = calcularAguinaldo(empleado.cargo.salarioBase, empleado.fechaContratacion)

        return {
          salarioBase: acc.salarioBase + empleado.cargo.salarioBase,
          afpEmp: acc.afpEmp + deducciones.afpEmp,
          afpPat: acc.afpPat + deducciones.afpPat,
          issEmp: acc.issEmp + deducciones.issEmp,
          issPat: acc.issPat + deducciones.issPat,
          deducciones: acc.deducciones + deducciones.totalDeducciones,
          salarioNeto: acc.salarioNeto + deducciones.salarioNeto,
          vacaciones: acc.vacaciones + vacaciones,
          aguinaldo: acc.aguinaldo + aguinaldo,
        }
      },
      {
        salarioBase: 0,
        afpEmp: 0,
        afpPat: 0,
        issEmp: 0,
        issPat: 0,
        deducciones: 0,
        salarioNeto: 0,
        vacaciones: 0,
        aguinaldo: 0,
      },
    )
    return totales
  }

  const departamentos = [...new Set(empleados.map((emp) => emp.departamento.nombre))]
  const totales = getTotales()

  const clearAlert = () => {
    setAlert({ type: null, message: "" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando planilla...</p>
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
                : "bg-gradient-to-r from-red-500 to-orange-600 text-white"
            } shadow-lg`}
          >
            <div className="flex items-center space-x-3">
              {alert.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
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
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Planilla Completa</h2>
            <p className="text-gray-600 mt-1">Nómina con vacaciones y aguinaldo incluidos</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportarAExcel}
          disabled={isExporting}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-70"
        >
          {isExporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
          <span>{isExporting ? "Exportando..." : "Exportar a Excel"}</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-400 to-cyan-600 p-4 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Empleados</p>
              <p className="text-2xl font-bold">{filteredEmpleados.length}</p>
            </div>
            <Users className="h-6 w-6 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-400 to-teal-600 p-4 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Salarios</p>
              <p className="text-xl font-bold">{formatCurrency(totales.salarioBase)}</p>
            </div>
            <DollarSign className="h-6 w-6 text-emerald-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-400 to-red-600 p-4 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Deducciones</p>
              <p className="text-xl font-bold">{formatCurrency(totales.deducciones)}</p>
            </div>
            <TrendingDown className="h-6 w-6 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-400 to-indigo-600 p-4 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Netos</p>
              <p className="text-xl font-bold">{formatCurrency(totales.salarioNeto)}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-pink-400 to-rose-600 p-4 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Vacaciones</p>
              <p className="text-xl font-bold">{formatCurrency(totales.vacaciones)}</p>
            </div>
            <Plane className="h-6 w-6 text-pink-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-yellow-400 to-orange-600 p-4 rounded-3xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Aguinaldo</p>
              <p className="text-xl font-bold">{formatCurrency(totales.aguinaldo)}</p>
            </div>
            <Gift className="h-6 w-6 text-yellow-200" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empleados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="pl-12 pr-8 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50 appearance-none min-w-[200px]"
            >
              <option value="all">Todos los departamentos</option>
              {departamentos.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Detalle Completo de Planilla</h3>
              <p className="text-gray-600 mt-1">
                {filteredEmpleados.length} de {empleados.length} empleados
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>Período actual</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Empleado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Depto/Cargo</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900">Contratación</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900">Años</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">Salario Base</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">AFP (E)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">AFP (P)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">ISS (E)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">ISS (P)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">Deducciones</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">Salario Neto</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">Vacaciones</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900">Aguinaldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmpleados.map((empleado, index) => {
                const deducciones = calcularDeducciones(empleado.cargo.salarioBase)
                const anios = calcularAniosTrabajados(empleado.fechaContratacion)
                const vacaciones = calcularVacaciones(empleado.cargo.salarioBase, empleado.fechaContratacion)
                const aguinaldo = calcularAguinaldo(empleado.cargo.salarioBase, empleado.fechaContratacion)

                return (
                  <motion.tr
                    key={empleado.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-emerald-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-semibold">
                          {empleado.nombre.charAt(0)}
                          {empleado.apellido.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {empleado.nombre} {empleado.apellido}
                          </div>
                          <div className="text-xs text-gray-500">{empleado.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium block">
                          {empleado.departamento.nombre}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-medium block">
                          {empleado.cargo.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{formatearFecha(empleado.fechaContratacion)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">{anios}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 text-sm">
                      {formatCurrency(empleado.cargo.salarioBase)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600 text-sm">{formatCurrency(deducciones.afpEmp)}</td>
                    <td className="px-4 py-3 text-right text-orange-600 text-sm">
                      {formatCurrency(deducciones.afpPat)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600 text-sm">{formatCurrency(deducciones.issEmp)}</td>
                    <td className="px-4 py-3 text-right text-orange-600 text-sm">
                      {formatCurrency(deducciones.issPat)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-red-600 text-sm">
                      {formatCurrency(deducciones.totalDeducciones)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600 text-sm">
                      {formatCurrency(deducciones.salarioNeto)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-pink-600 text-sm">
                      {formatCurrency(vacaciones)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-yellow-600 text-sm">
                      {formatCurrency(aguinaldo)}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-200">
              <tr>
                <td colSpan={4} className="px-4 py-4 font-bold text-gray-900 text-sm">
                  TOTALES
                </td>
                <td className="px-4 py-4 text-right font-bold text-gray-900 text-sm">
                  {formatCurrency(totales.salarioBase)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-red-600 text-sm">
                  {formatCurrency(totales.afpEmp)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-orange-600 text-sm">
                  {formatCurrency(totales.afpPat)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-red-600 text-sm">
                  {formatCurrency(totales.issEmp)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-orange-600 text-sm">
                  {formatCurrency(totales.issPat)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-red-600 text-sm">
                  {formatCurrency(totales.deducciones)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-emerald-600 text-sm">
                  {formatCurrency(totales.salarioNeto)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-pink-600 text-sm">
                  {formatCurrency(totales.vacaciones)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-yellow-600 text-sm">
                  {formatCurrency(totales.aguinaldo)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Planilla
