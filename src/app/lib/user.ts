import api from './api';

export interface Me {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  branch: {
    id: number;
    title: string;
  };
  profile: any;
}

interface MeResponse {
  code: number;
  message: string;
  data: Me;
}

export const getMe = async (): Promise<Me> => {
  const res = await api.get<MeResponse>('/v1/auth/me/');
  return res.data.data;
};