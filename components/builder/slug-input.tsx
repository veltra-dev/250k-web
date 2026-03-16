"use client";

import { Input } from "@/components/ui/input";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

interface SlugInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function SlugInput<T extends FieldValues>({
  control,
  name,
  id,
  placeholder = "minha-landing",
  disabled,
}: SlugInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id ?? "slug"}>Slug (URL)</FieldLabel>
          <Input
            {...field}
            id={id ?? "slug"}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            autoComplete="off"
            onChange={(e) => {
              const raw = e.target.value;
              const normalized = raw.toLowerCase().replace(/\s+/g, "-");
              field.onChange(normalized);
            }}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
                const raw = field.value + "-";
                const normalized = raw.toLowerCase().replace(/\s+/g, "-");
                field.onChange(normalized);
              }
            }}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}
