import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { FaSpinner } from 'react-icons/fa';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const urlapilogin = import.meta.env.VITE_API_URL_LOGIN;
    const { setUser } = useUserContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Ingrese un correo electrónico válido.');
            return;
        }

        if (email.includes("'") || email.includes('"') || email.includes(';')) {
            setError('Entrada no permitida.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${urlapilogin}?mail=${email}&password=${password}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const userData = await response.json();
            if (!userData || !userData.id) {
                setError('Credenciales incorrectas.');
                setLoading(false);
                return;
            }

            setUser(userData);
            if (userData.rol === 'admin') navigate('/Dashboard');
            else if (userData.rol === 'evaluador') navigate('/Evaluaciones');

        } catch (err) {
            setError('Error de conexión. Intente más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-green-200">
            <header className="bg-green-600 text-white p-5 shadow-md">
                <h1 className="text-2xl font-bold text-center">Panel de Recursos Humanos</h1>
            </header>

            <main className="flex-grow flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fade-in">
                    <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                                    error && !email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="tucorreo@empresa.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                                    error && !password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="********"
                            />
                        </div>

                        {error && <div className="text-red-600 text-sm">{error}</div>}

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                            disabled={loading}
                        >
                            {loading ? (
                                <FaSpinner className="animate-spin mr-2" />
                            ) : null}
                            {loading ? 'Verificando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </main>

            <footer className="bg-green-600 text-white text-center p-4 mt-10">
                <p>&copy; 2025 Recursos Humanos | Todos los derechos reservados</p>
            </footer>
        </div>
    );
}
