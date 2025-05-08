import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
            <p>&copy; 2025 DevHub RH. Todos los derechos reservados.</p>
            {/* <p>Desarrollado por <a href="https://github.com/alkeys">Alkeys</a></p> */}
            <div className="mt-4">
                <a href="#" className="text-green-400 hover:underline mx-2">Política de Privacidad</a>
                <a href="#" className="text-green-400 hover:underline mx-2">Términos de Servicio</a>
            </div>
        </div>
    </footer>
    );
};

export default Footer;