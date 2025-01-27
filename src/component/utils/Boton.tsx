import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BotonProps {
    path: string;
    name: string;
}

const Boton: React.FC<BotonProps> = ({ path, name }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
    };

    return (
        <button
            onClick={handleClick}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
            {name}
        </button>
    );
};

export default Boton;