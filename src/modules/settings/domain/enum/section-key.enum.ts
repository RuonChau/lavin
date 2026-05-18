export enum ESectionKeyEnum {
  BUSINESS = 'business',
  OPERATIONS = 'operations',
  SECURITY = 'security',
  PERMISSIONS = 'permissions',
  PAYMENT = 'payment',
  NOTIFICATIONS = 'notifications',
  APPEARANCE = 'appearance',
}

export type TSectionValues = 'business' | 'operations' | 'security' | 'permissions' | 'payment' | 'notifications' | 'appearance';

export type TSectionKey = (typeof ESectionKeyEnum)[keyof typeof ESectionKeyEnum];