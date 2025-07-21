import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Position } from "@/types/filters"
import { config } from 'dotenv';

config({ path: '.env' });

/**
 * Combines multiple class values into a single className string.
 * Uses clsx for conditional classes and tailwind-merge to handle
 * Tailwind CSS class conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatters = {
  // Format percentages with % symbol
  percentage: (value: number): string => `${value}%`,

  // integer
  integer: (value: number): string => value.toFixed(0),

  // Format number with 1 decimal place (default)
  decimal: (value: number): string => value ? value.toFixed(1) : "0.0",

  // Format number with 2 decimal places
  twoDecimals: (value: number): string => value ? value.toFixed(2) : "0.00",

  // Default formatter (pass through)
  default: (value: string | number | null): any => value,
}

export const checkMinQualifiers = (position: Position, season?: number, minQualifier?: Record<string, number>) => {

  if (!minQualifier || !season) {
    return minQualifier;
  }

  const positionsToCheck = ['WR', 'TE']

  if (!positionsToCheck.includes(position)) {
    return minQualifier;
  }

  if (season >= 2003 && season <= 2008) {
    return {
      targets: position === 'WR' ? 50 : 25
    }
  }

  return minQualifier;
}

export const formatQualifer = (qualifier: Record<string, number> | undefined) => {
  if (!qualifier) {
    return null;
  }

  const [[field, value]] = Object.entries(qualifier || {});
  const formattedField = field.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
  const formattedString = `Min Qualifications ${value} ${formattedField}`;
  return formattedString;
}

export const formatQualiferForMetrics = (qualifier: Record<string, number> | undefined) => {
  if (!qualifier) {
    return null;
  }

  const [[field, value]] = Object.entries(qualifier);

  return {
    minQualifierField: field,
    minQualifierValue: value
  }
}

export const getCacheDuration = () => {
  return parseInt(process.env.CACHE_DURATION || '86400');
}
