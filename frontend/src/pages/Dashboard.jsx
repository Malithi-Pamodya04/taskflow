import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { getErrorMessage } from '../api/errors';
import { useAuth } from '../context/AuthContext';

const STATUS_LABEL = { todo: 'To Do', in_progress: 'In Progress', completed: 'Completed' };
const STATUS_COLOR = { todo: '#9ca3af', in_progress: '#3b82f6', completed: '#10b981' };
const PRIORITY_COLOR = { low: '#22c55e', medium: '#eab308', high: '#ef4444' };

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-sm text-gray-500">{label}</p>
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

  if (loading) return <div className="py-12 text-center text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="py-12 text-center text-gray-500">Could not load dashboard.</div>;

  const statusData = stats.byStatus.map((s) => ({ name: STATUS_LABEL[s.status], value: Number(s.count), key: s.status }));
  const priorityData = ['low', 'medium', 'high'].map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    count: Number(stats.byPriority.find((x) => x.priority === p)?.count || 0),
    key: p,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total tasks" value={stats.totalTasks} color="text-gray-800" />
        <StatCard label="Completed" value={stats.completedTasks} color="text-emerald-600" />
        <StatCard label="Pending" value={stats.pendingTasks} color="text-blue-600" />
        <StatCard label="Overdue" value={stats.overdueTasks} color="text-red-600" />
      </div>

      {stats.totalTasks === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          No tasks yet. Create some on the Tasks page to see charts here.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold mb-2">Tasks by status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {statusData.map((d) => <Cell key={d.key} fill={STATUS_COLOR[d.key]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold mb-2">Tasks by priority</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Tasks">
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