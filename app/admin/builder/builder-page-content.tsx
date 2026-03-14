"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlockRenderer } from "@/components/landing-blocks/renderer";
import { BlockEditor } from "./block-editor";
import type { Block } from "@/lib/landing-pages/types";
import { DEFAULT_BLOCK_DATA } from "@/lib/landing-pages/types";
import {
  getLandingPageBySlug,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
} from "@/actions/landing-pages";

type FormValues = { slug: string; content: Block[] };

const BLOCK_TYPES: { type: Block["type"]; label: string }[] = [
  { type: "hero", label: "Hero" },
  { type: "features", label: "Destaques" },
  { type: "pricing", label: "Planos" },
  { type: "cta", label: "CTA" },
];

export function BuilderPageContent() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: { slug: "", content: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "content",
  });

  const watchedContent = useWatch({ control: form.control, name: "content", defaultValue: [] });

  useEffect(() => {
    if (!slugParam) return;
    getLandingPageBySlug(slugParam).then((result) => {
      if (!("error" in result)) {
        form.reset({ slug: result.slug, content: result.content });
        setCurrentId(result.id);
      }
    });
  }, [slugParam, form]);

  async function handleSave() {
    setSaveResult(null);
    const values = form.getValues();
    const slug = values.slug.trim().toLowerCase();
    if (!slug) {
      setSaveResult("Informe o slug.");
      return;
    }

    if (currentId) {
      const res = await updateLandingPage(currentId, slug, values.content);
      setSaveResult(res.message ?? null);
    } else {
      const res = await createLandingPage(slug, values.content);
      setSaveResult(res.message ?? null);
      if (res.success && res.id) {
        setCurrentId(res.id);
      }
    }
  }

  async function handleDelete() {
    if (!currentId) return;
    if (!confirm("Excluir esta página?")) return;
    const res = await deleteLandingPage(currentId);
    setSaveResult(res.message ?? null);
    if (res.success) {
      setCurrentId(null);
      form.reset({ slug: "", content: [] });
    }
  }

  function handleAddBlock(type: Block["type"]) {
    append({
      type,
      data: { ...DEFAULT_BLOCK_DATA[type] } as Block["data"],
    } as Block);
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor column */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Builder de landing pages</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Crie ou edite páginas. A URL será: <strong>/{form.watch("slug") || "slug"}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              placeholder="minha-landing"
              {...form.register("slug", { required: true })}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Adicionar bloco:</span>
            {BLOCK_TYPES.map(({ type, label }) => (
              <Button
                key={type}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddBlock(type)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <BlockEditor
                key={field.id}
                block={form.watch(`content.${index}`)}
                index={index}
                form={form}
                onRemove={() => remove(index)}
                onMoveUp={() => move(index, index - 1)}
                onMoveDown={() => move(index, index + 1)}
                canMoveUp={index > 0}
                canMoveDown={index < fields.length - 1}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave}>Salvar</Button>
            {currentId && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Excluir página
              </Button>
            )}
            {form.watch("slug") && (
              <Button asChild variant="outline">
                <Link href={`/${form.watch("slug")}`} target="_blank" rel="noopener noreferrer">
                  Ver página
                </Link>
              </Button>
            )}
          </div>

          {saveResult && (
            <p className={`text-sm ${saveResult.startsWith("Já") || saveResult.includes("inválido") || saveResult.includes("reservado") ? "text-destructive" : "text-muted-foreground"}`}>
              {saveResult}
            </p>
          )}

          <div className="border-t border-border pt-4">
            <Link
              href="/admin"
              className="text-sm text-primary hover:underline"
            >
              ← Voltar à lista de landing pages
            </Link>
          </div>
        </div>

        {/* Preview column */}
        <div className="lg:sticky lg:top-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Prévia</p>
          <div className="rounded-lg border border-border bg-background overflow-hidden min-h-[400px]">
            <BlockRenderer content={Array.isArray(watchedContent) ? watchedContent : []} />
          </div>
        </div>
      </div>
    </div>
  );
}
