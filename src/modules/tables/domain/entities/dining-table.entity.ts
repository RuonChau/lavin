export type DiningTableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';

export interface DiningTable {
  id: string;
  branch_id?: string | null;
  code: string;
  area?: string | null;
  capacity: number;
  status: DiningTableStatus;
  server_name?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DiningTablePayload {
  branch_id?: string | null;
  code: string;
  area?: string | null;
  capacity: number;
  status: DiningTableStatus;
  server_name?: string | null;
  display_order?: number;
}
