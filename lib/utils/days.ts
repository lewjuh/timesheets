import { format, isAfter, isBefore } from "date-fns";
import { DateWithType } from "../calendar/types";

export function datesWithTypeAsDates(
  dates: DateWithType[] | undefined,
): Date[] {
  if (!dates) return [];
  return dates.map((d) => d.date);
}

export const isDateWithinRange = (
  date: Date,
  startDate: Date,
  endDate: Date,
): boolean => isAfter(date, startDate) && isBefore(date, endDate);
