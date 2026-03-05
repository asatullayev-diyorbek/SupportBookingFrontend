import api from './api'; // Boya yozgan interceptorli api instansiyasi

export interface CommentPayload {
  star: number;
  comment: string;
}

/**
 * Foydalanuvchi fikr-mulohazasini yuborish
 */
export const sendProfileComment = async (data: CommentPayload) => {
  try {
    const response = await api.post('/v1/auth/comment/', data);
    return response.data;
  } catch (error: any) {
    // Xatolikni yuqoriga (komponentga) chiroyli ko'rinishda otamiz
    throw error.response?.data || error.message;
  }
};

/**
 * Agar kerak bo'lsa: Foydalanuvchi avval fikr qoldirganmi yoki yo'qmi tekshirish
 */
export const checkMyComment = async () => {
  try {
    const response = await api.get('/auth/comment/');
    return response.data;
  } catch (error) {
    return null;
  }
};