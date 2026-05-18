export const formatCompactVnd = (value: number) => `${(value / 1000000).toFixed(value >= 100000000 ? 0 : 1)}tr`;
