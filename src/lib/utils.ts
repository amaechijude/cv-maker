import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const FRAUD_THRESHOLDS = {
//   LOW: 25,
//   MEDIUM: 45,
//   HIGH: 65,
//   CRITICAL: 85,
// } as const;

// export function clamp(value: number, min: number, max: number): number {
//   return Math.max(min, Math.min(max, value));
// }

// export function randomId(prefix = 'tx'): string {
//   const rand = Math.random().toString(36).slice(2, 10);
//   return `${prefix}_${rand}`;
// }

// export function pick<T>(arr: readonly T[]): T {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

// export function now(): number {
//   return Date.now();
// }
