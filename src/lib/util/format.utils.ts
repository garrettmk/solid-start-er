// This is returned by a formatter when the input is invalid
const INVALID = "--";

/**
 * Formats a date into a locale-specific date string
 *
 * @param from an instance of Date, or a string or number that can be parsed into a Date
 * @returns
 */
export function formatDate(from?: Date | string | number) {
  if (!from) return INVALID;

  const date = new Date(from);
  const valid = !isNaN(date.valueOf());

  return valid ? date.toLocaleDateString() : INVALID;
}

/**
 * Formats a time into a locale-specific time string
 *
 * @param from an instance of Date, or a string or number that can be parsed into a Date
 * @returns
 */
export function formatTime(from?: Date | string | number) {
  if (!from) return INVALID;

  const date = new Date(from);
  const valid = !isNaN(date.valueOf());

  return valid ? date.toLocaleTimeString() : INVALID;
}
