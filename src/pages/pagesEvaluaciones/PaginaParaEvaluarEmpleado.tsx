import React, { useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { FaUserTie, FaBuilding, FaUserCheck } from "react-icons/fa";

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
        if (!evaluator || !selectedDepartment || !selectedEmployee) {
            alert("Por favor, complete todos los campos antes de enviar la evaluación.");
            return;
        }
        alert(`✅ Evaluación enviada con éxito!\n\nEvaluador: ${evaluator}\nDepartamento: ${selectedDepartment}\nEmpleado: ${selectedEmployee}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6 flex items-center justify-center gap-3">
                    <FaUserCheck className="text-green-500" /> Evaluación de Empleados
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Evaluador</label>
                        <input
                            type="text"
                            value={evaluator}
                            onChange={handleEvaluatorChange}
                            placeholder="Nombre del evaluador"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Departamento</label>
                        <select
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
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
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Empleado</label>
                            <select
                                value={selectedEmployee}
                                onChange={handleEmployeeChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
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
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Preguntas de Evaluación</label>
                        <div className="space-y-5">
                            <div>
                                <p className="text-gray-700 font-medium">1. ¿Cómo calificarías el desempeño del empleado?</p>
                                <select className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    <option value="">Selecciona una opción</option>
                                    <option value="1">1 - Muy malo</option>
                                    <option value="2">2 - Malo</option>
                                    <option value="3">3 - Regular</option>
                                    <option value="4">4 - Bueno</option>
                                    <option value="5">5 - Excelente</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-gray-700 font-medium">2. ¿El empleado cumple con los objetivos asignados?</p>
                                <select className="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
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
                        className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
                    >
                        Enviar Evaluación
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaginaParaEvaluarEmpleado;
