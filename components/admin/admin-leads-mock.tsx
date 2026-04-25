"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconCopy,
  IconEye,
  IconFileSpreadsheet,
  IconMail,
  IconMessageCircle,
  IconSearch,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type LeadSource = "contato" | "questionario";

type MockLeadBase = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  summary: string;
};

type MockLeadContato = MockLeadBase & {
  source: "contato";
  message: string;
};

type MockLeadQuestionario = MockLeadBase & {
  source: "questionario";
  areaHa: string;
  municipio: string;
  culturas: string;
  estagio: string;
  diagnosticoResumo: string;
  interesses: string[];
};

type MockLead = MockLeadContato | MockLeadQuestionario;

const MOCK_LEADS: MockLead[] = [
  {
    id: "1",
    createdAt: "2026-04-22T14:32:00.000Z",
    name: "Maria Souza",
    email: "maria.souza@exemplo.com.br",
    phone: "(65) 99912-4401",
    source: "contato",
    summary:
      "Gostaria de agendar uma visita técnica para avaliar solo e manejo de soja na safra 26/27.",
    message:
      "Olá, boa tarde.\n\nSomos produtores na região de Sorriso e gostaríamos de agendar uma visita técnica para avaliar solo e manejo de soja na safra 26/27. Temos cerca de 1.200 ha de soja e 400 ha de milho safrinha.\n\nQual seria o próximo passo?\n\nObrigada,\nMaria",
  },
  {
    id: "2",
    createdAt: "2026-04-21T09:15:00.000Z",
    name: "João Pedro Almeida",
    email: "jpalmeida.fazenda@email.com",
    phone: null,
    source: "questionario",
    summary:
      "Questionário concluído — interesse em diagnóstico de produtividade e pool de compra.",
    areaHa: "2.450 ha",
    municipio: "Sorriso — MT",
    culturas: "Soja, milho safrinha",
    estagio: "Ampliação de área e revisão de insumos",
    diagnosticoResumo:
      "Perfil de risco moderado em manejo de doenças; oportunidade alta em otimização de adubação de base e uso de tecnologia de aplicação.",
    interesses: [
      "Diagnóstico de produtividade",
      "Pool de compra de insumos",
      "Consultoria em manejo integrado",
    ],
  },
  {
    id: "3",
    createdAt: "2026-04-20T16:48:00.000Z",
    name: "Cooperativa Vale Verde",
    email: "contato@valeverde.coop.br",
    phone: "(65) 3021-8890",
    source: "contato",
    summary: "Solicitação de contato comercial para parceria em ensaios de campo.",
    message:
      "Prezados,\n\nA cooperativa gostaria de discutir parceria para ensaios de campo e divulgação de resultados junto aos associados. Podemos agendar uma call na próxima semana?\n\nAtenciosamente,\nDepartamento técnico — Vale Verde",
  },
  {
    id: "4",
    createdAt: "2026-04-19T11:05:00.000Z",
    name: "Ana Cristina Lima",
    email: "ana.lima@exemplo.com",
    phone: "(66) 98104-2233",
    source: "questionario",
    summary:
      "Resultado do questionário: estágio avançado — quer falar com consultor sobre certificação.",
    areaHa: "890 ha",
    municipio: "Lucas do Rio Verde — MT",
    culturas: "Soja",
    estagio: "Consolidação e certificação",
    diagnosticoResumo:
      "Alto alinhamento com boas práticas; foco recomendado em rastreabilidade e certificação de fazenda produtiva.",
    interesses: [
      "Certifica-K",
      "Auditoria de processos",
      "Treinamento da equipe de campo",
    ],
  },
  {
    id: "5",
    createdAt: "2026-04-18T08:22:00.000Z",
    name: "Fazenda Santa Helena LTDA",
    email: "financeiro@santahelena.ag",
    phone: null,
    source: "contato",
    summary: "Dúvidas sobre planos de consultoria e prazo de retorno.",
    message:
      "Bom dia.\n\nGostaríamos de entender os planos de consultoria disponíveis e o prazo médio de retorno após o primeiro contato.\n\nFazenda Santa Helena LTDA\nCNPJ sob consulta",
  },
];

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildExportRow(lead: MockLead): Record<string, string> {
  const origem =
    lead.source === "contato" ? "Fale conosco" : "Questionário";
  const row: Record<string, string> = {
    Data: formatDateTime(lead.createdAt),
    Nome: lead.name,
    "E-mail": lead.email,
    Telefone: lead.phone ?? "",
    Origem: origem,
    Resumo: lead.summary,
    Mensagem: lead.source === "contato" ? lead.message : "",
    "Área (ha)": "",
    Município: "",
    Culturas: "",
    Estágio: "",
    "Diagnóstico (resumo)": "",
    Interesses: "",
  };
  if (lead.source === "questionario") {
    row["Área (ha)"] = lead.areaHa;
    row.Município = lead.municipio;
    row.Culturas = lead.culturas;
    row.Estágio = lead.estagio;
    row["Diagnóstico (resumo)"] = lead.diagnosticoResumo;
    row.Interesses = lead.interesses.join("; ");
  }
  return row;
}

type SourceFilter = "all" | LeadSource;

function leadDateUTC(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function matchesLeadFilters(
  lead: MockLead,
  filters: {
    search: string;
    dateFrom: string;
    dateTo: string;
    source: SourceFilter;
  },
): boolean {
  if (filters.source !== "all" && lead.source !== filters.source) {
    return false;
  }
  const day = leadDateUTC(lead.createdAt);
  if (filters.dateFrom && day < filters.dateFrom) return false;
  if (filters.dateTo && day > filters.dateTo) return false;
  const q = filters.search.trim().toLowerCase();
  if (q) {
    const nameOk = lead.name.toLowerCase().includes(q);
    const emailOk = lead.email.toLowerCase().includes(q);
    if (!nameOk && !emailOk) return false;
  }
  return true;
}

async function exportMockLeadsToExcel(leads: MockLead[]) {
  const XLSX = await import("xlsx");
  const rows = leads.map(buildExportRow);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `leads-250k-${stamp}.xlsx`);
}

function sourceBadge(source: LeadSource) {
  if (source === "contato") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1 border-brand-orange/35 bg-brand-orange/12 font-normal text-brand-orange",
          "dark:border-brand-orange/40 dark:bg-brand-orange/15 dark:text-[hsl(11_55%_62%)]",
        )}
      >
        <IconMail className="size-3.5 shrink-0" aria-hidden />
        Fale conosco
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-brand-green/35 bg-brand-green/12 font-normal text-brand-green",
        "dark:border-brand-green/40 dark:bg-brand-green/18 dark:text-[hsl(150_25%_62%)]",
      )}
    >
      <IconMessageCircle className="size-3.5 shrink-0" aria-hidden />
      Questionário
    </Badge>
  );
}

async function copyToClipboard(text: string, kind: "email" | "phone") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(
      kind === "email" ? "E-mail copiado." : "Telefone copiado.",
    );
  } catch {
    toast.error("Não foi possível copiar.");
  }
}

function DetailRow({
  label,
  value,
  copyValue,
}: {
  label: string;
  value: string;
  copyValue?: string;
}) {
  const copyKind: "email" | "phone" =
    label === "Telefone" ? "phone" : "email";
  return (
    <div className="grid gap-1 border-b border-border/60 py-3 last:border-0 sm:grid-cols-[minmax(0,160px)_1fr] sm:gap-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <span className="min-w-0 flex-1 break-all text-sm text-foreground">
          {value}
        </span>
        {copyValue ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-primary"
            onClick={() => void copyToClipboard(copyValue, copyKind)}
            aria-label={`Copiar ${label.toLowerCase()}`}
            title={`Copiar ${label.toLowerCase()}`}
          >
            <IconCopy className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function LeadDetailContent({ lead }: { lead: MockLead }) {
  const rowsComuns: {
    label: string;
    value: string;
    copyValue?: string;
  }[] = [
    { label: "Data de registro", value: formatDateTime(lead.createdAt) },
    { label: "Nome", value: lead.name },
    { label: "E-mail", value: lead.email, copyValue: lead.email },
    ...(lead.phone
      ? [{ label: "Telefone", value: lead.phone, copyValue: lead.phone }]
      : []),
  ];

  if (lead.source === "contato") {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {sourceBadge("contato")}
        </div>
        <div>
          {rowsComuns.map((r) => (
            <DetailRow
              key={r.label}
              label={r.label}
              value={r.value}
              copyValue={r.copyValue}
            />
          ))}
          <div className="pt-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Mensagem
            </p>
            <p className="mt-2 whitespace-pre-wrap rounded-md border border-border/80 bg-muted/20 p-3 text-sm leading-relaxed text-foreground">
              {lead.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {sourceBadge("questionario")}
      </div>
      <div>
        {rowsComuns.map((r) => (
          <DetailRow
            key={r.label}
            label={r.label}
            value={r.value}
            copyValue={r.copyValue}
          />
        ))}
        <DetailRow label="Área da propriedade" value={lead.areaHa} />
        <DetailRow label="Município" value={lead.municipio} />
        <DetailRow label="Culturas" value={lead.culturas} />
        <DetailRow label="Estágio / foco informado" value={lead.estagio} />
        <div className="border-b border-border/60 py-3 last:border-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Resumo do diagnóstico (mock)
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {lead.diagnosticoResumo}
          </p>
        </div>
        <div className="pt-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Interesses indicados
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground">
            {lead.interesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          Em produção, aqui podem aparecer respostas por pergunta, payload
          bruto ou link para o resultado impresso do questionário.
        </p>
      </div>
    </div>
  );
}

export function AdminLeadsMock() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MockLead | null>(null);
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  const filteredLeads = useMemo(
    () =>
      MOCK_LEADS.filter((lead) =>
        matchesLeadFilters(lead, {
          search: searchQuery,
          dateFrom,
          dateTo,
          source: sourceFilter,
        }),
      ),
    [searchQuery, dateFrom, dateTo, sourceFilter],
  );

  function openDetail(lead: MockLead) {
    setSelected(lead);
    setOpen(true);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setSelected(null);
  }

  async function handleExportExcel() {
    setExporting(true);
    try {
      await exportMockLeadsToExcel(filteredLeads);
      toast.success("Arquivo Excel gerado e baixado.");
    } catch {
      toast.error("Não foi possível gerar o Excel.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <IconSearch
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Buscar por nome ou e-mail…"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar leads por nome ou e-mail"
            />
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1.5"
              disabled={exporting}
              onClick={() => void handleExportExcel()}
            >
              <IconFileSpreadsheet className="size-4 shrink-0" aria-hidden />
              {exporting ? "Gerando…" : "Exportar Excel"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex min-w-[140px] flex-1 flex-col gap-1.5 sm:max-w-[200px]">
            <Label htmlFor="leads-filter-date-from" className="text-xs">
              Data inicial
            </Label>
            <Input
              id="leads-filter-date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="flex min-w-[140px] flex-1 flex-col gap-1.5 sm:max-w-[200px]">
            <Label htmlFor="leads-filter-date-to" className="text-xs">
              Data final
            </Label>
            <Input
              id="leads-filter-date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="flex min-w-[180px] flex-1 flex-col gap-1.5 sm:max-w-[240px]">
            <Label htmlFor="leads-filter-source" className="text-xs">
              Origem
            </Label>
            <select
              id="leads-filter-source"
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(e.target.value as SourceFilter)
              }
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              )}
            >
              <option value="all">Todas</option>
              <option value="contato">Fale conosco</option>
              <option value="questionario">Questionário</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                <th className="whitespace-nowrap px-4 py-3 font-medium">
                  Data
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">
                  Contato
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">
                  Origem
                </th>
                <th className="min-w-[200px] px-4 py-3 font-medium">Resumo</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    Nenhum lead corresponde aos filtros.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border/80 transition-colors last:border-0 hover:bg-muted/25"
                  >
                    <td className="whitespace-nowrap px-4 py-3 align-top text-muted-foreground">
                      {formatDateTime(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-foreground">
                        {lead.name}
                      </div>
                      <div className="mt-0.5 text-muted-foreground">
                        {lead.email}
                      </div>
                      {lead.phone ? (
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {lead.phone}
                        </div>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top">
                      {sourceBadge(lead.source)}
                    </td>
                    <td className="max-w-md px-4 py-3 align-top text-muted-foreground">
                      <span className="line-clamp-2">{lead.summary}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => openDetail(lead)}
                        aria-label={`Ver detalhe: ${lead.name}`}
                        title="Ver detalhe"
                      >
                        <IconEye className="size-5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn(
            "max-h-[min(90vh,720px)] max-w-2xl overflow-y-auto sm:max-w-2xl",
          )}
        >
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>Detalhe do lead</DialogTitle>
                <DialogDescription>
                  {selected.source === "contato"
                    ? "Dados enviados pelo formulário Fale conosco."
                    : "Dados capturados ao finalizar o questionário (demonstração)."}
                </DialogDescription>
              </DialogHeader>
              <LeadDetailContent lead={selected} />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
