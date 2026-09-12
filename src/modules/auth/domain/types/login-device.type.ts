export interface LoginDevice {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  createdAt: Date;
  lastActiveAt: Date;
  isCurrent: boolean;
}
