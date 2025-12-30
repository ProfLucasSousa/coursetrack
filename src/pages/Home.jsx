import Card from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';

export default function Home() {
  const { stats } = useCourses();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <div>
            <p className="text-sm text-gray-600">Cursos</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-sm text-gray-600">Ativos</p>
            <p className="text-3xl font-bold">{stats.ativos}</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-3">Comece por aqui</h2>
        <div className="flex gap-3">
          <Link to="/cursos"><Button>Ver cursos</Button></Link>
          <Link to="/cursos/novo"><Button>Cadastrar curso</Button></Link>
        </div>
      </Card>
    </div>
  );
}