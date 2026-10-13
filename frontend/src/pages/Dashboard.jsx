import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return <h1 className="text-2xl font-bold">Hello, {user?.name}</h1>;
}