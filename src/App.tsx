import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/home/Login';
import { UserProvider } from './context/UserContext';
import AdminPanel from './pages/admin/AdminPanel';
import PaginaParaEvaluarEmpleado from './pages/pagesEvaluaciones/PaginaParaEvaluarEmpleado';
import InfoEmpleado from './pages/empleados/infoempleados';
import RhPanel from './pages/EvaluacionPanel/RhPanel';
import EditarDepartamento from './pages/departamentos/EditarDepartamento';
import EditarUser from './pages/user/Editaruser';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Dashboard" element={<AdminPanel />} />
          <Route path="/Evaluaciones" element={<PaginaParaEvaluarEmpleado />} />
          <Route path="/Dashboard/empleados/:id" element={<InfoEmpleado />} />
          <Route path='/Recursos_Humanos' element={<RhPanel />} />
          <Route path="Dashboard/Departamentos/:id" element={<EditarDepartamento/>} />
          <Route path="/Dashboard/Users/:id" element={<EditarUser />} />
          
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
