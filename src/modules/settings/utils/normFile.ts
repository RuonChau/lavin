
export const normFile = (event: any) => {
  if (Array.isArray(event)) return event;
  return event?.fileList ?? [];
};