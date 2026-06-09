export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions?: {
    [categoryKey: string]: {
      read: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
  profileImage?: string;
}

export interface DashboardStats {
  users: number;
  hotels?: number;
  inns?: number;
  events: number;
  services?: number;
  attractions?: number;
  restaurants?: number;
  sports?: number;
}
