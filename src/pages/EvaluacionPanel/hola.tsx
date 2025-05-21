"use client"

import { useUserContext } from "../../context/UserContext"
import { motion } from "framer-motion"
import { Sparkles, User } from "lucide-react"

interface HolaProps {
  nombre: string
}

export default function Hola({ nombre }: HolaProps) {
  const { user } = useUserContext() // Obteniendo el usuario actual para el nombre del evaluador

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">


      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl w-full text-center"
        >
          <div className="inline-block mb-6 relative">
            <h1 className="text-6xl font-bold text-purple-800">¡Hola, {nombre}!</h1>
            <Sparkles className="absolute -top-4 -right-8 h-8 w-8 text-yellow-400" />
          </div>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Bienvenido a nuestra plataforma. Estamos encantados de tenerte aquí. Explora todas las funcionalidades que
            tenemos para ti.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {["Explorar", "Aprender", "Conectar"].map((action, index) => (
              <motion.div
                key={action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border border-purple-100 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-purple-700 mb-2">{action}</h3>
                <p className="text-gray-500">
                  Descubre todo lo que puedes {action.toLowerCase()} en nuestra plataforma.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

    </div>
  )
}
