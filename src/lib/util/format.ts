export function formatDate(from?: Date | string | number) {
  if (!from) return "--";

  const date = new Date(from);
  const valid = !isNaN(date.valueOf());

  return valid ? date.toLocaleDateString() : "--";
}

export function formatTime(from?: Date | string | number) {
  if (!from) return "--";

  const date = new Date(from);
  const valid = !isNaN(date.valueOf());

  return valid ? date.toLocaleTimeString() : "--";
}
