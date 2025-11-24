import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMonth(date: Date) {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  return eachDayOfInterval({ start, end });
}