import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { getErrorMessage } from '../api/errors';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', sort: 'created', order: 'desc' });
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, task = edit
  const [submitting, setSubmitting] = useState(false);

  // Wait 400ms after typing stops before searching.
  useEffect(() => {
    const id = setTimeout(() => setFilters((f) => ({ ...f, search })), 400);
    return () => clearTimeout(id);
  }, [search]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, [loadTasks]);

  function setFilter(name, value) {
    setFilters((f) => ({ ...f, [name]: value }));
  }

  async function handleSave(data) {
    setSubmitting(true);
    try {
      if (editing.id) {
        await api.put(`/tasks/${editing.id}`, data);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created');
      }
      setEditing(null);
      loadTasks();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success('Task deleted');
      loadTasks();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const fieldClass =
    'bg-surface border border-line text-gray-100 rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-brand-500';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <button
          onClick={() => setEditing({})}
          className="bg-linear-to-r from-brand-600 to-purple-500 text-white px-5 py-2 rounded-lg shadow-lg shadow-brand-500/20 transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          + New task
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className={`${fieldClass} placeholder-gray-500 lg:col-span-2`}
        />
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={fieldClass}>
          <option value="">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={filters.priority} onChange={(e) => setFilter('priority', e.target.value)} className={fieldClass}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={`${filters.sort}:${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split(':');
            setFilters((f) => ({ ...f, sort, order }));
          }}
          className={fieldClass}
        >
          <option value="created:desc">Newest first</option>
          <option value="created:asc">Oldest first</option>
          <option value="deadline:asc">Deadline (soonest)</option>
          <option value="deadline:desc">Deadline (latest)</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="py-12 text-center text-gray-400 bg-surface border border-line rounded-xl">
          No tasks found. Create your first one!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onEdit={setEditing} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {editing && (
        <TaskForm
          key={editing.id || 'new'}
          task={editing.id ? editing : null}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
          submitting={submitting}
        />
      )}
    </div>
  );
}