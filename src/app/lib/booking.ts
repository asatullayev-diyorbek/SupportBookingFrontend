import api from './api';

export interface MyBooking {
  id: number;
  teacher_name: string;
  slot_date: string;
  slot_time: string;
  status: string;
  comment: string | null;
  review: string | null;
  stars: number | null;
  created_at: string;
}

interface BookingResponse {
  code: number;
  message: string;
  data: MyBooking[];
}

export const getMyBookings = async (
  status?: string,
  date?: string
): Promise<MyBooking[]> => {
  const params = new URLSearchParams();

  if (status) params.append('status', status);
  if (date) params.append('date', date);

  const res = await api.get<BookingResponse>(
    `/v1/books/my/?${params.toString()}`
  );

  return res.data.data;
};