import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { getErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthContext';

const STATUS_LABEL = { todo: 'To Do', in_progress: 'In Progress', completed: 'Completed' };
const STATUS_COLOR = { todo: '#9ca3af', in_progress: '#6366f1', completed: '#10b981' };
const PRIORITY_COLOR = { low: '#22c55e', medium: '#eab308', high: '#ef4444' };
const tooltipStyle = {
  backgroundColor: '#1f2640',
  border: '1px solid #2c3554',
  borderRadius: 8,
  color: '#e5e7eb',
};

function StatCard({ label, value, color }) {
  return (
    <div className="bg-surface border border-line border-t-4 border-t-brand-500 rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-12 text-center text-gray-400">Loading dashboard...</div>;
  if (!stats) return <div className="py-12 text-center text-gray-400">Could not load dashboard.</div>;

  const statusData = stats.byStatus.map((s) => ({ name: STATUS_LABEL[s.status], value: Number(s.count), key: s.status }));
  const priorityData = ['low', 'medium', 'high'].map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    count: Number(stats.byPriority.find((x) => x.priority === p)?.count || 0),
    key: p,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}</h1>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total tasks" value={stats.totalTasks} color="text-white" />
        <StatCard label="Completed" value={stats.completedTasks} color="text-emerald-400" />
        <StatCard label="Pending" value={stats.pendingTasks} color="text-brand-400" />
        <StatCard label="Overdue" value={stats.overdueTasks} color="text-red-400" />
      </div>

      {stats.totalTasks === 0 ? (
        <div className="bg-surface border border-line rounded-xl p-8 text-center text-gray-400">
          No tasks yet. Create some on the Tasks page to see charts here.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="bg-surface border border-line rounded-xl p-4">
            <h2 className="font-semibold text-white mb-2">Tasks by status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label stroke="#161b2e">
                    {statusData.map((d) => <Cell key={d.key} fill={STATUS_COLOR[d.key]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-surface border border-line rounded-xl p-4">
            <h2 className="font-semibold text-white mb-2">Tasks by priority</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2c3554" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis allowDecimals={false} stroke="#9ca3af" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.1)' }} />
                  <Bar dataKey="count" name="Tasks" radius={[6, 6, 0, 0]}>
                    {priorityData.map((d) => <Cell key={d.key} fill={PRIORITY_COLOR[d.key]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}