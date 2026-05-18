export const browserAuthSession = {
  getAccessToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },
  setAccessToken: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', token);
  },
  getRefreshToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },
  setRefreshToken: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refresh_token', token);
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
  }
};
