import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Hello, {user?.name}</h1>
      <button onClick={logout} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg">Log out</button>
    </div>
  );
}