const priorityStyle = {
  low: 'bg-green-500/15 text-green-400 border border-green-500/30',
  medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  high: 'bg-red-500/15 text-red-400 border border-red-500/30',
};
const statusLabel = { todo: 'To Do', in_progress: 'In Progress', completed: 'Completed' };
const statusStyle = {
  todo: 'bg-gray-500/15 text-gray-300',
  in_progress: 'bg-blue-500/15 text-blue-300',
  completed: 'bg-emerald-500/15 text-emerald-300',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const today = new Date().toISOString().slice(0, 10);
  const overdue = task.status !== 'completed' && task.deadline && task.deadline < today;

  return (
    <div className="bg-surface border border-line rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/60 hover:shadow-xl hover:shadow-brand-500/10 animate-pop">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white wrap-break-word">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${priorityStyle[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      {task.description && <p className="text-sm text-gray-400 wrap-break-word">{task.description}</p>}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`px-2 py-1 rounded-full ${statusStyle[task.status]}`}>{statusLabel[task.status]}</span>
        {task.deadline && (
          <span className={overdue ? 'text-red-400 font-medium' : 'text-gray-500'}>
            Due {task.deadline}{overdue && ' (overdue)'}
          </span>
        )}
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onEdit(task)} className="text-sm px-3 py-1 rounded-md text-brand-400 transition hover:bg-brand-500/15 active:scale-95">Edit</button>
        <button onClick={() => onDelete(task)} className="text-sm px-3 py-1 rounded-md text-red-400 transition hover:bg-red-500/15 active:scale-95">Delete</button>
      </div>
    </div>
  );
}