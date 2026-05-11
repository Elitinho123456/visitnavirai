import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, apiFetch } from '@/config/api';
import type { DashboardStats } from '@/types/api';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const res = await apiFetch(`${API_BASE_URL}/api/dashboard/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Falha ao buscar estatísticas");
      return res.json();
    }
  });
}
