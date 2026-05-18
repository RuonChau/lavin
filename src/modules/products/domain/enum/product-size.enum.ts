export enum ESize {
  S = 'Nhỏ (size S)',
  M = 'Vừa (size M)',
  L = 'Lớn (size L)',
}

// Map từ key (S/M/L) sang label hiển thị
export const SIZE_LABEL_MAP: Record<string, string> = {
  S: 'Nhỏ',
  M: 'Vừa',
  L: 'Lớn',
};

// Array các key của enum ESize — dùng để gửi lên BE (S, M, L)
export const SIZES = Object.keys(ESize) as Array<keyof typeof ESize>;

// Alias giữ tương thích
export const SIZE_KEYS = SIZES;

