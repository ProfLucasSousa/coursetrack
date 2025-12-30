# Criação de Dashboard CourseTrack (CRUD de Cursos)

Projeto prático com **componentes**, **páginas**, **hooks** e **rotas**.

---

## 🎯 Objetivos

- Implementar **rotas**: Dashboard, Lista, Novo, Detalhes, Editar.
- Criar **hooks**: `useLocalStorage` e `useCourses`.
- Reutilizar `design-tokens`, `Button`, `Card`, `Input` (da Aula 20).
- Persistir dados em **localStorage**.

---

## 🧱 Stack

- Vite + React 18
- React Router 6
- Tailwind (mesma config feita nas Aulas 19/20)

---

## 🚀 Passo 0 — Setup rápido

```bash
npm create vite@latest coursetrack
cd coursetrack
npm i
npm i react-router-dom
npm i tailwindcss @tailwindcss/vite
```

Em `vite.config.js` e `src/index.css`, repete a config da Aula 19/20 (plugin + `@import "tailwindcss"`;).

Componentes: copie apenas `Button.jsx`, `Card.jsx` e `Input.jsx` da Aula 20 para `src/components/` e o `design-tokens.js` para `src/`.

## 🗂️ Estrutura de pastas

```bash
src/
  components/
    Button.jsx           # da Aula 20 (copiar)
    Card.jsx             # da Aula 20 (copiar)
    Input.jsx            # da Aula 20 (copiar)
    Menu.jsx             # novo
  hooks/
    useLocalStorage.js   # novo
    useCourses.js        # novo
  pages/
    Home.jsx             # novo
    CursosList.jsx       # novo
    CursoForm.jsx        # novo
    CursoDetalhes.jsx    # novo
    NotFound.jsx         # novo
  App.jsx                # novo
  design-tokens.js       # da Aula 20 (copiar)
  main.jsx               # padrão vite
  index.css              # igual à Aula 20 (Tailwind)
```

## 🧭 `src/components/Menu.jsx`

### Use a ideia Link + `useLocation` para “ativo”

```jsx
import { Link, useLocation } from "react-router-dom";

export default function Menu() {
  const { pathname } = useLocation();
  const active = (p) =>
    pathname === p
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:text-white hover:bg-gray-700";

  return (
    <nav className="bg-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold">CourseTrack</span>
        <div className="flex gap-2">
          <Link to="/" className={`px-3 py-2 rounded ${active("/")}`}>
            Dashboard
          </Link>
          <Link
            to="/cursos"
            className={`px-3 py-2 rounded ${active("/cursos")}`}
          >
            Cursos
          </Link>
          <Link
            to="/cursos/novo"
            className={`px-3 py-2 rounded ${active("/cursos/novo")}`}
          >
            Novo
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

## 🪝 Hooks

`src/hooks/useLocalStorage.js`

```js
// Importa hooks do React
import { useEffect, useState } from "react";

// Hook reutilizável para sincronizar estado com localStorage
export function useLocalStorage(key, initialValue) {
  // 1) Estado com inicialização "preguiçosa" (lazy):
  //    A função passada ao useState só roda uma vez, no primeiro render.
  //    Tentamos ler do localStorage pela 'key'. Se existir, parseamos o JSON.
  //    Se não existir (ou der erro ao parsear), usamos 'initialValue'.
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key); // lê string do storage
      return JSON.parse(raw) ?? initialValue; // tenta parsear; se null, cai no initialValue
    } catch {
      // Qualquer erro (JSON inválido, storage bloqueado, etc.) -> fallback
      return initialValue;
    }
  });

  // 2) Efeito que roda sempre que 'key' ou 'value' mudarem:
  //    Serializa o estado atual e salva no localStorage.
  //    try/catch evita quebrar a UI em casos de:
  //      - Quota excedida
  //      - Modo privado bloqueando storage
  //      - localStorage indisponível
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silencia o erro — opção prática para não travar a app.
      // (Se quiser debugar, logue aqui.)
    }
  }, [key, value]);

  // 3) Retorna um par [value, setValue], igual useState,
  //    mas com a garantia de persistência entre recarregamentos.
  return [value, setValue];
}
```

`src/hooks/useCourses.js`

```js
// Hook de domínio para gerenciar "courses" com persistência em localStorage

import { useMemo, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useCourses() {
  // 1) Estado persistente:
  //    - 'courses' vive em React state, mas também sincroniza com localStorage (chave 'courses:v1').
  //    - O array inicial é [] (sem cursos).
  const [courses, setCourses] = useLocalStorage("courses:v1", []);

  // 2) add: cria um novo curso
  //    - Gera um id único com crypto.randomUUID().
  //    - Cria o objeto do curso mesclando dados do formulário com id e createdAt.
  //    - Usa setCourses com função (prev) para manter imutabilidade.
  //    - Retorna o id para navegação imediata (ex.: redirecionar para detalhes).
  const add = (data) => {
    const id = crypto.randomUUID();
    setCourses((prev) => [...prev, { id, ...data, createdAt: Date.now() }]);
    return id;
  };

  // 3) update: atualiza um curso existente
  //    - Percorre o array; quando o id bate, retorna novo objeto mesclando 'data'.
  //    - Mantém imutabilidade (map cria novo array).
  const update = (id, data) =>
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );

  // 4) remove: exclui um curso por id
  //    - Filtra o array removendo o item com id informado.
  //    - Também imutável (filter retorna novo array).
  const remove = (id) => setCourses((prev) => prev.filter((c) => c.id !== id));

  // 5) getById: leitura direta
  //    - Busca na lista o curso com id exato.
  //    - Útil para páginas de Detalhes/Editar.
  const getById = useCallback((id) => {
    return courses.find(c => c.id === id);
  }, [courses]);

  // 6) stats: métricas derivadas (memoizadas)
  //    - 'total' = quantidade de cursos.
  //    - 'ativos' = quantos têm c.ativo === true.
  //    - useMemo evita recalcular quando 'courses' não muda.
  const stats = useMemo(
    () => ({
      total: courses.length,
      ativos: courses.filter((c) => c.ativo).length,
    }),
    [courses]
  );

  // 7) Interface pública do hook:
  //    - expõe lista, as operações CRUD e as métricas.
  return { courses, add, update, remove, getById, stats };
}

/*
Notas rápidas:
- Imutabilidade em add/update/remove garante previsibilidade e facilita debug.
- Se quiser evitar recriação de funções a cada render, pode envolver add/update/remove/remove/getById em useCallback.
- Se existir risco de dados antigos no localStorage, versionar a chave ('courses:v2') ajuda a “resetar” com segurança.
*/
```

## 📄 Páginas

### Home (dashboard)

Usa `Card` para mostrar métricas (ex: total e ativos).
`src/pages/Home.jsx`

```jsx
import Card from "../components/Card";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useCourses } from "../hooks/useCourses";

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
          <Link to="/cursos">
            <Button>Ver cursos</Button>
          </Link>
          <Link to="/cursos/novo">
            <Button>Cadastrar curso</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
```

### Lista de cursos

`Card` para cada item + ações com `Button`. Campo de busca com `Input`.
`src/pages/CursosList.jsx`

```jsx
import { useMemo, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useCourses } from "../hooks/useCourses";

export default function CursosList() {
  const { courses, remove, update } = useCourses();
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? courses.filter((c) => c.titulo?.toLowerCase().includes(s))
      : courses;
  }, [q, courses]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Cursos</h1>
        <Link to="/cursos/novo">
          <Button>Novo</Button>
        </Link>
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
        {filtered.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between">
              <h2 className="font-semibold">{c.titulo || "Sem título"}</h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  c.ativo
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {c.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {c.descricao || "Sem descrição."}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={() => nav(`/cursos/${c.id}`)}>Detalhes</Button>
              <Button onClick={() => nav(`/cursos/${c.id}/editar`)}>
                Editar
              </Button>
              <Button onClick={() => remove(c.id)}>Excluir</Button>
              <Button onClick={() => update(c.id, { ativo: !c.ativo })}>
                {c.ativo ? "Desativar" : "Ativar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Formulário (novo/editar)

Reaproveita `Input` e `Button`.
`src/pages/CursoForm.jsx`

```jsx
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useCourses } from "../hooks/useCourses";

export default function CursoForm() {
  const { id } = useParams();
  const { add, getById, update } = useCourses();
  const nav = useNavigate();

  const editing = Boolean(id);
  const [form, setForm] = useState({ titulo: "", descricao: "", ativo: true });

  useEffect(() => {
    if (editing) {
      const c = getById(id); // Usando o id da URL
      if (c) {
        setForm({
          titulo: c.titulo || "",
          descricao: c.descricao || "",
          ativo: !!c.ativo,
        });
      }
    }
  }, [editing, id, getById]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return alert("Título é obrigatório.");
    if (editing) {
      update(id, form);
      nav("/cursos");
    } else {
      const newId = add(form);
      nav(`/cursos/${newId}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <h1 className="text-xl font-semibold mb-4">
          {editing ? "Editar curso" : "Novo curso"}
        </h1>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm mb-1">Título</label>
            <Input
              placeholder="Ex.: React do Zero"
              value={form.titulo}
              onChange={(e) =>
                setForm((f) => ({ ...f, titulo: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Descrição (opcional)</label>
            <Input
              placeholder="Um resumo rápido…"
              value={form.descricao}
              onChange={(e) =>
                setForm((f) => ({ ...f, descricao: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="ativo"
              type="checkbox"
              checked={form.ativo}
              onChange={(e) =>
                setForm((f) => ({ ...f, ativo: e.target.checked }))
              }
            />
            <label htmlFor="ativo">Ativo</label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">{editing ? "Salvar" : "Criar"}</Button>
            <Button type="button" onClick={() => nav(-1)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
```

### Detalhes

`src/pages/CursoDetalhes.jsx`

```jsx
import { useParams, Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { useCourses } from "../hooks/useCourses";

export default function CursoDetalhes() {
  const { id } = useParams();
  const { getById } = useCourses();
  const c = getById(id);

  if (!c) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        Curso não encontrado.{" "}
        <Link to="/cursos" className="text-blue-600 underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <Card>
        <h1 className="text-2xl font-bold">{c.titulo}</h1>
        <p className="text-gray-700 my-4">{c.descricao || "Sem descrição."}</p>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            c.ativo
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {c.ativo ? "Ativo" : "Inativo"}
        </span>
      </Card>

      <div className="flex gap-2">
        <Link to={`/cursos/${c.id}/editar`}>
          <Button>Editar</Button>
        </Link>
        <Link to="/cursos">
          <Button>Voltar</Button>
        </Link>
      </div>
    </div>
  );
}
```

### NotFound

`src/pages/NotFound.jsx`

```jsx
export default function NotFound() {
  return (
    <div className="p-6 max-w-3xl mx-auto">404 — Página não encontrada.</div>
  );
}
```

## 🛣️ Rotas e Bootstrap do app

`src/App.jsx`

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import CursosList from "./pages/CursosList";
import CursoForm from "./pages/CursoForm";
import CursoDetalhes from "./pages/CursoDetalhes";
import NotFound from "./pages/NotFound";

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
```

## ✅ O que entrega

- Rotas funcionando (sem recarregar).
- CRUD simples: **criar**, **listar**, **editar**, **remover**.
- Persistência em `localStorage`.
- Uso real de **3 componentes** da Aula 20: `Button`, `Card`, `Input`.
- Código limpo.

## 🧪 Rubrica rápida

- **Hooks** bem aplicados (`useLocalStorage`, `useCourses`).
- **Navegação** clara (menu, página ativa).
- **Formulário** com validação mínima.
- **Lista** com busca e ações.

## ⚡ Desafios (opcional)

- Ordenar por `createdAt`.
- Filtro “Somente ativos”.
- Modal de confirmação ao excluir.
