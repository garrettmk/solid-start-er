import clsx from "clsx";
import { clamp } from "../util/util";

/**
 * Standardizes the sizes of elements
 */
export type SizeProp =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

/**
 * An array of valid SizeProp values
 */
export const sizePropValues: SizeProp[] = [
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
];

/**
 * Options for adjusting a size prop
 */
export type ClampSizeOptions = {
  min?: SizeProp;
  max?: SizeProp;
  adjust?: number;
};

/**
 *  Adjusts a SizeProp value by incrementing or decrementing it by a number of steps,
 *  and clamps the value to a min and max value.
 *
 * @param size a SizeProp value
 * @param options options for adjusting the size
 * @returns a SizeProp value
 */
export const adjustSize = (size: SizeProp, options?: ClampSizeOptions) => {
  const min = sizePropValues.indexOf(options?.min ?? sizePropValues[0]);
  const max = sizePropValues.indexOf(
    options?.max ?? sizePropValues[sizePropValues.length - 1]
  );
  const sizeIndex = sizePropValues.indexOf(size) + (options?.adjust ?? 0);
  const valueIndex = clamp(sizeIndex, { min, max });

  return sizePropValues[valueIndex];
};

/**
 * Returns a width class for a given size
 *
 * @param size
 * @param options
 * @returns
 */
export const widthClass = (
  size: SizeProp = "md",
  options?: ClampSizeOptions
) => {
  const clampedSize = options ? adjustSize(size, options) : size;
  return (
    {
      none: "",
      xs: "w-6",
      sm: "w-8",
      md: "w-10",
      lg: "w-12",
      xl: "w-14",
      "2xl": "w-16",
      "3xl": "w-20",
      "4xl": "w-24",
    }[clampedSize] ?? ""
  );
};

/**
 * Returns a height class for a given size
 * @param size
 * @param options
 * @returns
 */
export const heightClass = (
  size: SizeProp = "md",
  options?: ClampSizeOptions
) => {
  const clampedSize = options ? adjustSize(size, options) : size;
  return (
    {
      none: "",
      xs: "h-6",
      sm: "h-8",
      md: "h-10",
      lg: "h-12",
      xl: "h-14",
      "2xl": "h-16",
      "3xl": "h-20",
      "4xl": "h-24",
    }[clampedSize] ?? ""
  );
};

/**
 * Returns both height and width classes for a given size
 *
 * @param size
 * @param options
 * @returns
 */
export const sizeClasses = (
  size: SizeProp = "md",
  options?: ClampSizeOptions
) => {
  return clsx(widthClass(size, options), heightClass(size, options));
};

/**
 * Returns a text size class for a given size
 *
 * @param size
 * @param options
 * @returns
 */
export const textSizeClass = (
  size: SizeProp = "md",
  options?: ClampSizeOptions
) => {
  const clampedSize = options ? adjustSize(size, options) : size;
  return (
    {
      none: "",
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    }[clampedSize] ?? ""
  );
};
