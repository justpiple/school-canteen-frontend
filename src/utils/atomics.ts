import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeEmptyObjects = <T extends Record<string, any>>(
  object: T,
): Partial<T> => {
  if (typeof object !== "object" || object === null) {
    return {};
  }

  const newObject = { ...object } as Partial<T>;
  Object.keys(newObject).forEach((key) => {
    if (
      newObject[key] === null ||
      newObject[key] === undefined ||
      newObject[key] === ""
    ) {
      delete newObject[key];
    }
  });

  return newObject;
};

export const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number | undefined,
) => {
  return discountPercentage
    ? price - (price * discountPercentage) / 100
    : price;
};
