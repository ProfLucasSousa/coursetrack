import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useCourses() {
  const [courses, setCourses] = useLocalStorage('courses:v1', []);

  const add = (data) => {
    const id = crypto.randomUUID();
    setCourses(prev => [...prev, { id, ...data, createdAt: Date.now() }]);
    return id;
  };

  const update = (id, data) =>
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));

  const remove = (id) =>
    setCourses(prev => prev.filter(c => c.id !== id));

  const getById = (id) => courses.find(c => c.id === id);

  const stats = useMemo(() => ({
    total: courses.length,
    ativos: courses.filter(c => c.ativo).length,
  }), [courses]);

  return { courses, add, update, remove, getById, stats };
}