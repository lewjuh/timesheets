import { useMemo, useState } from "react";
import { DateRange, DateWithType, DayType } from "../calendar/types";
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
    const ranges: DateRange[] = [];
    let start = sortedDays[0];
    let end = sortedDays[0];
    let allDates: DateWithType[] = [start];

    for (let i = 1; i < sortedDays.length; i++) {
      const currentDay = sortedDays[i];
      const previousDay = sortedDays[i - 1];
      const diffInDays = Math.ceil(
        (currentDay.date.getTime() - previousDay.date.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (diffInDays === 1 && currentDay.type === previousDay.type) {
        allDates.push(currentDay);
        end = currentDay;
      } else {
        ranges.push(
          start.date.getTime() === end.date.getTime()
            ? { start, id: start.id }
            : { start, end, id: start.id, allValues: allDates },
        );
        start = currentDay;
        end = currentDay;
        allDates = [currentDay];
      }
    }

    ranges.push(
      start.date.getTime() === end.date.getTime()
        ? { start, id: start.id }
        : { start, end, id: start.id, allValues: allDates },
    );

    return ranges;
  }, [days]);

  const updateDaysWithDate = (
    updatedDays: DateWithType[],
    dateWithType: DateWithType,
    removeIfExists: boolean,
  ) => {
    // Check if the date already exists in the updatedDays
    const existingDay = updatedDays.find((day) =>
      isSameDay(day.date, dateWithType.date),
    );

    // If the date exists and its type is the same, remove it if removeIfExists is true, otherwise update it
    // If the date exists and its type is different, update it
    // If the date doesn't exist, add it
    if (existingDay) {
      dateWithType.id = existingDay.id;
      if (existingDay.type === dateWithType.type) {
        if (removeIfExists) {
          return updatedDays.filter(
            (day) => !isSameDay(day.date, dateWithType.date),
          );
        } else {
          return updatedDays;
        }
      } else {
        return updatedDays.map((day) =>
          isSameDay(day.date, dateWithType.date) ? dateWithType : day,
        );
      }
    } else {
      return [...updatedDays, dateWithType];
    }
  };

  const handleSelectDate = (selectedDate: Date | undefined) => {
    console.log("handleSelectDate", selectedDate);
    if (selectedDate) {
      const dateWithType: DateWithType = {
        date: selectedDate,
        type: dayType,
        id: new Date().getUTCMilliseconds().toString(),
      };

      let updatedDays = days ? [...days] : [];
      updatedDays = updateDaysWithDate(updatedDays, dateWithType, true);
      setDays(updatedDays);
    } else {
      setDays(undefined);
    }
  };

  const handleSelectDates = (selectedDates: Date[]) => {
    console.log("handleSelectDates", selectedDates);
    if (selectedDates.length === 0) {
      setDays(undefined);
      return;
    }

    let updatedDays = days ? [...days] : [];

    selectedDates.forEach((selectedDate) => {
      const dateWithType: DateWithType = {
        date: selectedDate,
        type: dayType,
        id: new Date().getUTCMilliseconds().toString(),
      };

      updatedDays = updateDaysWithDate(updatedDays, dateWithType, false);
    });

    setDays(updatedDays);
  };

  const removeDates = (dates: Date[]) => {
    if (!days) return;
    const updatedDays = days.filter(
      (day) => !dates.find((date) => isSameDay(date, day.date)),
    );
    setDays(updatedDays);
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

  const isDateSelected = (date: Date) => {
    if (!days) return false;
    return days.find((d) => isSameDay(d.date, date)) !== undefined;
  };

  const removeDate = (range: DateRange) => {
    if (!days) return;
    if (range.allValues) {
      const updatedDays = days.filter(
        (day) => !range.allValues?.find((d) => isSameDay(d.date, day.date)),
      );
      setDays(updatedDays);
      return;
    } else {
      const updatedDays = days.filter(
        (day) =>
          !isSameDay(day.date, range.start.date) &&
          (!range.end || !isSameDay(day.date, range.end.date)),
      );
      setDays(updatedDays);
      return;
    }
  };

  return {
    days,
    dayType,
    daysWithRanges,
    handleSelectDate,
    handleSelectDates,
    removeDate,
    removeDates,
    setDayType,
    isMiddleOfRange,
    isEndOfRange,
    isStartOfRange,
    isDayType,
    isDateTypeFullDay,
    isDateTypeHalfDay,
    isDateSelected,
  };
}

export default useDateState;
