import { useState } from 'react';

const emptyForm = { title: '', description: '', priority: 'medium', status: 'todo', deadline: '' };

export default function TaskForm({ task, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(
    task
      ? {
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status,
          deadline: task.deadline || '',
        }
      : emptyForm
  );
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      priority: form.priority,
      status: form.status,
      deadline: form.deadline || null,
    });
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-10">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold">{task ? 'Edit task' : 'New task'}</h2>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} maxLength={150} className={inputClass} />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">Priority</label>
            <select id="priority" name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium mb-1">Deadline</label>
          <input id="deadline" name="deadline" type="date" value={form.deadline} onChange={handleChange} className={inputClass} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}