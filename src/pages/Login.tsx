import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carga
    const navigate = useNavigate();
    const urlapilogin = import.meta.env.VITE_API_URL_LOGIN; // URL de la API de login
    const { setUser } = useUserContext();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Resetear errores
        setError('');

        // Validar el formulario
        if (!email.trim()) {
            setError('El correo electrónico es obligatorio');
            return;
        }
        if (!password.trim()) {
            setError('La contraseña es obligatoria');
            return;
        }

        // Validar el correo electrónico
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('El correo electrónico no es válido');
            return;
        }

        // Validar que no haya posibles inyecciones SQL
        if (email.includes("'") || email.includes('"') || email.includes(';')) {
            setError('Deja de intentar hackear la aplicación');
            return;
        }

 

        // Cargar datos
        try {
            setLoading(true); // Iniciar la carga
            const userData = await CargarDatos();
            if (!userData || !userData.id) { // Verifica si los datos son correctos
                setError('El correo electrónico o la contraseña son incorrectos');
                setLoading(false); // Detener la carga
                return;
            }
            setUser(userData); // Guardamos el usuario en el contexto
            if (userData.rol === 'admin') {
            navigate('/Dashboard'); // Redirigimos al Dashboard
            }
            if (userData.rol === 'evaluador') {
                navigate('/Evaluaciones'); // Redirigimos a Evaluaciones
            }
            setLoading(false); // Detener la carga
        } catch (error) {
            setError('Hubo un problema al iniciar sesión. Intenta nuevamente.');
            setLoading(false); // Detener la carga
        }
    };

    const CargarDatos = async () => {
        const response = await fetch(CargarUrl());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data2 = await response.json();
        return data2; // Regresamos los datos directamente para manejarlo en handleSubmit
    };



    const CargarUrl=()=>{
        console.log("Enviando petición con:", email, password);
        const urldata = `${urlapilogin}?mail=${email}&password=${password}`;
        return urldata;
    }



    return (
        <div className="flex flex-col bg-white min-h-screen w-full">
            <header className="bg-green-500 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center">
                <div className="bg-white shadow-lg p-8 rounded-lg w-96">
                    <h2 className="text-2xl font-bold text-center mb-6">Accede a tu cuenta</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded mt-2"
                                placeholder="Ingresa tu correo"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded mt-2"
                                placeholder="Ingresa tu contraseña"
                                required
                            />
                        </div>

                        {/* Mostrar el mensaje de error si hay uno */}
                        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                        {/* Mostrar un spinner o mensaje de carga si está en proceso */}
                        {loading ? (
                            <div className="text-center text-green-500">Cargando...</div>
                        ) : (
                            <div className="flex justify-center">
                                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    Iniciar Sesión
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </main>

            <footer className="bg-green-500 text-white p-4 text-center">
                <p>&copy; 2025 Recursos Humanos</p>
            </footer>
        </div>
    );
}
