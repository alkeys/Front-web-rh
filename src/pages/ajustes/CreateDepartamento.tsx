import React, { useState } from 'react';

const CreateDepartamento: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState('');
    const url = import.meta.env.VITE_API_URL_GET_DEPARTAMENTO_CREATE_Departamento;

    const handleSubmit = async () => {
        try {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setNombre('');
                });

            setMensaje('Departamento creado correctamente.');
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-r animate-fadeIn">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md transition-transform transform hover:scale-105">
                <div className="mb-6">
                    <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2">Nombre del Departamento:</label>
                    <label htmlFor="nombre" className="block text-red-500 font-semibold mb-2">{mensaje}</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Crear
                </button>
            </div>
        </div>
    );
};

export default CreateDepartamento;
