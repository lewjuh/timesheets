export enum DayType {
  Full = "Full",
  Half = "Half",
}

export type DateWithType = {
  type: DayType;
  date: Date;
  id: string;
};

export type DateRange = {
  start: DateWithType;
  end?: DateWithType;
  id: string;
};

export const IsFullDay = (dateWithType: DateWithType): boolean =>
  dateWithType.type === DayType.Full;
export const IsHalfDay = (dateWithType: DateWithType): boolean =>
  dateWithType.type === DayType.Half;
