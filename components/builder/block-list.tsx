"use client";

import { Reorder, useDragControls, motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { BlockWithId } from "./types";
import { IconGripVertical } from "@tabler/icons-react";

const TYPE_LABEL: Record<string, string> = {
  hero: "Hero",
  features: "Destaques",
  pricing: "Planos",
  cta: "CTA",
};

interface BlockListProps {
  content: BlockWithId[];
  onReorder: (newOrder: BlockWithId[]) => void;
  onBlockClick: (index: number) => void;
  disabled?: boolean;
  selectedBlockId?: string | null;
}

const CARD_LAYOUT_TRANSITION = { layout: { duration: 0.3, ease: "easeInOut" as const } };

function BlockListItem({
  block,
  index,
  onSelect,
  disabled,
  isSelected,
}: {
  block: BlockWithId;
  index: number;
  onSelect: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={block}
      as="div"
      className="relative list-none"
      dragListener={false}
      dragControls={dragControls}
      style={{ position: "relative" }}
    >
      <motion.div
        layoutId={`block-card-${block.id}`}
        transition={CARD_LAYOUT_TRANSITION}
        style={{ position: "relative" }}
      >
        <Card
          className={
            disabled
              ? "cursor-not-allowed opacity-60 transition-shadow"
              : "cursor-pointer transition-shadow hover:shadow-md"
          }
          onClick={disabled ? undefined : onSelect}
          style={isSelected ? { opacity: 0, pointerEvents: "none" } : undefined}
        >
          <CardHeader className="flex flex-row items-center gap-2 py-3">
            <div
              className={
                disabled
                  ? "cursor-not-allowed rounded p-1 -ml-1 text-muted-foreground opacity-60"
                  : "touch-none cursor-grab active:cursor-grabbing rounded p-1 -ml-1 text-muted-foreground hover:text-foreground hover:bg-muted"
              }
              onPointerDown={
                disabled
                  ? undefined
                  : (e) => {
                      e.stopPropagation();
                      dragControls.start(e);
                    }
              }
              aria-label="Arrastar para reordenar"
            >
              <IconGripVertical className="size-5" />
            </div>
            <span className="font-medium text-sm">
              {TYPE_LABEL[block.type] ?? block.type}
            </span>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <p className="text-xs text-muted-foreground">
              Clique para editar o bloco
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Reorder.Item>
  );
}

export function BlockList({
  content,
  onReorder,
  onBlockClick,
  disabled = false,
  selectedBlockId = null,
}: BlockListProps) {
  if (content.length === 0) {
    return null;
  }

  return (
    <Reorder.Group
      axis="y"
      values={content}
      onReorder={disabled ? () => {} : onReorder}
      as="div"
      className="flex flex-col gap-4"
    >
      {content.map((block, index) => (
        <BlockListItem
          key={block.id}
          block={block}
          index={index}
          onSelect={() => onBlockClick(index)}
          disabled={disabled}
          isSelected={selectedBlockId === block.id}
        />
      ))}
    </Reorder.Group>
  );
}
