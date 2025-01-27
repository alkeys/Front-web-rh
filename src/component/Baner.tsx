import React from 'react';
import Img from "../assets/Image/xd.jpg";
import "./style/baner.css";

const Baner: React.FC = () => {



    return (
        <div>
            <div className="relative text-black h-[50vh] bg-green-500">
                <img
                    src={Img}
                    alt="Banner de empresa de recursos humanos"
                    className="object-cover w-full h-full"
                />
                <div className="card absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 md:w-1/2 bg-black bg-opacity-50 p-8 rounded-lg">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold"></h1>
                        <h2 className="text-4xl font-bold mb-4">Recursos Humanos de Alto Impacto</h2>
                        <p className="text-xl mb-6">Transformamos ambientes laborales para potenciar el talento humano</p>
                        <a href='https://github.com/alkeys'>
                        <button className="bg-green-600 hover:bg-green-700 p-3 rounded text-white">
                            Conócenos                        
                        </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Baner;
