import api from './api';

export interface Teacher {
  id: number;
  full_name: string;
  username: string;
  slot_capacity: number;
  image_url: string;
  branch_title: string;
  online: boolean;
}

interface TeacherListResponse {
  code: number;
  message: string;
  data: Teacher[];
}

export const getTeachers = async (
  branchId: number
): Promise<Teacher[]> => {
  const res = await api.get<TeacherListResponse>(
    `/v1/books/slots/support-teachers/?branch_id=${branchId}`
  );

  return res.data.data;
};