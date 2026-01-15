import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string) {
  if (!name) return '';

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const isThisWeek =
    date >
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  });

  if (isToday) return timeFormatter.format(date);
  if (isYesterday) return `Yesterday ${timeFormatter.format(date)}`;
  if (isThisWeek)
    return `${dayFormatter.format(date)} ${timeFormatter.format(date)}`;
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
}
