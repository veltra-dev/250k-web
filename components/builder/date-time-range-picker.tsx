"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR as dateFnsPtBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { ptBR as dayPickerPtBR } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconCalendar } from "@tabler/icons-react";

/** Format ISO string for datetime-local input (local time). */
export function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Convert datetime-local value to ISO string (UTC). */
export function toISOOrNull(localStr: string): string | null {
  if (!localStr.trim()) return null;
  const d = new Date(localStr);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function dateToDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function dateToTimeStr(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function timeStrWithDate(date: Date, timeStr: string): Date {
  const [h = 0, m = 0] = timeStr.split(":").map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
}

function useCompactCalendarMonths(breakpointPx = 720) {
  const [months, setMonths] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const sync = () => setMonths(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [breakpointPx]);
  return months;
}

export interface DateTimeRangePickerProps {
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  placeholder?: string;
  id: string;
}

export function DateTimeRangePicker({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  placeholder = "Selecionar intervalo de data e hora",
  id,
}: DateTimeRangePickerProps) {
  const [open, setOpen] = useState(false);
  const numberOfMonths = useCompactCalendarMonths(720);

  const fromDate = startValue ? new Date(startValue) : undefined;
  const toDate = endValue ? new Date(endValue) : undefined;
  const startTimeStr = fromDate ? dateToTimeStr(fromDate) : "00:00";
  const endTimeStr = toDate ? dateToTimeStr(toDate) : "23:59";

  const range: DateRange | undefined =
    fromDate !== undefined
      ? { from: fromDate, to: toDate ?? fromDate }
      : undefined;

  const handleRangeSelect = (r: DateRange | undefined) => {
    const from = r?.from;
    if (!from) {
      onStartChange("");
      onEndChange("");
      return;
    }
    const to = r.to ?? from;
    onStartChange(dateToDatetimeLocal(timeStrWithDate(from, startTimeStr)));
    onEndChange(dateToDatetimeLocal(timeStrWithDate(to, endTimeStr)));
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const base = fromDate ?? new Date();
    onStartChange(dateToDatetimeLocal(timeStrWithDate(base, e.target.value)));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const base = toDate ?? fromDate ?? new Date();
    onEndChange(dateToDatetimeLocal(timeStrWithDate(base, e.target.value)));
  };

  const hasValue = !!startValue || !!endValue;
  const label = hasValue
    ? startValue && endValue
      ? `${format(new Date(startValue), "dd/MM/yyyy HH:mm", { locale: dateFnsPtBR })} – ${format(new Date(endValue), "dd/MM/yyyy HH:mm", { locale: dateFnsPtBR })}`
      : startValue
        ? `A partir de ${format(new Date(startValue), "dd/MM/yyyy HH:mm", { locale: dateFnsPtBR })}`
        : `Até ${format(new Date(endValue), "dd/MM/yyyy HH:mm", { locale: dateFnsPtBR })}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          data-empty={!hasValue}
        >
          <IconCalendar className="mr-2 size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="flex max-h-[min(90dvh,720px)] w-[calc(100vw-1.25rem)] max-w-[min(100vw-1.25rem,720px)] flex-col overflow-hidden p-0 sm:w-auto sm:min-w-[min(100vw-2rem,680px)]"
      >
        <div className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto overscroll-contain">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            defaultMonth={fromDate ?? toDate}
            numberOfMonths={numberOfMonths}
            locale={dayPickerPtBR}
            className="w-max min-w-full bg-transparent"
          />
        </div>
        <div className="relative z-20 grid shrink-0 grid-cols-2 gap-3 border-t bg-popover p-3 shadow-[0_-6px_16px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_-6px_16px_-4px_rgba(0,0,0,0.35)]">
          <div className="space-y-1">
            <Label
              htmlFor={`${id}-start-time`}
              className="text-xs text-muted-foreground"
            >
              Hora início
            </Label>
            <Input
              id={`${id}-start-time`}
              type="time"
              value={startTimeStr}
              onChange={handleStartTimeChange}
              className="[&::-webkit-calendar-picker-indicator]:hidden"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor={`${id}-end-time`}
              className="text-xs text-muted-foreground"
            >
              Hora fim
            </Label>
            <Input
              id={`${id}-end-time`}
              type="time"
              value={endTimeStr}
              onChange={handleEndTimeChange}
              className="[&::-webkit-calendar-picker-indicator]:hidden"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
