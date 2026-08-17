export function formatTimeAgo(dateString: string | number): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return date.toLocaleTimeString();
}

export function formatValue(value: number, decimals: number): string {
  if (isNaN(value)) return '—';
  return value.toFixed(decimals);
}
