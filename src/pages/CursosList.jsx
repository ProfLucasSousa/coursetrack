import { useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';

export default function CursosList() {
  const { courses, remove, update } = useCourses();
  const [q, setQ] = useState('');
  const nav = useNavigate();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? courses.filter(c => c.titulo?.toLowerCase().includes(s)) : courses;
  }, [q, courses]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Cursos</h1>
        <Link to="/cursos/novo"><Button>Novo</Button></Link>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Buscar por título…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {filtered.length === 0 && <p className="text-gray-500">Nada por aqui.</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <Card key={c.id}>
            <div className="flex items-start justify-between">
              <h2 className="font-semibold">{c.titulo || 'Sem título'}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {c.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {c.descricao || 'Sem descrição.'}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={() => nav(`/cursos/${c.id}`)}>Detalhes</Button>
              <Button onClick={() => nav(`/cursos/${c.id}/editar`)}>Editar</Button>
              <Button onClick={() => remove(c.id)}>Excluir</Button>
              <Button onClick={() => update(c.id, { ativo: !c.ativo })}>
                {c.ativo ? 'Desativar' : 'Ativar'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}