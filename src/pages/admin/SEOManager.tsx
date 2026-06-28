import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function SEOManager() {
  const [settings, setSettings] = useState({
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogDefaultImage: ''
  });

  useEffect(() => {
    api.get('/api/settings/seo').then(({ data }) => setSettings(data));
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put('/api/settings/seo', settings);
      toast.success('SEO settings updated');
    } catch (e) {
      toast.error('Failed to update SEO settings');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">SEO Manager</h2>
      <div className="space-y-4">
        <input 
            className="w-full p-2 border rounded"
            value={settings.seoTitle} 
            onChange={e => setSettings({...settings, seoTitle: e.target.value})}
            placeholder="SEO Title"
        />
        <textarea 
            className="w-full p-2 border rounded"
            value={settings.seoDescription} 
            onChange={e => setSettings({...settings, seoDescription: e.target.value})}
            placeholder="SEO Description"
        />
        <button onClick={handleUpdate} className="bg-blue-600 text-white p-2 rounded">Save</button>
      </div>
    </div>
  );
}
