import api from './api';

// 🎯 CREATE
export const createBooking = async (
  slotId: number,
  comment?: string
) => {
  const res = await api.post(
    '/v1/books/slots/create/',
    {
      slot_id: slotId,
      comment: comment || null,
    }
  );

  return res.data;
};

// 🎯 CANCEL
export const cancelBooking = async (
  bookingId: number
) => {
  const res = await api.post(
    `/v1/books/${bookingId}/cancel/`
  );

  return res.data;
};

// 🎯 REVIEW
export const reviewBooking = async (
  bookingId: number,
  stars: number,
  review: string
) => {
  const res = await api.post(
    `/v1/books/${bookingId}/review/`,
    {
      stars,
      review,
    }
  );

  return res.data;
};