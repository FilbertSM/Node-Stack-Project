import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Home from './pages/home';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Kita gunakan endpoint /profile yang sudah ada untuk verifikasi token
        const res = await fetch('/api/users/profile');
        // Jika respons OK (status 200), berarti token valid dan pengguna terautentikasi
        setIsAuthenticated(res.ok);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    verifyUser();
  }, []);

 if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute publik yang bisa diakses siapa saja */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 3. Atur rute default ('/') untuk mengarahkan ke halaman login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 4. Terapkan ProtectedRoute pada halaman Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        {/* Rute lain yang dilindungi bisa ditambahkan di sini dengan pola yang sama */}
        {/* Contoh:
        <Route 
          path="/list" 
          element={
            <ProtectedRoute>
              <ListPage />
            </ProtectedRoute>
          } 
        /> 
        */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;