import React, { act, useState } from 'react';
import { useUserContext } from '../../context/UserContext';

const Config: React.FC = () => {
    const { user,setUser } = useUserContext();
    const urlApiUpdateUser = import.meta.env.VITE_API_URL_UPDATE_USER;
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: user?.password || '',
        active: user?.activo || true,
    });
    const [alert, setAlert] = useState<{ visible: boolean; message: string; type: string }>({
        visible: false,
        message: '',
        type: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


   /**
    * la peticion es tipo put con una estrututa parecidad a
    * curl -X 'PUT' \
  'http://localhost:8080/rh-api/userapp/update/4/' \
  -H 'accept:  \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "alex aviles",
  "password": "alex",
  "email": "alex@alex.com",
  "activo": false
}'
*/
        try {
            const response = await fetch(`${urlApiUpdateUser}/${user?.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Actualizar el usuario en el contexto
                const updatedUser = {
                    id: user.id,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    activo: formData.active,
                };
                setUser(updatedUser);
            }


            // Mostrar alerta de éxito
            setAlert({
                visible: true,
                message: 'Datos actualizados correctamente',
                type: 'success',
            });

            // Ocultar alerta después de 3 segundos
            setTimeout(() => {
                setAlert({ visible: false, message: '', type: '' });
            }, 3000);
        } catch (error) {
            console.error('Error al actualizar los datos:', error);

            // Mostrar alerta de error
            setAlert({
                visible: true,
                message: 'Error al actualizar los datos',
                type: 'error',
            });

            // Ocultar alerta después de 3 segundos
            setTimeout(() => {
                setAlert({ visible: false, message: '', type: '' });
            }, 3000);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>

            {/* Alerta */}
            {alert.visible && (
                <div
                    className={`p-4 rounded-md text-white ${
                        alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {alert.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nombre de usuario"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Correo electrónico"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contraseña"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Config;
