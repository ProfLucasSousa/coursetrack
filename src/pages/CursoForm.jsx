import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';

export default function CursoForm() {
  const { id } = useParams();
  const { add, getById, update } = useCourses();
  const nav = useNavigate();

  const editing = Boolean(id);
  const [form, setForm] = useState({ titulo: '', descricao: '', ativo: true });

  useEffect(() => {
    if (editing) {
      const c = getById(id);
      if (c) setForm({ titulo: c.titulo || '', descricao: c.descricao || '', ativo: !!c.ativo });
    }
  }, [editing, id, getById]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return alert('Título é obrigatório.');
    if (editing) {
      update(id, form);
      nav('/cursos');
    } else {
      const newId = add(form);
      nav(`/cursos/${newId}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <h1 className="text-xl font-semibold mb-4">
          {editing ? 'Editar curso' : 'Novo curso'}
        </h1>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm mb-1">Título</label>
            <Input
              placeholder="Ex.: React do Zero"
              value={form.titulo}
              onChange={(e) => setForm(f => ({ ...f, titulo: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Descrição (opcional)</label>
            <Input
              placeholder="Um resumo rápido…"
              value={form.descricao}
              onChange={(e) => setForm(f => ({ ...f, descricao: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="ativo"
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setForm(f => ({ ...f, ativo: e.target.checked }))}
            />
            <label htmlFor="ativo">Ativo</label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">{editing ? 'Salvar' : 'Criar'}</Button>
            <Button type="button" onClick={() => nav(-1)}>Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}