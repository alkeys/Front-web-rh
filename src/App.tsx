import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { UserProvider } from './context/UserContext';
import AdminPanel from './pages/AdminPanel';
import PaginaParaEvaluarEmpleado from './pages/pagesEvaluaciones/PaginaParaEvaluarEmpleado';
import InfoEmpleado from './pages/empleados/infoempleados';

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
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
