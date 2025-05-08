import React, { useState, useEffect } from 'react';

const CrearTrabajador: React.FC = () => {
    const urlCrearEmpleado = import.meta.env.VITE_API_URL_SAVE_EMPLEADO;
    const urlDepartamentos = import.meta.env.VITE_API_URL_GET_ALL_DEPARTAMENTOS;
    const urlCargos = import.meta.env.VITE_API_URL_GET_ALL_CARGOS;

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fecha_contratacion: '',
        departamento_id: '', // ✅ corregido nombre
        cargo_id: '',         // ✅ corregido nombre
    });

    const [departamentos, setDepartamentos] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        fetch(urlDepartamentos)
            .then(res => res.json())
            .then(setDepartamentos)
            .catch(console.error);

        fetch(urlCargos)
            .then(res => res.json())
            .then(setCargos)
            .catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Validar que todos los campos estén completos esto puede ser mejorado
        const queryParams = new URLSearchParams({  // esto es para enviar los datos por query params
            DepartamentoId: formData.departamento_id, //esto sirve para enviar el id del departamento
            CargoId: formData.cargo_id, //esto sirve para enviar el id del cargo
        }).toString();
    
        try {
            const response = await fetch(`${urlCrearEmpleado}?${queryParams}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.email,
                    telefono: formData.telefono,
                    fechaContratacion: formData.fecha_contratacion,
                }),
            });
    
            if (response.ok) {
                setMensaje('Trabajador creado correctamente.');
                setFormData({
                    nombre: '',
                    apellido: '',
                    email: '',
                    telefono: '',
                    fecha_contratacion: '',
                    departamento_id: '',
                    cargo_id: '',
                });
            } else {
                const error = await response.text();
                console.error('Error en la respuesta:', error);
                setMensaje('Error al crear el trabajador.');
            }
        } catch (error) {
            console.error('Error en el envío:', error);
            setMensaje('Error en la conexión.');
        }
    
        setTimeout(() => setMensaje(''), 3000);
    };
    
    

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Trabajador</h2>

            {mensaje && (
                <div className="p-3 text-sm font-medium rounded-md bg-blue-100 text-blue-800">
                    {mensaje}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange}
                    className="p-3 border rounded-md" required />
                <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange}
                    className="p-3 border rounded-md" required />
                <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange}
                    className="p-3 border rounded-md" required />
                <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange}
                    className="p-3 border rounded-md" required />
                <input type="date" name="fecha_contratacion" value={formData.fecha_contratacion} onChange={handleChange}
                    className="p-3 border rounded-md" required />

                <select name="departamento_id" value={formData.departamento_id} onChange={handleChange}
                    className="p-3 border rounded-md" required>
                    <option value="">Seleccione Departamento</option>
                    {departamentos.map((dep: any) => (
                        <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                    ))}
                </select>

                <select name="cargo_id" value={formData.cargo_id} onChange={handleChange}
                    className="p-3 border rounded-md" required>
                    <option value="">Seleccione Cargo</option>
                    {cargos.map((cargo: any) => (
                        <option key={cargo.id} value={cargo.id}>{cargo.nombre}</option>
                    ))}
                </select>

                <div className="sm:col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        Registrar Trabajador
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearTrabajador;
