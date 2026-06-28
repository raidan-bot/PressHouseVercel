import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/db';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');
  const navigate = useNavigate();
  const { updateUserContext } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG('');
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      updateUserContext(token, user);
      navigate('/admin');
    } catch (error: any) {
      setErrorMSG(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMSG('');
    try {
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin'
        }
      });
      if (signInError) throw signInError;
      // Note: Supabase OAuth redirects the user
    } catch (err: any) {
      console.error(err);
      setErrorMSG(err?.message || 'Google login failed');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 text-center">Admin Login</h1>
        {errorMSG && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMSG}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button 
            type="submit" 
            disabled={loading || googleLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Login'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-slate-400">or admin google</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full bg-white border border-slate-200 text-slate-700 p-3 rounded-xl font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {googleLoading ? (
            <Loader2 className="animate-spin text-blue-600" size={16} />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.85 2.99c.9-2.7 3.4-4.51 6.76-4.51z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.01 3.67-8.64z"/>
              <path fill="#FBBC05" d="M5.24 14.55c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.39 7.56C.5 9.36 0 11.38 0 13.5s.5 4.14 1.39 5.94l3.85-2.89z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.36 0-5.86-1.81-6.76-4.51L1.39 16.71C3.37 20.65 7.35 23 12 23z"/>
            </svg>
          )}
          Sign in / admin authentication
        </button>
      </div>
    </div>
  );
}
