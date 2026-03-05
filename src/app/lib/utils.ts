import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const months = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const monthShort = months[d.getMonth()].substring(0, 3);
  return `${d.getDate()} ${monthShort}`;
}

export function canCancelBooking(bookedAt: string, bookingDateTime: string): boolean {
  const now = new Date();
  const bookingTime = new Date(bookingDateTime);
  const diffHours = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours > 1;
}