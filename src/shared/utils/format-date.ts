import dayjs from '@/shared/lib/dayjs';

export function formatDate(value: string | Date, format = 'DD/MM/YYYY') {
  return dayjs(value).format(format);
}
