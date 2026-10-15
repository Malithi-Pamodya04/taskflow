import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/errors';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      toast.error('Password needs 8+ characters with a letter and a number');
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full bg-surface-2 border border-line text-gray-100 placeholder-gray-500 rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface border border-line p-8 rounded-2xl shadow-2xl space-y-4 animate-pop">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className={inputClass} />
          <p className="text-xs text-gray-500 mt-1">At least 8 characters, with a letter and a number.</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-linear-to-r from-brand-600 to-purple-500 text-white py-2.5 rounded-lg font-medium shadow-lg shadow-brand-500/20 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-sm text-gray-400 text-center">
          Already registered? <Link to="/login" className="text-brand-400 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}