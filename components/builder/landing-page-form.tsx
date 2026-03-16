"use client";

import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SlugInput } from "./slug-input";
import { DateTimeRangePicker } from "./date-time-range-picker";
import type { LandingPageFormValues } from "./types";

interface LandingPageFormProps {
  form: UseFormReturn<LandingPageFormValues>;
}

export function LandingPageForm({ form }: LandingPageFormProps) {
  return (
    <FieldGroup>
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="landing-title">Título</FieldLabel>
            <Input
              {...field}
              id="landing-title"
              placeholder="Título da página"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="landing-description">Descrição</FieldLabel>
            <Input
              {...field}
              id="landing-description"
              placeholder="Descrição (SEO e lista)"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <SlugInput<LandingPageFormValues>
        control={form.control}
        name="slug"
        id="landing-slug"
      />

      <Field>
        <FieldLabel htmlFor="date_range">Período ativo (data e hora)</FieldLabel>
        <DateTimeRangePicker
          id="date_range"
          startValue={form.watch("starts_at")}
          endValue={form.watch("ends_at")}
          onStartChange={(v) => form.setValue("starts_at", v)}
          onEndChange={(v) => form.setValue("ends_at", v)}
        />
      </Field>
    </FieldGroup>
  );
}
