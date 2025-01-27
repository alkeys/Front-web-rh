import React, { createContext, useState, ReactNode, useContext } from 'react';

// Interfaz para el usuario
interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  activo: boolean;
}

// Props del contexto
interface UserContextProps {
  user: User | null; // Puede ser un objeto de usuario o null si no hay usuario autenticado
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Crear el contexto
export const UserContext = createContext<UserContextProps | undefined>(undefined);

// Props del proveedor
interface UserProviderProps {
  children: ReactNode;
}

// Componente proveedor
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe ser usado dentro de un UserProvider');
  }
  return context;
};
