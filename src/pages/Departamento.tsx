import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaBuilding } from 'react-icons/fa';

const Departamento: React.FC = () => {
    const urlapiDerpartamento = import.meta.env.VITE_API_URL_DEPARTAMENTO;
    const urlapiDepartamentoAll = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS;
    const urlapiDerpartamentoAllCantEmpleado = import.meta.env.VITE_API_URL_GET_DEPARTAMENTO_ALL_CANT_EMPLEADOS;
    const urlapiDerpartamentoCount = import.meta.env.VITE_API_URL_COUNT_DEPARTAMENTOS;

    const [departamento, setDepartamento] = useState(null);
    const [Count, SetCount] = useState(0);


    const CargarDepartamentos = async () => {
        try {
            const response = await fetch(urlapiDerpartamentoAllCantEmpleado);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDepartamento(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const CargarDepartamentosCount = async () => {
        try {
            const response = await fetch(urlapiDerpartamentoCount);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            SetCount(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    useEffect(() => {
        CargarDepartamentosCount();
        CargarDepartamentos();
    }, []);

    /**
     * [
  {
    "id": 1,
    "cantidad": 1,
    "nombre": "Recursos Humanos"
  },
  {
    "id": 3,
    "cantidad": 1,
    "nombre": "Finanzas"
  },
]
     */

    return (
        <div className="p-4 space-y-4">
            {/* Tarjeta resumen */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300 ease-in-out">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Total Departamentos</h3>
                        <span className="text-gray-500">
                            <FaBuilding />
                        </span>
                    </div>
                    <div className="text-2xl font-bold">{Count}</div>
                    <p className="text-xs text-gray-500">Departamentos activos en la organización</p>
                </div>
            </div>

            {/* Tabla de departamentos */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Cantidad de Empleados</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>

                        {departamento && departamento.map((departamento, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white even:bg-gray-50 border-b hover:bg-gray-100 transition duration-300 ease-in-out"
                                >
                                    <td className="px-6 py-4 text-gray-900 flex items-center gap-2">
                                        <FaBuilding className="text-blue-500" />
                                        {departamento.nombre}
                                    </td>
                                    <td className="px-6 py-4">{departamento.cantidad} empleados</td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="mr-2 flex items-center gap-1 text-blue-500 hover:text-blue-700 transition duration-300"
                                            title="Editar"
                                        >
                                            <FaEdit />
                                            Editar
                                        </button>
                                        <button
                                            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition duration-300"
                                            title="Eliminar"
                                        >
                                            <FaTrashAlt />
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                            
                            

                        }
                    </tbody>
                </table>
                <div className="text-center text-gray-500 py-4">

                    <p>By aviles.</p>
                </div>
            </div>
        </div>
    );
};

export default Departamento;
