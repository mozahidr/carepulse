import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pareseStringify = (value: any) => JSON.parse(JSON.stringify(value));
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);