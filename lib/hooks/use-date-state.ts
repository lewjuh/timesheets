import { useMemo, useState } from "react";
import { DateWithType, DayType } from "../calendar/types";
import { format, isSameDay } from "date-fns";
import { isDateWithinRange } from "../utils/days";

function useDateState(initialState: DateWithType[]) {
  const [days, setDays] = useState<DateWithType[] | undefined>(initialState);
  const [dayType, setDayType] = useState<DayType>(DayType.Full);

  const daysWithRanges = useMemo(() => {
    if (!days || days.length === 0) return [];

    const sortedDays = days
      .slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    const ranges = [];
    let start = sortedDays[0];
    let end = sortedDays[0];

    for (let i = 1; i < sortedDays.length; i++) {
      const currentDay = sortedDays[i];
      const previousDay = sortedDays[i - 1];
      const diffInDays = Math.ceil(
        (currentDay.date.getTime() - previousDay.date.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (diffInDays === 1 && currentDay.type === previousDay.type) {
        end = currentDay;
      } else {
        ranges.push(
          start.date.getTime() === end.date.getTime()
            ? { start, id: start.id }
            : { start, end, id: start.id },
        );
        start = currentDay;
        end = currentDay;
      }
    }

    ranges.push(
      start.date.getTime() === end.date.getTime()
        ? { start, id: start.id }
        : { start, end, id: start.id },
    );

    return ranges;
  }, [days]);

  const handleSelectDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const dateWithType: DateWithType = {
        date: selectedDate,
        type: dayType,
        id: new Date().getUTCMilliseconds().toString(),
      };

      if (!days) {
        setDays([dateWithType]);
        return;
      }

      // Check if the date already exists in the days state
      const existingDay = days.find((day) =>
        isSameDay(day.date, dateWithType.date),
      );

      // If the date exists and its type is the same, remove it
      // If the date exists and its type is different, update it
      // If the date doesn't exist, add it
      let updatedDays;
      if (existingDay) {
        dateWithType.id = existingDay.id;
        if (existingDay.type === dateWithType.type) {
          updatedDays = days.filter(
            (day) => !isSameDay(day.date, dateWithType.date),
          );
        } else {
          updatedDays = days.map((day) =>
            isSameDay(day.date, dateWithType.date) ? dateWithType : day,
          );
        }
      } else {
        updatedDays = [...days, dateWithType];
      }

      setDays(updatedDays);
    } else {
      setDays(undefined);
    }
  };

  function isDayType(date: Date, type: DayType) {
    const day = format(date, "yyyy-MM-dd");
    const dayIsSelected = days?.find(
      (d) => format(d.date, "yyyy-MM-dd") === day && d.type === type,
    );
    return dayIsSelected !== undefined;
  }

  const isStartOfRange = (date: Date) => {
    const fancyDays = daysWithRanges;
    if (!fancyDays) return false;
    const dayIsSelected = fancyDays.find(
      (d) => d.end && isSameDay(d.start.date, date),
    );
    return dayIsSelected !== undefined;
  };

  const isEndOfRange = (date: Date) => {
    const fancyDays = daysWithRanges;
    if (!fancyDays) return false;
    const dayIsSelected = fancyDays.find(
      (d) => d.end && isSameDay(d.end.date, date),
    );
    return dayIsSelected !== undefined;
  };

  const isMiddleOfRange = (date: Date) => {
    const fancyDays = daysWithRanges;
    if (!fancyDays) return false;
    const dayIsSelected = fancyDays.find(
      (d) => d.end && isDateWithinRange(date, d.start.date, d.end.date),
    );
    return dayIsSelected !== undefined;
  };

  const isDateTypeFullDay = dayType === DayType.Full;
  const isDateTypeHalfDay = dayType === DayType.Half;

  return {
    days,
    dayType,
    daysWithRanges,
    handleSelectDate,
    setDayType,
    isMiddleOfRange,
    isEndOfRange,
    isStartOfRange,
    isDayType,
    isDateTypeFullDay,
    isDateTypeHalfDay,
  };
}

export default useDateState;
