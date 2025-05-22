"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from "chart.js"
import { Users, TrendingUp, BookOpen, ArrowRight, CheckCircle, Mail, Phone, MapPin } from "lucide-react"
import Baner from "../../component/Baner"
import Footer from "../../component/Footer"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title)

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Datos para el gráfico
  const chartData = {
    labels: ["Empleados", "Departamentos", "Cargos", "Evaluaciones", "Capacitaciones"],
    datasets: [
      {
        label: "Totales",
        data: [120, 8, 25, 45, 32],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // Emerald
          "rgba(16, 185, 129, 0.8)", // Teal
          "rgba(6, 182, 212, 0.8)", // Cyan
          "rgba(59, 130, 246, 0.8)", // Blue
          "rgba(99, 102, 241, 0.8)", // Indigo
        ],
        borderRadius: 6,
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
        text: "Resumen Organizacional",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          bottom: 20,
        },
        color: "#166534", // Green-800
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

  // Datos para las tarjetas de servicios
  const services = [
    {
      id: "recruitment",
      icon: <Users className="h-10 w-10" />,
      title: "Selección de Personal",
      description:
        "Identificamos y reclutamos a los mejores talentos para tu empresa mediante procesos rigurosos y efectivos.",
      category: "all",
    },
    {
      id: "development",
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Desarrollo Organizacional",
      description: "Implementamos estrategias para mejorar la estructura, cultura y eficiencia de tu organización.",
      category: "all",
    },
    {
      id: "training",
      icon: <BookOpen className="h-10 w-10" />,
      title: "Capacitación y Formación",
      description:
        "Ofrecemos programas de formación personalizados para potenciar el desarrollo profesional de tus empleados.",
      category: "all",
    },
    {
      id: "evaluation",
      icon: <CheckCircle className="h-10 w-10" />,
      title: "Evaluación de Desempeño",
      description: "Diseñamos e implementamos sistemas de evaluación para medir y mejorar el rendimiento de tu equipo.",
      category: "management",
    },
    {
      id: "consulting",
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Consultoría de RRHH",
      description:
        "Asesoramos en la implementación de mejores prácticas y soluciones para optimizar la gestión del talento.",
      category: "consulting",
    },
    {
      id: "culture",
      icon: <Users className="h-10 w-10" />,
      title: "Cultura Organizacional",
      description:
        "Ayudamos a construir y fortalecer una cultura empresarial positiva que impulse el compromiso y la productividad.",
      category: "management",
    },
  ]

  // Filtrar servicios según la pestaña activa
  const filteredServices = services.filter((service) => activeTab === "all" || service.category === activeTab)

  // Estadísticas
  const stats = [
    { value: "98%", label: "Satisfacción de clientes" },
    { value: "250+", label: "Empresas atendidas" },
    { value: "1200+", label: "Profesionales colocados" },
    { value: "15+", label: "Años de experiencia" },
  ]

  // Testimonios
  const testimonials = [
    {
      quote:
        "El equipo de RRHH transformó completamente nuestra estrategia de selección de personal. Ahora contamos con un equipo más cohesionado y productivo.",
      author: "María Rodríguez",
      position: "Directora de Operaciones, TechSolutions",
    },
    {
      quote:
        "Los programas de capacitación implementados superaron nuestras expectativas. El retorno de inversión ha sido notable en términos de productividad.",
      author: "Carlos Méndez",
      position: "CEO, Innovatech",
    },
    {
      quote:
        "Su enfoque en el desarrollo organizacional nos ayudó a reestructurar la empresa en un momento crítico. Excelente servicio y resultados.",
      author: "Laura Sánchez",
      position: "Gerente de RRHH, Global Services",
    },
  ]

  return (
    <div className="flex flex-col bg-white min-h-screen w-full">
      {/* Header con efecto de scroll */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white text-green-800 shadow-md py-3"
            : "bg-gradient-to-r from-green-600 to-green-700 text-white py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div
              className={`h-10 w-10 rounded-lg ${
                isScrolled ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-white"
              } flex items-center justify-center mr-3`}
            >
              <Users className={`h-6 w-6 ${isScrolled ? "text-white" : "text-green-600"}`} />
            </div>
            <h1 className="text-2xl font-extrabold">Recursos Humanos</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#servicios" className="font-medium hover:text-green-300 transition">
              Servicios
            </a>
            <a href="#estadisticas" className="font-medium hover:text-green-300 transition">
              Estadísticas
            </a>
            <a href="#testimonios" className="font-medium hover:text-green-300 transition">
              Testimonios
            </a>
            <a href="#contacto" className="font-medium hover:text-green-300 transition">
              Contacto
            </a>
          </nav>
          <a
            href="/login"
            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isScrolled ? "bg-green-600 text-white hover:bg-green-700" : "bg-white text-green-700 hover:bg-green-50"
            }`}
          >
            Iniciar Sesión
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* Banner */}
        <Baner />

        {/* Servicios */}
        <section id="servicios" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-green-800 mb-4"
              >
                Nuestros Servicios
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Ofrecemos soluciones integrales para la gestión del talento humano, adaptadas a las necesidades
                específicas de tu organización.
              </motion.p>

              {/* Tabs para filtrar servicios */}
              <div className="flex justify-center mt-8 mb-12 space-x-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeTab === "all" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveTab("management")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeTab === "management" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Gestión
                </button>
                <button
                  onClick={() => setActiveTab("consulting")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeTab === "consulting" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Consultoría
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6 text-green-600">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <a
                      href="#"
                      className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition"
                    >
                      Saber más
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Estadísticas */}
        <section id="estadisticas" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-green-800 mb-4"
              >
                Resumen Estadístico
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Nuestros números reflejan nuestro compromiso con la excelencia y los resultados tangibles para nuestros
                clientes.
              </motion.p>
            </div>

            {/* Contador de estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Gráfico */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6"
            >
              <div className="h-[400px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-green-800 mb-4"
              >
                Lo que dicen nuestros clientes
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                La satisfacción de nuestros clientes es nuestro mejor indicador de éxito.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md p-8 relative"
                >
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <div className="text-green-100 text-6xl">"</div>
                  </div>
                  <p className="text-gray-600 mb-6 relative z-10">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.author}</h4>
                      <p className="text-sm text-gray-500">{testimonial.position}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-green-800 mb-4"
              >
                Contáctanos
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Estamos aquí para responder tus preguntas y ayudarte a encontrar la solución perfecta para tu
                organización.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Información de contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-green-600 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">Email</h4>
                      <p className="text-gray-600">contacto@recursoshumanos.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-green-600 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">Teléfono</h4>
                      <p className="text-gray-600">+123 456 7890</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-green-600 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-800">Dirección</h4>
                      <p className="text-gray-600">Av. Principal 123, Ciudad Empresarial</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Asunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Asunto de tu mensaje"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="¿Cómo podemos ayudarte?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Enviar mensaje
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Llamado a la acción */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-extrabold mb-4"
            >
              ¿Estás listo para llevar tu empresa al siguiente nivel?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg mb-8 max-w-3xl mx-auto"
            >
              Únete a nosotros para optimizar tus procesos de recursos humanos y fortalecer tu equipo de trabajo.
              Nuestros especialistas están listos para ayudarte.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/alkeys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-green-700 font-semibold py-3 px-8 rounded-lg hover:bg-green-50 transition shadow-lg"
            >
              Contáctanos ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
