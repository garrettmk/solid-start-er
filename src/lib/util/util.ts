import { createStore } from "solid-js/store";

/**
 * A function that does nothing
 *
 * @param args anything
 */
export function noop(...args: any[]) {}

/**
 * A function that returns the value passed in
 *
 * @param value anything
 * @returns the value passed in
 */
export function identity(value: any) {
  return value;
}

/**
 * Casts the input to a boolean
 *
 * @param value anything
 * @returns `true` or `false` depending on whether the value is truthy or falsy
 */
export function isTruthy(value: unknown): boolean {
  return !!value;
}

/**
 * Casts the input to a boolean and inverts it.
 *
 * @param value anything
 * @returns `true` if the input is falsy, `false` otherwise
 */
export function isFalsy(value: unknown): boolean {
  return !value;
}

/**
 * Options for the `clamp` function
 */
export type ClampOptions = {
  min?: number;
  max?: number;
};

/**
 * Restricts a number to a range defined by `options`
 *
 * @param value a number
 * @param options the minimum and maximum values to clamp the number to
 * @returns A number in the range defined by `options`
 */
export function clamp(value: number, options: ClampOptions) {
  const { min, max } = options;

  if (min !== undefined) value = Math.max(min, value);

  if (max !== undefined) value = Math.min(max, value);

  return value;
}

/**
 * An asynchronous delay function
 *
 * @param ms the number of milliseconds to delay
 * @returns a Promise that resolves after `ms` milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function createFormStore<T extends object>(initial?: Partial<T>) {
  const [state, setState] = createStore<T>({ ...initial } as T);
  const methods = {
    handleChange: (field: keyof T) => (e: Event) =>
      setState((c) => ({
        ...c,
        // @ts-ignore
        [field]: e.currentTarget?.value,
      })),

    isChecked: (field: keyof T) => !!state[field],
  };

  return [state, methods] as const;
}

/**
 * Encodes a file as a base64 string, suitable for sending to the API
 * @param file a File object
 * @returns The encoded file data
 */
export function encodeFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
}
