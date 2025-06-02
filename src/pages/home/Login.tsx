"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../context/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Loader2,
  Home,
  HelpCircle,
} from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const navigate = useNavigate()
  const urlapilogin = import.meta.env.VITE_API_URL_LOGIN
  const { setUser } = useUserContext()

  // Efecto para cargar email guardado
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación de campos
    if (!email.trim() || !password.trim()) {
      setError("Por favor, complete todos los campos.")
      return
    }

    if (!validateEmail(email)) {
      setError("Ingrese un correo electrónico válido.")
      return
    }

    if (email.includes("'") || email.includes('"') || email.includes(";")) {
      setError("Entrada no permitida.")
      return
    }

    try {
      setLoading(true)

      // Reducimos el retraso para mejorar la velocidad pero mantener feedback visual
      await new Promise((resolve) => setTimeout(resolve, 300))

      const response = await fetch(`${urlapilogin}?mail=${email}&password=${password}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const userData = await response.json()
      if (!userData || !userData.id) {
        setError("Credenciales incorrectas. Verifique su correo y contraseña.")
        setLoading(false)
        return
      }

      // Guardar email si "recordarme" está activado
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      setUser(userData)
      setSuccessMessage("Inicio de sesión exitoso. Redirigiendo...")

      // Redirección según rol - reducimos el tiempo de espera
      setTimeout(() => {
        if (userData.rol === "EmpleadoRH") {
          navigate("/Recursos_Humanos")
        } else if (userData.rol === "Administrador") {
          navigate("/Dashboard")
        } else if (userData.rol === "Evaluador") {
          navigate("/Evaluaciones")
        }else if (userData.rol === "EmpleadoEV") {
          navigate("/Evaluaciones/empleados")
        
        } else {
          setError("Rol no reconocido.")
          setSuccessMessage("")
        }
      }, 500)
    } catch (err) {
      setError("Error de conexión. Intente más tarde.")
    } finally {
      setLoading(false)
    }
  }

  const handleFocus = (field: string) => {
    setFocusedField(field)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  // Variantes de animación mejoradas para transiciones más suaves
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Curva de animación suave (cubic-bezier)
      },
    },
  }

  const alertVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: 24,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: "easeIn",
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              className="h-10 w-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mr-3"
              initial={{ rotate: -5 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <User className="h-5 w-5 text-white" />
            </motion.div>
            <h1 className="text-xl font-bold text-gray-900">Sistema de Recursos Humanos</h1>
          </div>
          <motion.a
            href="/"
            className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            whileHover={{ x: -3 }}
            transition={{ duration: 0.2 }}
          >
            <Home className="h-4 w-4 mr-1" />
            Volver al inicio
          </motion.a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <div className="flex items-center">
                <motion.div
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm mr-4"
                  whileHover={{
                    scale: 1.05,
                    rotate: 5,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                    },
                  }}
                >
                  <User className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-semibold">Iniciar Sesión</h2>
                  <p className="text-emerald-100 text-sm">Ingrese sus credenciales para continuar</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    variants={alertVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg flex items-start"
                  >
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    variants={alertVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mb-6 p-4 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg flex items-start"
                  >
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{successMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-emerald-500" />
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border ${
                        error && !email
                          ? "border-red-300 ring-1 ring-red-300"
                          : focusedField === "email"
                            ? "border-emerald-400 ring-2 ring-emerald-100"
                            : "border-gray-200"
                      } rounded-lg focus:outline-none transition-all duration-300 ease-in-out bg-gray-50/50`}
                      placeholder="tucorreo@empresa.com"
                    />
                    <AnimatePresence>
                      {email && validateEmail(email) && (
                        <motion.div
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {email && !validateEmail(email) && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-red-600 mt-1"
                      >
                        Ingrese un correo electrónico válido.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center">
                    <Lock className="h-4 w-4 mr-1 text-emerald-500" />
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => handleFocus("password")}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border ${
                        error && !password
                          ? "border-red-300 ring-1 ring-red-300"
                          : focusedField === "password"
                            ? "border-emerald-400 ring-2 ring-emerald-100"
                            : "border-gray-200"
                      } rounded-lg focus:outline-none transition-all duration-300 ease-in-out bg-gray-50/50 pr-10`}
                      placeholder="********"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Recordarme
                    </label>
                  </div>
                  <motion.a
                    href="#"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                    whileHover={{
                      x: 2,
                      transition: { duration: 0.2 },
                    }}
                  >
                    ¿Olvidó su contraseña?
                  </motion.a>
                </div>

                {/* Submit Button */}
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-sm disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          duration: 1.5,
                          ease: "easeInOut",
                          repeatDelay: 1,
                        }}
                      >
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Help Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <div className="flex items-center text-sm text-gray-500">
                  <HelpCircle className="h-4 w-4 mr-2 text-emerald-500" />
                  <p>
                    ¿Necesita ayuda?{" "}
                    <motion.a
                      href="#"
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                      whileHover={{
                        textDecoration: "underline",
                        transition: { duration: 0.2 },
                      }}
                    >
                      Contacte a soporte
                    </motion.a>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Sistema de Recursos Humanos | Todos los derechos reservados
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <motion.a
              href="#"
              className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Términos y Condiciones
            </motion.a>
            <motion.a
              href="#"
              className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Política de Privacidad
            </motion.a>
            <motion.a
              href="#"
              className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Ayuda
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  )
}
