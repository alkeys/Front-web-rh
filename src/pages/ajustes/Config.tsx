import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';

const Config: React.FC = () => {
    const { user, setUser } = useUserContext();
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

        try {
            const response = await fetch(`${urlApiUpdateUser}/${user?.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = {
                    id: user.id,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    activo: formData.active,
                };
                setUser(updatedUser);

                setAlert({
                    visible: true,
                    message: 'Datos actualizados correctamente',
                    type: 'success',
                });
            } else {
                throw new Error('Error al actualizar los datos');
            }
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
            setAlert({
                visible: true,
                message: 'Error al actualizar los datos',
                type: 'error',
            });
        } finally {
            setTimeout(() => {
                setAlert({ visible: false, message: '', type: '' });
            }, 3000);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6 bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Configuración de Usuario</h1>

            {alert.visible && (
                <div
                    className={`p-4 rounded-md text-white text-sm font-medium transition ${
                      alert.type === 'success'
                        ? 'bg-green-500'
                        : 'bg-red-500'
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
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Contraseña"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Config;