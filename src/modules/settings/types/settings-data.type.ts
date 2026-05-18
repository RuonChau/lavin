import type { Dayjs } from 'dayjs';
import type { UploadFile } from 'antd';

export interface ISettingsData {
  business: {
    brandName: string;
    logo: UploadFile[];
    taxCode: string;
    contactEmail: string;
    phone: string;
    headOfficeAddress: string;
    website: string;
    description: string;
  };
  operations: {
    defaultBranch: string;
    openTime: Dayjs;
    closeTime: Dayjs;
    timezone: string;
    currency: string;
    onlineOrdering: boolean;
    deliveryEnabled: boolean;
    autoConfirmOrder: boolean;
  };
  security: {
    adminName: string;
    adminEmail: string;
    currentPassword?: string;
    newPassword?: string;
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
  payment: {
    cashEnabled: boolean;
    qrBankingEnabled: boolean;
    eWalletEnabled: boolean;
    cardEnabled: boolean;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    paymentQr: UploadFile[];
    autoConfirmPayment: boolean;
  };
  notifications: {
    emailNotification: boolean;
    smsNotification: boolean;
    pushNotification: boolean;
    newOrderAlert: boolean;
    lowStockAlert: boolean;
    dailyRevenueAlert: boolean;
    promotionExpiryAlert: boolean;
  };
  appearance: {
    themeMode: 'light' | 'dark' | 'system';
    primaryColor: string;
    borderRadius: number;
    density: 'compact' | 'comfortable' | 'spacious';
    animationEnabled: boolean;
  };
}