export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  role: string;
  username: string;
  email: string;
  password?: string;
  otp: string;
}

export interface ResetPasswordDto {
  email: string;
  newPassword?: string;
  otp: string;
}
