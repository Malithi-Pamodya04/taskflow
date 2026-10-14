const priorityStyle = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};
const statusLabel = { todo: 'To Do', in_progress: 'In Progress', completed: 'Completed' };
const statusStyle = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const today = new Date().toISOString().slice(0, 10);
  const overdue = task.status !== 'completed' && task.deadline && task.deadline < today;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800 wrap-break-word">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${priorityStyle[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      {task.description && <p className="text-sm text-gray-600 wrap-break-word">{task.description}</p>}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`px-2 py-1 rounded-full ${statusStyle[task.status]}`}>{statusLabel[task.status]}</span>
        {task.deadline && (
          <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-500'}>
            Due {task.deadline}{overdue && ' (overdue)'}
          </span>
        )}
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onEdit(task)} className="text-sm text-blue-600 hover:underline">Edit</button>
        <button onClick={() => onDelete(task)} className="text-sm text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  );
}