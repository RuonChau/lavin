import dayjs from "dayjs";
import { ISettingsData } from "../types/settings-data.type";

export const defaultSettings: ISettingsData = {
  business: {
    brandName: 'LaVin Coffee Group',
    logo: [
      {
        uid: 'logo-1',
        name: 'lavin-logo.png',
        status: 'done',
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=240&h=240&fit=crop',
      },
    ],
    taxCode: '0318 452 991',
    contactEmail: 'admin@lavin.coffee',
    phone: '028 3812 6688',
    headOfficeAddress: '72 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    website: 'https://lavin.coffee',
    description: 'Chuỗi cafe specialty phục vụ đồ uống thủ công, bánh tươi và combo văn phòng.',
  },
  operations: {
    defaultBranch: 'nguyen-hue',
    openTime: dayjs('07:00', 'HH:mm'),
    closeTime: dayjs('22:30', 'HH:mm'),
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    onlineOrdering: true,
    deliveryEnabled: true,
    autoConfirmOrder: false,
  },
  security: {
    adminName: 'Nguyễn Minh Anh',
    adminEmail: 'owner@lavin.coffee',
    currentPassword: '',
    newPassword: '',
    twoFactorEnabled: true,
    sessionTimeout: 60,
  },
  payment: {
    cashEnabled: true,
    qrBankingEnabled: true,
    eWalletEnabled: true,
    cardEnabled: true,
    bankName: 'Vietcombank',
    bankAccountName: 'CONG TY TNHH LAVIN COFFEE',
    bankAccountNumber: '1028 8899 6688',
    paymentQr: [],
    autoConfirmPayment: true,
  },
  notifications: {
    emailNotification: true,
    smsNotification: false,
    pushNotification: true,
    newOrderAlert: true,
    lowStockAlert: true,
    dailyRevenueAlert: true,
    promotionExpiryAlert: true,
  },
  appearance: {
    themeMode: 'light',
    primaryColor: '#8B5E3C',
    borderRadius: 16,
    density: 'comfortable',
    animationEnabled: true,
  },
};
