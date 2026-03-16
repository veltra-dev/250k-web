"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { LandingPageFormValues } from "./types";
import { IconTrash, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  hero: "Hero",
  features: "Destaques",
  pricing: "Planos",
  cta: "CTA",
};

const CARD_LAYOUT_TRANSITION = {
  layout: { duration: 0.3, ease: "easeInOut" as const },
};

interface BlockEditorModalProps {
  form: UseFormReturn<LandingPageFormValues>;
  blockIndex: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function BlockEditorModal({
  form,
  blockIndex,
  open,
  onOpenChange,
  onRemove,
  disabled = false,
}: BlockEditorModalProps) {
  const block =
    blockIndex !== null ? form.watch(`content.${blockIndex}`) : null;
  const prefix =
    blockIndex !== null ? (`content.${blockIndex}.data` as const) : null;

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (blockIndex === null || !block || !prefix) {
    return null;
  }

  const modalContent = (
    <AnimatePresence mode="sync">
      {open && (
        <>
          <motion.div
            key="block-modal-overlay"
            role="presentation"
            aria-hidden
            className="fixed inset-0 z-50 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />
          <div
            key="block-modal-container"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            aria-modal
            aria-labelledby="block-editor-title"
          >
            <motion.div
              key="block-modal-panel"
              layoutId={`block-card-${block.id}`}
              transition={CARD_LAYOUT_TRANSITION}
              role="dialog"
              id="block-editor-dialog"
              className={cn(
                "pointer-events-auto w-full max-h-[90vh] overflow-y-auto",
                "rounded-lg border border-border bg-background shadow-lg",
                "grid gap-4 p-6",
                "sm:max-w-lg",
              )}
              style={{ width: "calc(100vw - 2rem)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-row items-center justify-between gap-2">
                <h2
                  id="block-editor-title"
                  className="text-lg font-semibold leading-none tracking-tight"
                >
                  {TYPE_LABEL[block.type] ?? block.type}
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  disabled={disabled}
                  className="h-8 w-8"
                  aria-label="Fechar"
                >
                  <IconX className="size-4" />
                </Button>
              </div>

              <FieldGroup className="gap-4">
                {block.type === "hero" && (
                  <>
                    <Field>
                      <FieldLabel>Título</FieldLabel>
                      <Input
                        {...form.register(`${prefix}.title`)}
                        placeholder="Título"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Subtítulo</FieldLabel>
                      <Input
                        {...form.register(`${prefix}.subtitle`)}
                        placeholder="Subtítulo"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>URL da imagem</FieldLabel>
                      <Input
                        {...form.register(`${prefix}.imageUrl`)}
                        placeholder="https://..."
                      />
                    </Field>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Texto botão principal</FieldLabel>
                        <Input
                          {...form.register(`${prefix}.primaryButtonText`)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Link botão principal</FieldLabel>
                        <Input
                          {...form.register(`${prefix}.primaryButtonLink`)}
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Texto botão secundário</FieldLabel>
                        <Input
                          {...form.register(`${prefix}.secondaryButtonText`)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Link botão secundário</FieldLabel>
                        <Input
                          {...form.register(`${prefix}.secondaryButtonLink`)}
                        />
                      </Field>
                    </div>
                  </>
                )}

                {block.type === "features" && (
                  <>
                    <Field>
                      <FieldLabel>Título da seção</FieldLabel>
                      <Input {...form.register(`${prefix}.title`)} />
                    </Field>
                    <Field>
                      <FieldLabel>Subtítulo</FieldLabel>
                      <Input {...form.register(`${prefix}.subtitle`)} />
                    </Field>
                    <p className="text-xs text-muted-foreground">
                      Edite os itens em JSON ou use os valores padrão. Em uma
                      versão futura pode haver campos por item.
                    </p>
                  </>
                )}

                {block.type === "pricing" && (
                  <>
                    <Field>
                      <FieldLabel>Título da seção</FieldLabel>
                      <Input {...form.register(`${prefix}.title`)} />
                    </Field>
                    <Field>
                      <FieldLabel>Subtítulo</FieldLabel>
                      <Input {...form.register(`${prefix}.subtitle`)} />
                    </Field>
                    <p className="text-xs text-muted-foreground">
                      Planos (nome, price, description, features) podem ser
                      editados em uma versão futura.
                    </p>
                  </>
                )}

                {block.type === "cta" && (
                  <>
                    <Field>
                      <FieldLabel>Título</FieldLabel>
                      <Input
                        {...form.register(`${prefix}.title`)}
                        placeholder="Título"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Subtítulo</FieldLabel>
                      <Input {...form.register(`${prefix}.subtitle`)} />
                    </Field>
                    <Field>
                      <FieldLabel>Texto do botão</FieldLabel>
                      <Input {...form.register(`${prefix}.buttonText`)} />
                    </Field>
                    <Field>
                      <FieldLabel>Link do botão</FieldLabel>
                      <Input {...form.register(`${prefix}.buttonLink`)} />
                    </Field>
                  </>
                )}
              </FieldGroup>

              <div className="flex flex-row justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    onRemove();
                    handleClose();
                  }}
                  disabled={disabled}
                  className="gap-2"
                >
                  <IconTrash className="size-4" />
                  Remover bloco
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={disabled}
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
