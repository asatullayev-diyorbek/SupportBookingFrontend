import api from './api';

export interface Slot {
  id: number;
  date: string;
  time: string;
  capacity: number;
  available_places: number;
  is_blocked: boolean;
  is_full: boolean;
  is_booked: boolean;
  status: string;
}

interface SlotResponse {
  code: number;
  message: string;
  data: Slot[];
}

export const getSlots = async (
  teacherId: number,
  date: string
): Promise<Slot[]> => {
  const res = await api.get<SlotResponse>(
    `/v1/books/slots/list/?teacher_id=${teacherId}&date=${date}`
  );

  return res.data.data;
};