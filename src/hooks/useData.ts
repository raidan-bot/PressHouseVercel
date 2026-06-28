import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useNews(limit?: number) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/news');
        setData(Array.isArray(response.data) ? (limit ? response.data.slice(0, limit) : response.data) : []);
      } catch (err: any) {
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  return { data, loading, error, isEmpty: !loading && data.length === 0 };
}

export function useViolations(limit?: number) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/violations');
        setData(Array.isArray(response.data) ? (limit ? response.data.slice(0, limit) : response.data) : []);
      } catch (err: any) {
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  return { data, loading, error, isEmpty: !loading && data.length === 0 };
}

export function useProjects(limit?: number) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/projects');
        setData(Array.isArray(response.data) ? (limit ? response.data.slice(0, limit) : response.data) : []);
      } catch (err: any) {
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  return { data, loading, error, isEmpty: !loading && data.length === 0 };
}
