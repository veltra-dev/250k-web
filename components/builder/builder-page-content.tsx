"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { landingPageFormSchema } from "./schema";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockRenderer } from "@/components/landing-blocks/renderer";
import { toast } from "sonner";
import {
  getLandingPageBySlug,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
} from "@/actions/landing-pages";
import type { Block } from "@/lib/landing-pages/types";
import { DEFAULT_BLOCK_DATA } from "@/lib/landing-pages/types";
import { toDatetimeLocal, toISOOrNull } from "./date-time-range-picker";
import type { BlockWithId, LandingPageFormValues } from "./types";
import { LandingPageForm } from "./landing-page-form";
import { BlockList } from "./block-list";
import { BlockEditorModal } from "./block-editor-modal";
import { BuilderFixedFooter } from "./builder-fixed-footer";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { IconEye } from "@tabler/icons-react";

const BLOCK_TYPES: { type: Block["type"]; label: string }[] = [
  { type: "hero", label: "Hero" },
  { type: "features", label: "Destaques" },
  { type: "pricing", label: "Planos" },
  { type: "cta", label: "CTA" },
];

function ensureBlockIds(content: Block[]): BlockWithId[] {
  return content.map((block, i) => {
    const withId = block as Block & { id?: string };
    return {
      ...block,
      id: withId.id ?? `block-${i}-${Date.now()}`,
    };
  });
}

function stripBlockIds(content: BlockWithId[]): Block[] {
  return content.map(({ id: _id, ...block }) => block as Block);
}

type EditorColumnProps = {
  form: ReturnType<typeof useForm<LandingPageFormValues>>;
  loading: boolean;
  watchedContent: BlockWithId[];
  onAddBlock: (type: Block["type"]) => void;
  onReorder: (newOrder: BlockWithId[]) => void;
  onBlockClick: (index: number | null) => void;
  selectedBlockIndex: number | null;
  className?: string;
};

function EditorColumn({
  form,
  loading,
  watchedContent,
  onAddBlock,
  onReorder,
  onBlockClick,
  selectedBlockIndex,
  className,
}: EditorColumnProps) {
  return (
    <div className={className}>
      <Tabs defaultValue="form" className="flex flex-col min-h-0 flex-1">
        <TabsList className="w-full grid grid-cols-2 shrink-0">
          <TabsTrigger value="form">Página</TabsTrigger>
          <TabsTrigger value="blocks">Blocos</TabsTrigger>
        </TabsList>
        <TabsContent
          value="form"
          className="mt-4 flex-1 min-h-0 overflow-y-auto focus-visible:ring-0"
        >
          <LandingPageForm form={form} />
        </TabsContent>
        <TabsContent
          value="blocks"
          className="mt-4 flex-1 min-h-0 overflow-y-auto data-[state=inactive]:hidden focus-visible:ring-0"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium">Adicionar bloco:</span>
              {BLOCK_TYPES.map(({ type, label }) => (
                <Button
                  key={type}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddBlock(type)}
                  disabled={loading}
                >
                  {label}
                </Button>
              ))}
            </div>
            <BlockList
              content={watchedContent}
              onReorder={onReorder}
              onBlockClick={onBlockClick}
              disabled={loading}
              selectedBlockId={
                selectedBlockIndex !== null
                  ? (watchedContent[selectedBlockIndex]?.id ?? null)
                  : null
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function BuilderPageContent() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const form = useForm<LandingPageFormValues>({
    resolver: zodResolver(
      landingPageFormSchema,
    ) as Resolver<LandingPageFormValues>,
    defaultValues: {
      slug: "",
      title: "",
      description: "",
      content: [],
      starts_at: "",
      ends_at: "",
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "content",
  });

  const watchedContent = useWatch({
    control: form.control,
    name: "content",
    defaultValue: [],
  }) as BlockWithId[];

  useEffect(() => {
    if (!slugParam) return;
    setPageLoading(true);
    getLandingPageBySlug(slugParam).then((result) => {
      if (!("error" in result)) {
        form.reset({
          slug: result.slug,
          title: result.title,
          description: result.description,
          content: ensureBlockIds(result.content),
          starts_at: result.starts_at ? toDatetimeLocal(result.starts_at) : "",
          ends_at: result.ends_at ? toDatetimeLocal(result.ends_at) : "",
        });
        setCurrentId(result.id);
      }
      setPageLoading(false);
    });
  }, [slugParam, form]);

  const loading = pageLoading || saving || deleting;

  async function handleSave() {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Corrija os erros no formulário.");
      return;
    }
    setSaving(true);
    try {
      const values = form.getValues();
      const slug = values.slug.trim().toLowerCase();
      const startsAt = values.starts_at ? toISOOrNull(values.starts_at) : null;
      const endsAt = values.ends_at ? toISOOrNull(values.ends_at) : null;
      const contentForApi = stripBlockIds(values.content);

      if (currentId) {
        const res = await updateLandingPage(
          currentId,
          slug,
          values.title,
          values.description,
          contentForApi,
          startsAt,
          endsAt,
        );
        if (res.success) {
          toast.success("Página atualizada.");
        } else {
          toast.error(res.message ?? "Erro ao atualizar.");
        }
      } else {
        const res = await createLandingPage(
          slug,
          values.title,
          values.description,
          contentForApi,
          startsAt,
          endsAt,
        );
        if (res.success) {
          if (res.id) setCurrentId(res.id);
          toast.success("Página criada.");
        } else {
          toast.error(res.message ?? "Erro ao criar página.");
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!currentId) return;
    if (!confirm("Excluir esta página?")) return;
    setDeleting(true);
    try {
      const res = await deleteLandingPage(currentId);
      if (res.success) {
        setCurrentId(null);
        setSelectedBlockIndex(null);
        form.reset({
          slug: "",
          title: "",
          description: "",
          content: [],
          starts_at: "",
          ends_at: "",
        });
        toast.success("Página excluída.");
      } else {
        toast.error(res.message ?? "Erro ao excluir.");
      }
    } finally {
      setDeleting(false);
    }
  }

  function handleAddBlock(type: Block["type"]) {
    append({
      type,
      id: crypto.randomUUID(),
      data: { ...DEFAULT_BLOCK_DATA[type] } as Block["data"],
    } as BlockWithId);
  }

  function handleReorder(newOrder: BlockWithId[]) {
    form.setValue("content", newOrder);
    if (selectedBlockIndex !== null) {
      const prevId = watchedContent[selectedBlockIndex]?.id;
      const newIndex = newOrder.findIndex((b) => b.id === prevId);
      setSelectedBlockIndex(newIndex >= 0 ? newIndex : null);
    }
  }

  function handleRemoveBlock() {
    if (selectedBlockIndex === null) return;
    remove(selectedBlockIndex);
    setSelectedBlockIndex(null);
  }

  const currentTitle = form.watch("title");
  const currentSlug = form.watch("slug");

  const footerProps = {
    slug: currentSlug,
    currentId,
    onSave: handleSave,
    onDelete: handleDelete,
    saving,
    deleting,
    loading,
  };

  function renderBreadcrumb() {
    return (
      <Breadcrumb className="mb-4 shrink-0">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/landing-pages">Landing pages</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {currentTitle ? currentTitle : "Builder"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden px-6 py-6 sm:px-12">
        <div className="flex flex-1 min-h-0 overflow-hidden flex-col">
          {/* Mobile: breadcrumb + editor + footer at bottom */}
          <div className="flex flex-col min-h-0 flex-1 lg:hidden">
            {renderBreadcrumb()}
            <EditorColumn
              form={form}
              loading={loading}
              watchedContent={watchedContent}
              onAddBlock={handleAddBlock}
              onReorder={handleReorder}
              onBlockClick={setSelectedBlockIndex}
              selectedBlockIndex={selectedBlockIndex}
              className="flex flex-col min-h-0 flex-1 min-w-0"
            />
            <BuilderFixedFooter
              {...footerProps}
              className="-mx-6 sm:-mx-12 px-6 sm:px-12"
            />
          </div>

          {/* Desktop only: resizable form | preview (wrapper hides on mobile; library sets display:flex inline) */}
          <div className="hidden lg:flex flex-1 min-h-0 w-full min-w-0 h-full">
            <ResizablePanelGroup
              direction="horizontal"
              defaultLayout={{ "builder-editor": 1, "builder-preview": 3 }}
              className="flex-1 min-h-0 w-full min-w-0 h-full"
            >
              <ResizablePanel
                id="builder-editor"
                defaultSize="25"
                minSize="20"
                maxSize="50"
                className="flex flex-col min-h-0 pr-12 border-r border-border"
              >
                {renderBreadcrumb()}
                <EditorColumn
                  form={form}
                  loading={loading}
                  watchedContent={watchedContent}
                  onAddBlock={handleAddBlock}
                  onReorder={handleReorder}
                  onBlockClick={setSelectedBlockIndex}
                  selectedBlockIndex={selectedBlockIndex}
                  className="flex flex-col min-h-0 flex-1 min-w-0"
                />
                <BuilderFixedFooter {...footerProps} className="-mr-12 pr-12" />
              </ResizablePanel>
              <ResizableHandle withHandle aria-label="Redimensionar painéis" />
              <ResizablePanel
                id="builder-preview"
                defaultSize="75"
                minSize="50"
                className="flex flex-col min-h-0 pl-12 min-w-0"
              >
                <div className="w-full flex items-center justify-center gap-1 text-muted-foreground bg-border rounded-t-xl py-2">
                  <IconEye className="size-4 shrink-0" />
                  <p className="text-xs font-semibold shrink-0">
                    Pré-visualização da versão publicada do site
                  </p>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto rounded-b-xl border-x-2 border-b-2 border-border bg-background">
                  <BlockRenderer
                    content={stripBlockIds(
                      Array.isArray(watchedContent) ? watchedContent : [],
                    )}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>

      <BlockEditorModal
        form={form}
        blockIndex={selectedBlockIndex}
        open={selectedBlockIndex !== null}
        onOpenChange={(open) => !open && setSelectedBlockIndex(null)}
        onRemove={handleRemoveBlock}
        disabled={loading}
      />
    </>
  );
}
