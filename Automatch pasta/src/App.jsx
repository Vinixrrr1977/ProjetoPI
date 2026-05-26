import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import VehicleDetails from './pages/VehicleDetails';
import ShowcaseCatalog from './pages/ShowcaseCatalog';
import ShowcaseVehicleDetails from './pages/ShowcaseVehicleDetails';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Novas rotas (Catálogo e Anúncios)
import NewCarCatalog from './pages/NewCarCatalog';
import NewCarDetails from './pages/NewCarDetails';
import NewCarAdForm from './pages/NewCarAdForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/encontrar" element={<ShowcaseCatalog />} />
          <Route path="/encontrar/:id" element={<ShowcaseVehicleDetails />} />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          
          {/* Novas rotas (Catálogo e Anúncios) */}
          <Route path="/novo-catalogo" element={<NewCarCatalog />} />
          <Route path="/novo-catalogo/:id" element={<NewCarDetails />} />
          <Route path="/novo-anuncio" element={<NewCarAdForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
