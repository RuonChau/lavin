const AUTH_STORAGE_KEYS = ['access_token', 'refresh_token', 'user_id'];

const clearAccessibleCookies = () => {
  if (typeof document === 'undefined') return;

  const hostnameParts = window.location.hostname.split('.');
  const domains = hostnameParts.flatMap((_, index) => {
    const domain = hostnameParts.slice(index).join('.');
    return [domain, `.${domain}`];
  });
  const paths = ['/', window.location.pathname];

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim();
    if (!name) return;

    document.cookie = `${name}=; Max-Age=0; path=/`;
    paths.forEach((path) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=${path}; domain=${domain}`;
      });
    });
  });
};

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
    AUTH_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    clearAccessibleCookies();
  }
};
