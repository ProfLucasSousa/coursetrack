import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCourses } from '../hooks/useCourses';

export default function CursoDetalhes() {
  const { id } = useParams();
  const { getById } = useCourses();
  const c = getById(id);

  if (!c) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        Curso não encontrado. <Link to="/cursos" className="text-blue-600 underline">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <Card>
        <h1 className="text-2xl font-bold">{c.titulo}</h1>
        <p className="text-gray-700 my-4">{c.descricao || 'Sem descrição.'}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${c.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {c.ativo ? 'Ativo' : 'Inativo'}
        </span>
      </Card>

      <div className="flex gap-2">
        <Link to={`/cursos/${c.id}/editar`}><Button>Editar</Button></Link>
        <Link to="/cursos"><Button>Voltar</Button></Link>
      </div>
    </div>
  );
}