export type ClassValue = string | number | undefined | null | false;

const isValidClass = (value: ClassValue): value is string | number =>
  value !== null && value !== undefined && value !== false && value !== "";

export const cx = (...classes: ClassValue[]) =>
  classes.filter(isValidClass).join(" ");
