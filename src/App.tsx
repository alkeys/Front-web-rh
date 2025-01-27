import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { UserProvider } from './context/UserContext'
import AdminPanel from './pages/AdminPanel'


function App() {
  const [count, setCount] = useState(0)

  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<AdminPanel/>} />
      </Routes>
    </Router>
    </UserProvider>
  )
}

export default App
