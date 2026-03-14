"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Block } from "@/lib/landing-pages/types";
import { IconTrash, IconChevronUp, IconChevronDown } from "@tabler/icons-react";

interface BlockEditorProps {
  block: Block;
  index: number;
  form: UseFormReturn<{ slug: string; content: Block[] }>;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockEditor({
  block,
  index,
  form,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: BlockEditorProps) {
  const prefix = `content.${index}.data` as const;

  const typeLabel: Record<string, string> = {
    hero: "Hero",
    features: "Destaques",
    pricing: "Planos",
    cta: "CTA",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 py-3">
        <span className="font-medium text-sm">{typeLabel[block.type] ?? block.type}</span>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={onMoveUp} disabled={!canMoveUp} className="h-8 w-8">
            <IconChevronUp className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onMoveDown} disabled={!canMoveDown} className="h-8 w-8">
            <IconChevronDown className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-destructive">
            <IconTrash className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {block.type === "hero" && (
          <>
            <div className="grid gap-2">
              <Label>Título</Label>
              <Input
                {...form.register(`${prefix}.title`)}
                placeholder="Título"
              />
            </div>
            <div className="grid gap-2">
              <Label>Subtítulo</Label>
              <Input
                {...form.register(`${prefix}.subtitle`)}
                placeholder="Subtítulo"
              />
            </div>
            <div className="grid gap-2">
              <Label>URL da imagem</Label>
              <Input
                {...form.register(`${prefix}.imageUrl`)}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Texto botão principal</Label>
                <Input {...form.register(`${prefix}.primaryButtonText`)} />
              </div>
              <div>
                <Label>Link botão principal</Label>
                <Input {...form.register(`${prefix}.primaryButtonLink`)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Texto botão secundário</Label>
                <Input {...form.register(`${prefix}.secondaryButtonText`)} />
              </div>
              <div>
                <Label>Link botão secundário</Label>
                <Input {...form.register(`${prefix}.secondaryButtonLink`)} />
              </div>
            </div>
          </>
        )}

        {block.type === "features" && (
          <>
            <div className="grid gap-2">
              <Label>Título da seção</Label>
              <Input {...form.register(`${prefix}.title`)} />
            </div>
            <div className="grid gap-2">
              <Label>Subtítulo</Label>
              <Input {...form.register(`${prefix}.subtitle`)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Edite os itens em JSON ou use os valores padrão. Em uma versão futura pode haver campos por item.
            </p>
          </>
        )}

        {block.type === "pricing" && (
          <>
            <div className="grid gap-2">
              <Label>Título da seção</Label>
              <Input {...form.register(`${prefix}.title`)} />
            </div>
            <div className="grid gap-2">
              <Label>Subtítulo</Label>
              <Input {...form.register(`${prefix}.subtitle`)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Planos (nome, price, description, features) podem ser editados em uma versão futura.
            </p>
          </>
        )}

        {block.type === "cta" && (
          <>
            <div className="grid gap-2">
              <Label>Título</Label>
              <Input {...form.register(`${prefix}.title`)} placeholder="Título" />
            </div>
            <div className="grid gap-2">
              <Label>Subtítulo</Label>
              <Input {...form.register(`${prefix}.subtitle`)} />
            </div>
            <div className="grid gap-2">
              <Label>Texto do botão</Label>
              <Input {...form.register(`${prefix}.buttonText`)} />
            </div>
            <div className="grid gap-2">
              <Label>Link do botão</Label>
              <Input {...form.register(`${prefix}.buttonLink`)} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
