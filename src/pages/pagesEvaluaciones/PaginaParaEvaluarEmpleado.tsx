import React, { useState } from "react";
import { useUserContext } from "../../context/UserContext";

const PaginaParaEvaluarEmpleado: React.FC = () => {
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [evaluator, setEvaluator] = useState("");
    const { user } = useUserContext();

    const departments = ["Recursos Humanos", "Tecnología", "Ventas", "Marketing"];
    const employees: Record<string, string[]> = {
        "Recursos Humanos": ["Juan Pérez", "Ana Gómez"],
        Tecnología: ["Carlos López", "María Fernández"],
        Ventas: ["Pedro Sánchez", "Laura Martínez"],
        Marketing: ["Sofía Torres", "Luis Ramírez"],
    };

    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDepartment(event.target.value);
        setSelectedEmployee("");
    };

    const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEmployee(event.target.value);
    };

    const handleEvaluatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEvaluator(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert(`Evaluador: ${evaluator}\nDepartamento: ${selectedDepartment}\nEmpleado: ${selectedEmployee}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Evaluar Empleado</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Evaluador</label>
                        <input
                            type="text"
                            value={evaluator}
                            onChange={handleEvaluatorChange}
                            placeholder="Nombre del evaluador"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Departamento</label>
                        <select
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Selecciona un departamento</option>
                            {departments.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedDepartment && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Empleado</label>
                            <select
                                value={selectedEmployee}
                                onChange={handleEmployeeChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecciona un empleado</option>
                                {employees[selectedDepartment]?.map((employee: string) => (
                                    <option key={employee} value={employee}>
                                        {employee}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Preguntas de Evaluación</label>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-700">1. ¿Cómo calificarías el desempeño del empleado?</p>
                                <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Selecciona una opción</option>
                                    <option value="1">1 - Muy malo</option>
                                    <option value="2">2 - Malo</option>
                                    <option value="3">3 - Regular</option>
                                    <option value="4">4 - Bueno</option>
                                    <option value="5">5 - Excelente</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-gray-700">2. ¿El empleado cumple con los objetivos asignados?</p>
                                <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Selecciona una opción</option>
                                    <option value="1">1 - Nunca</option>
                                    <option value="2">2 - Rara vez</option>
                                    <option value="3">3 - A veces</option>
                                    <option value="4">4 - Frecuentemente</option>
                                    <option value="5">5 - Siempre</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Enviar Evaluación
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaginaParaEvaluarEmpleado;