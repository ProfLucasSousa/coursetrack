import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Home from './pages/Home';
import CursosList from './pages/CursosList';
import CursoForm from './pages/CursoForm';
import CursoDetalhes from './pages/CursoDetalhes';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<CursosList />} />
            <Route path="/cursos/novo" element={<CursoForm />} />
            <Route path="/cursos/:id" element={<CursoDetalhes />} />
            <Route path="/cursos/:id/editar" element={<CursoForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}