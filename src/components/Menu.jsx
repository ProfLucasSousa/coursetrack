import { Link, useLocation } from 'react-router-dom';

export default function Menu() {
  const { pathname } = useLocation();
  const active = (p) =>
    pathname === p
      ? 'bg-blue-600 text-white'
      : 'text-gray-300 hover:text-white hover:bg-gray-700';

  return (
    <nav className="bg-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold">CourseTrack</span>
        <div className="flex gap-2">
          <Link to="/" className={`px-3 py-2 rounded ${active('/')}`}>Dashboard</Link>
          <Link to="/cursos" className={`px-3 py-2 rounded ${active('/cursos')}`}>Cursos</Link>
          <Link to="/cursos/novo" className={`px-3 py-2 rounded ${active('/cursos/novo')}`}>Novo</Link>
        </div>
      </div>
    </nav>
  );
}