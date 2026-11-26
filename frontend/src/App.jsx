import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RotaProtegida from './components/RotaProtegida';
import CategoriasPage from './pages/CategoriasPage';
import EventoDetalhePage from './pages/EventoDetalhePage';
import EventoFormPage from './pages/EventoFormPage';
import EventosPage from './pages/EventosPage';
import LoginPage from './pages/LoginPage';
import NaoEncontradaPage from './pages/NaoEncontradaPage';
import RegistroPage from './pages/RegistroPage';

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      {/* Rotas protegidas: exigem login (token JWT) */}
      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/eventos" replace />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/eventos/novo" element={<EventoFormPage />} />
          <Route path="/eventos/:id" element={<EventoDetalhePage />} />
          <Route path="/eventos/:id/editar" element={<EventoFormPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="*" element={<NaoEncontradaPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
