export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  is_active: boolean;
  is_warehouse: boolean;
  is_headquarter: boolean;
  created_at: string;
  updated_at: string;
}
