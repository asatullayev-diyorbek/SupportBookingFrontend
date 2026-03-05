import api from './api';

interface LoginResponse {
  code: number;
  message: string;
  data: {
    access: string;
    refresh: string;
  };
}

export const login = async (
  username: string,
  password: string
) => {
  const res = await api.post<LoginResponse>(
    '/v1/auth/login/',
    { username, password }
  );

  localStorage.setItem('access_token', res.data.data.access);
  localStorage.setItem('refresh_token', res.data.data.refresh);

  return res.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};