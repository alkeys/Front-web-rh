"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  Eye,
  Trash2,
  Edit,
  X,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  Building,
  AlertTriangle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Empleado {
  id: number
  idDepartamento: number
  idCargo: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  fechaContratacion: string
  departamento?: { nombre: string }
  cargo?: { nombre: string }
}

const Empleados: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Empleado[]>([])
  const [totalEmpleados, setTotalEmpleados] = useState(0)
  const [filtroNombre, setFiltroNombre] = useState("")
  const [filtroDepartamento, setFiltroDepartamento] = useState("")
  const [filtroCargo, setFiltroCargo] = useState("")
  const [pagina, setPagina] = useState(0)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [empleadoABorrar, setEmpleadoABorrar] = useState<Empleado | null>(null)
  const cantidad = 25
  const navigate = useNavigate()

  const urlBase = import.meta.env.VITE_API_URL_GET_EMPLEADO_PAGINATED
  const urlTotal = import.meta.env.VITE_API_URL_COUNT_EMPLEADOS
  const urlDelete = import.meta.env.VITE_API_URL_DELETE_EMPLEADO_BY_ID

  useEffect(() => {
    cargarDatos(pagina, cantidad)
    cargarTotalEmpleados()
  }, [pagina])

  const cargarDatos = async (pagina: number, cantidad: number) => {
    setIsLoading(true)
    try {
      const url = urlBase.replace("{PAGINA}", pagina.toString()).replace("{cantidad}", cantidad.toString())
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setUsuarios(data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const cargarTotalEmpleados = async () => {
    try {
      const response = await fetch(urlTotal)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const total = await response.json()
      setTotalEmpleados(total)
    } catch (error) {
      console.error("Error fetching total count:", error)
    }
  }

  const empleadosFiltrados = usuarios.filter((empleado) => {
    const nombreCompleto = `${empleado.nombre} ${empleado.apellido}`.toLowerCase()
    const departamento = empleado.departamento?.nombre?.toLowerCase() || ""
    const cargo = empleado.cargo?.nombre?.toLowerCase() || ""

    return (
      nombreCompleto.includes(filtroNombre.toLowerCase()) &&
      (filtroDepartamento ? departamento === filtroDepartamento.toLowerCase() : true) &&
      (filtroCargo ? cargo === filtroCargo.toLowerCase() : true)
    )
  })

  const departamentos = Array.from(new Set(usuarios.map((e) => e.departamento?.nombre))).filter(Boolean) as string[]
  const cargos = Array.from(new Set(usuarios.map((e) => e.cargo?.nombre))).filter(Boolean) as string[]

  const verMasInfo = (empleado: Empleado) => {
    setEmpleadoSeleccionado(empleado)
  }

  const cerrarInfo = () => {
    setEmpleadoSeleccionado(null)
  }

  const confirmarBorrado = (empleado: Empleado) => {
    setEmpleadoABorrar(empleado)
    setShowDeleteConfirm(true)
  }

  const borrarEmpleado = async () => {
    if (!empleadoABorrar) return

    try {
      const url = urlDelete.replace("{id}", empleadoABorrar.id.toString())
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      // Si el empleado borrado es el que está seleccionado, cerramos el modal de detalles
      if (empleadoSeleccionado?.id === empleadoABorrar.id) {
        setEmpleadoSeleccionado(null)
      }

      // Recargamos los datos
      await cargarDatos(pagina, cantidad)
      await cargarTotalEmpleados()

      // Mostramos mensaje de éxito (podría implementarse un toast)
      console.log("Empleado eliminado con éxito")
    } catch (error) {
      console.error("Error al borrar el empleado:", error)
    } finally {
      setShowDeleteConfirm(false)
      setEmpleadoABorrar(null)
    }
  }

  const cancelarBorrado = () => {
    setShowDeleteConfirm(false)
    setEmpleadoABorrar(null)
  }

  const limpiarFiltros = () => {
    setFiltroNombre("")
    setFiltroDepartamento("")
    setFiltroCargo("")
  }

  const siguientePagina = () => {
    if ((pagina + 1) * cantidad < totalEmpleados) setPagina(pagina + 1)
  }

  const paginaAnterior = () => {
    if (pagina > 0) setPagina(pagina - 1)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">


      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards */}
          <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Empleados</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEmpleados}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 flex justify-between items-center">
                <span>
                  Página {pagina + 1} de {Math.ceil(totalEmpleados / cantidad) || 1}
                </span>
                <span>
                  Mostrando {Math.min(cantidad, totalEmpleados - pagina * cantidad) || 0} de {totalEmpleados}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Departamentos</p>
                  <p className="text-2xl font-bold text-gray-900">{departamentos.length}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {departamentos.slice(0, 3).map((d, i) => (
                  <span
                    key={i}
                    className="inline-block bg-emerald-50 text-emerald-700 rounded-full px-2 py-1 mr-1 mb-1"
                  >
                    {d}
                  </span>
                ))}
                {departamentos.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-700 rounded-full px-2 py-1">
                    +{departamentos.length - 3} más
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Cargos</p>
                  <p className="text-2xl font-bold text-gray-900">{cargos.length}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {cargos.slice(0, 3).map((c, i) => (
                  <span key={i} className="inline-block bg-amber-50 text-amber-700 rounded-full px-2 py-1 mr-1 mb-1">
                    {c}
                  </span>
                ))}
                {cargos.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-700 rounded-full px-2 py-1">
                    +{cargos.length - 3} más
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800 flex items-center">
                <Filter className="mr-2 h-5 w-5 text-gray-500" />
                Filtros
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="filtroNombre" className="block text-sm font-medium text-gray-700">
                        Buscar por nombre
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="filtroNombre"
                          type="text"
                          value={filtroNombre}
                          onChange={(e) => setFiltroNombre(e.target.value)}
                          placeholder="Nombre o apellido..."
                          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="filtroDepartamento" className="block text-sm font-medium text-gray-700">
                        Departamento
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          id="filtroDepartamento"
                          value={filtroDepartamento}
                          onChange={(e) => setFiltroDepartamento(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        >
                          <option value="">Todos los departamentos</option>
                          {departamentos.map((d, i) => (
                            <option key={i} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="filtroCargo" className="block text-sm font-medium text-gray-700">
                        Cargo
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          id="filtroCargo"
                          value={filtroCargo}
                          onChange={(e) => setFiltroCargo(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        >
                          <option value="">Todos los cargos</option>
                          {cargos.map((c, i) => (
                            <option key={i} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 text-right">
                    <button
                      onClick={limpiarFiltros}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Limpiar filtros
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : empleadosFiltrados.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Empleado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contacto
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha Contratación
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Departamento
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cargo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {empleadosFiltrados.map((empleado) => (
                      <tr key={empleado.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                              {empleado.nombre.charAt(0)}
                              {empleado.apellido.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {empleado.nombre} {empleado.apellido}
                              </div>
                              <div className="text-sm text-gray-500">ID: {empleado.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-1" />
                            {empleado.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-1" />
                            {empleado.telefono}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {formatDate(empleado.fechaContratacion)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            {empleado.departamento?.nombre || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                            {empleado.cargo?.nombre || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => verMasInfo(empleado)}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/Dashboard/empleados/${empleado.id}`)}
                              className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-md transition-colors"
                              title="Editar empleado"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => confirmarBorrado(empleado)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors"
                              title="Eliminar empleado"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No se encontraron empleados</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No hay empleados que coincidan con los filtros seleccionados.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={limpiarFiltros}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {empleadosFiltrados.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{pagina * cantidad + 1}</span> a{" "}
                      <span className="font-medium">{Math.min((pagina + 1) * cantidad, totalEmpleados)}</span> de{" "}
                      <span className="font-medium">{totalEmpleados}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={paginaAnterior}
                        disabled={pagina === 0}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          pagina === 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                        }`}
                      >
                        <span className="sr-only">Anterior</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Página {pagina + 1}
                      </span>
                      <button
                        onClick={siguientePagina}
                        disabled={(pagina + 1) * cantidad >= totalEmpleados}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          (pagina + 1) * cantidad >= totalEmpleados
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                        }`}
                      >
                        <span className="sr-only">Siguiente</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
                <div className="flex sm:hidden justify-between w-full">
                  <button
                    onClick={paginaAnterior}
                    disabled={pagina === 0}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      pagina === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={siguientePagina}
                    disabled={(pagina + 1) * cantidad >= totalEmpleados}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      (pagina + 1) * cantidad >= totalEmpleados
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      <AnimatePresence>
        {empleadoSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={cerrarInfo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={cerrarInfo}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-6">
                <div className="h-20 w-20 rounded-full bg-indigo-100 mx-auto flex items-center justify-center text-indigo-600 text-2xl font-bold mb-4">
                  {empleadoSeleccionado.nombre.charAt(0)}
                  {empleadoSeleccionado.apellido.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {empleadoSeleccionado.nombre} {empleadoSeleccionado.apellido}
                </h2>
                <p className="text-indigo-600 font-medium">{empleadoSeleccionado.cargo?.nombre || "Sin cargo"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Email</span>
                  </div>
                  <p className="text-sm text-gray-900">{empleadoSeleccionado.email}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Teléfono</span>
                  </div>
                  <p className="text-sm text-gray-900">{empleadoSeleccionado.telefono}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Fecha de Contratación</span>
                  </div>
                  <p className="text-sm text-gray-900">{formatDate(empleadoSeleccionado.fechaContratacion)}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Building className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Departamento</span>
                  </div>
                  <p className="text-sm text-gray-900">{empleadoSeleccionado.departamento?.nombre || "N/A"}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    cerrarInfo()
                    confirmarBorrado(empleadoSeleccionado)
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Borrar
                </button>
                <button
                  onClick={() => navigate(`/Dashboard/empleados/${empleadoSeleccionado.id}`)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </button>
                <button
                  onClick={cerrarInfo}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación de borrado */}
      <AnimatePresence>
        {showDeleteConfirm && empleadoABorrar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={cancelarBorrado}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Confirmar eliminación</h2>
                <p className="mt-2 text-sm text-gray-500">
                  ¿Estás seguro de que deseas eliminar a{" "}
                  <span className="font-medium text-gray-900">
                    {empleadoABorrar.nombre} {empleadoABorrar.apellido}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={borrarEmpleado}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sí, eliminar
                </button>
                <button
                  onClick={cancelarBorrado}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Empleados
