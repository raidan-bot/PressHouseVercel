import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-6">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
        <h1 className="text-3xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-600">You do not have permission to access this page.</p>
        <Link to="/" className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
