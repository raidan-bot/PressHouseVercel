import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Key, Plus, Trash2, Copy, Check, Shield, AlertCircle } from "lucide-react";

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(["articles", "events", "cinema"]);
  const [newKeyResult, setNewKeyResult] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | string>("");

  useEffect(() => { fetchKeys(); }, []);

  const fetchKeys = async () => {
    try {
      setLoading(true); setError("");
      const res = await api.get("/api/keys");
      setKeys(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load API keys");
    } finally { setLoading(false); }
  };

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      const res = await api.post("/api/keys", { name: newKeyName, scopes: newKeyScopes });
      setNewKeyResult(res.data);
      setNewKeyName(""); setNewKeyScopes(["articles", "events", "cinema"]);
      fetchKeys();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create API key");
    }
  };

  const deleteKey = async (id: number | string) => {
    if (!window.confirm("Are you sure?")) return;
    try { setDeletingId(id); await api.delete(`/api/keys/${id}`); fetchKeys(); }
    catch (err: any) { setError(err.response?.data?.error || "Failed to delete"); }
    finally { setDeletingId(""); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-6 h-6 text-rose-600" /> API Key Manager
          </h2>
        </div>
        <button onClick={() => { setShowCreate(!showCreate); setNewKeyResult(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm">
          <Plus size={16} /> Create Key
        </button>
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {newKeyResult && <div className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded-lg">
        <p className="font-bold text-sm">New Key Created (SAVE THIS):</p>
        <code className="text-xs font-mono break-all block mt-2">{newKeyResult.full_key}</code>
        <button onClick={() => setNewKeyResult(null)} className="mt-2 px-3 py-1 bg-amber-200 rounded text-xs">Close</button>
      </div>}
      {showCreate && !newKeyResult && (
        <form onSubmit={createKey} className="mb-6 bg-white p-4 rounded-lg border border-slate-200 space-y-3">
          <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Key name" className="w-full px-3 py-2 border border-slate-300 rounded text-sm" required />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-bold">Create</button>
          <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 bg-slate-100 rounded text-sm font-bold">Cancel</button>
        </form>
      )}
      <div className="bg-white rounded-lg border border-slate-200">
        {loading ? <div className="p-8 text-center">Loading...</div>
        : keys.length === 0 ? <div className="p-8 text-center text-slate-500">No API keys found.</div>
        : <table className="w-full text-sm"><tbody className="divide-y">
          {keys.map((k: any) => (
            <tr key={k.id} className="hover:bg-slate-50"><td className="px-6 py-3">{k.name}</td><td className="px-6 py-3">{k.key_prefix}...</td>
              <td className="px-6 py-3"><button onClick={() => deleteKey(k.id)} disabled={deletingId === k.id} className="text-red-600"><Trash2 size={16} /></button></td>
            </tr>
          ))}
        </tbody></table>}
      </div>
    </div>
  );
}
