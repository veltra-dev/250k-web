"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ArrowRight, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import type {
  Culture,
  QuestionarioAnswers,
  QuestionarioLeadPartialPayload,
  QuestionarioReport,
} from "./questionario-types";
import {
  QUESTIONARIO_LEAD_PARTIAL_KEY,
  QUESTIONARIO_SESSION_KEY,
  ajustarManejoOptions,
  amostragemOptions,
  cultureOptions,
  decisionMakerOptions,
  gargaloOptions,
  historicoOrganizadoOptions,
  impactoOptions,
  taxaVariavelOptions,
  tentouResolverOptions,
  urgenciaOptions,
} from "./questionario-types";
import { generateGenericReport } from "./report-generator";

function normalizeWhatsapp(value: string): string {
  return value.replace(/\D/g, "");
}

/** Display mask: mobile `(DD) 9 XXXX-XXXX`, landline `(DD) XXXX-XXXX`. Form state stays digits-only. */
function formatBrazilianPhoneInput(rawDigits: string): string {
  const d = normalizeWhatsapp(rawDigits).slice(0, 15);
  if (d.length === 0) return "";

  const cap = d.slice(0, 11);
  const overflow = d.slice(11);

  let core: string;
  if (cap.length <= 2) {
    core = `(${cap}`;
  } else {
    const ddd = cap.slice(0, 2);
    const rest = cap.slice(2);
    if (rest.length === 0) {
      core = `(${ddd})`;
    } else if (rest[0] === "9") {
      if (rest.length === 1) core = `(${ddd}) ${rest}`;
      else if (rest.length <= 5) core = `(${ddd}) ${rest[0]} ${rest.slice(1)}`;
      else core = `(${ddd}) ${rest[0]} ${rest.slice(1, 5)}-${rest.slice(5)}`;
    } else {
      if (rest.length <= 4) core = `(${ddd}) ${rest}`;
      else core = `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    }
  }

  return overflow ? `${core} ${overflow}` : core;
}

function toIdPart(value: string): string {
  const withoutAccents = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return withoutAccents
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");
}

function optionId(prefix: string, value: string): string {
  return `${prefix}_${toIdPart(value)}`;
}

const questionarioSchema = z
  .object({
    farmName: z.string().min(2, "Informe o nome da fazenda."),
    municipality: z.string().min(2, "Informe o município."),
    totalAreaHa: z
      .number({ error: "Informe a área total." })
      .positive("Informe uma área maior que zero."),
    cultures: z
      .array(z.enum(cultureOptions))
      .min(1, "Selecione pelo menos uma cultura."),
    decisionMaker: z
      .enum(decisionMakerOptions)
      .optional()
      .refine((v) => v !== undefined, {
        message: "Selecione quem é o tomador de decisão.",
      }),
    otherDecisionMaker: z
      .string()
      .optional()
      .transform((s) => (s ? s.trim() : undefined)),
    mainBottleneck: z
      .enum(gargaloOptions)
      .optional()
      .refine((v) => v !== undefined, {
        message: "Selecione o principal gargalo da fazenda.",
      }),
    mainBottleneckImpact: z
      .enum(impactoOptions)
      .optional()
      .refine((v) => v !== undefined, {
        message: "Selecione o que esse problema impacta mais.",
      }),
    triedBefore: z
      .enum(tentouResolverOptions)
      .optional()
      .refine((v) => v !== undefined, {
        message: "Selecione uma opção.",
      }),

    georeferencedSampling: z
      .enum(amostragemOptions)
      .optional()
      .refine((v) => v !== undefined, {
        message: "Informe se faz amostragem georreferenciada.",
      }),
    variableRate: z
      .enum(taxaVariavelOptions)
      .optional()
      .refine((v) => v !== undefined, {
        message: "Informe se usa taxa variável.",
      }),
    organizedHistory: z
      .enum(historicoOrganizadoOptions)
      .optional()
      .refine((v) => v !== undefined, {
        message: "Selecione uma opção sobre histórico organizado.",
      }),
    willingAdjustManagement: z
      .enum(ajustarManejoOptions)
      .optional()
      .refine((v) => v !== undefined, {
        message: "Selecione se está disposto a ajustar o manejo.",
      }),
    urgencyToResolve: z
      .enum(urgenciaOptions)
      .optional()
      .refine((v) => v !== undefined, {
        message: "Selecione a urgência em resolver.",
      }),

    clientName: z.string().min(2, "Informe seu nome."),
    whatsapp: z
      .string()
      .min(8, "Informe um WhatsApp válido.")
      .transform((v) => normalizeWhatsapp(v))
      .refine((v) => v.length >= 10 && v.length <= 15, "WhatsApp inválido."),
    email: z.string().email("Informe um e-mail válido."),
  })
  .superRefine((values, ctx) => {
    if (values.decisionMaker === "Outros") {
      if (!values.otherDecisionMaker || values.otherDecisionMaker.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["otherDecisionMaker"],
          message: "Informe quem é o tomador de decisão.",
        });
      }
    }
  });

type QuestionarioFormValues = z.infer<typeof questionarioSchema>;

type StepId =
  | "dados_lead"
  | "bloco1"
  | "culturas_decisao"
  | "gargalo_impacto"
  | "tentou_resolver"
  | "taxa_variavel"
  | "ajuste_manejo"
  | "urgencia";

const stepOrder: StepId[] = [
  "dados_lead",
  "bloco1",
  "culturas_decisao",
  "gargalo_impacto",
  "tentou_resolver",
  "taxa_variavel",
  "ajuste_manejo",
  "urgencia",
];

const stepFieldNames: Record<StepId, Array<keyof QuestionarioFormValues>> = {
  dados_lead: ["clientName", "whatsapp", "email"],
  bloco1: ["farmName", "municipality", "totalAreaHa"],
  culturas_decisao: ["cultures", "decisionMaker", "otherDecisionMaker"],
  gargalo_impacto: ["mainBottleneck", "mainBottleneckImpact"],
  tentou_resolver: ["triedBefore"],
  taxa_variavel: ["georeferencedSampling", "variableRate"],
  ajuste_manejo: ["organizedHistory", "willingAdjustManagement"],
  urgencia: ["urgencyToResolve"],
};

const leadPartialSchema = z.object({
  clientName: z.string().trim().min(2),
  whatsapp: z
    .string()
    .transform((v) => normalizeWhatsapp(v))
    .refine((v) => v.length >= 10 && v.length <= 15),
  email: z.string().trim().email(),
});

const cultureIds: readonly Culture[] = cultureOptions;

function OptionRadio(props: {
  value: string;
  checked: boolean;
  id: string;
  label: string;
  description?: string;
}) {
  const { id, checked, label, description, value } = props;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer select-none items-center gap-3 rounded-lg border p-3 transition-colors",
        checked
          ? "border-accent bg-accent ring-1 ring-accent text-primary-foreground"
          : "border-border bg-card/40",
      )}
    >
      <div className="shrink-0 pb-0.5">
        <RadioGroupItem
          value={value}
          id={id}
          className={cn(
            "border-input bg-background",
            "data-[state=checked]:border-accent-foreground data-[state=checked]:bg-accent-foreground data-[state=checked]:text-primary",
          )}
        />
      </div>
      <span className="min-w-0 flex-1">
        <span className="block text-md font-medium leading-none">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function OptionCheckbox(props: {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  const { id, checked, onChange, label } = props;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer select-none items-center gap-3 rounded-lg border p-3 transition-colors",
        checked
          ? "border-accent bg-accent ring-1 ring-accent text-primary-foreground"
          : "border-border bg-card/40",
      )}
    >
      <div className="shrink-0 pt-0.5">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={() => onChange()}
          className={cn(
            "border-input bg-background",
            "data-[state=checked]:border-accent-foreground data-[state=checked]:bg-accent-foreground data-[state=checked]:text-primary",
          )}
        />
      </div>
      <span className="block min-w-0 flex-1 text-md font-medium leading-none">
        {label}
      </span>
    </label>
  );
}

const QUESTIONARIO_FINAL_FORM_ID = "questionario-final-form";

const questionarioInputClassName =
  "!text-lg h-14 font-medium tracking-wide rounded-xl";

export function QuestionarioForm() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPortalReady, setProgressPortalReady] = useState(false);
  const [progressFillRevealed, setProgressFillRevealed] = useState(false);

  const stepId = stepOrder[stepIndex];
  const totalSteps = stepOrder.length;
  const progressPct = ((stepIndex + 1) / totalSteps) * 100;
  const isLastStep = stepIndex === totalSteps - 1;
  const displayedFillPct = progressFillRevealed ? progressPct : 0;

  useEffect(() => {
    setProgressPortalReady(true);
  }, []);

  useEffect(() => {
    if (!progressPortalReady) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setProgressFillRevealed(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [progressPortalReady]);

  const form = useForm<QuestionarioFormValues>({
    resolver: zodResolver(
      questionarioSchema,
    ) as Resolver<QuestionarioFormValues>,
    defaultValues: {
      farmName: "",
      municipality: "",
      totalAreaHa: 0,
      cultures: [],
      decisionMaker: undefined,
      otherDecisionMaker: "",
      mainBottleneck: undefined,
      mainBottleneckImpact: undefined,
      triedBefore: undefined,

      georeferencedSampling: undefined,
      variableRate: undefined,
      organizedHistory: undefined,
      willingAdjustManagement: undefined,
      urgencyToResolve: undefined,

      clientName: "",
      whatsapp: "",
      email: "",
    },
    mode: "onTouched",
  });

  const values = form.watch();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(QUESTIONARIO_LEAD_PARTIAL_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as QuestionarioLeadPartialPayload;
      if (parsed?.version !== 1) return;
      if (parsed.clientName?.trim())
        form.setValue("clientName", parsed.clientName, { shouldDirty: false });
      if (parsed.email?.trim())
        form.setValue("email", parsed.email, { shouldDirty: false });
      if (parsed.whatsapp)
        form.setValue("whatsapp", parsed.whatsapp, { shouldDirty: false });
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hidratação única ao montar
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      const parsed = leadPartialSchema.safeParse({
        clientName: values.clientName?.trim() ?? "",
        whatsapp: values.whatsapp ?? "",
        email: values.email?.trim() ?? "",
      });
      if (!parsed.success) return;
      const payload: QuestionarioLeadPartialPayload = {
        version: 1,
        clientName: parsed.data.clientName,
        whatsapp: parsed.data.whatsapp,
        email: parsed.data.email,
        savedAt: new Date().toISOString(),
        stepIndex,
      };
      try {
        sessionStorage.setItem(
          QUESTIONARIO_LEAD_PARTIAL_KEY,
          JSON.stringify(payload),
        );
      } catch {
        /* ignore quota / private mode */
      }
    }, 700);
    return () => window.clearTimeout(id);
  }, [values.clientName, values.whatsapp, values.email, stepIndex]);

  function goBack() {
    setStepIndex((s) => Math.max(0, s - 1));
  }

  function handleBack() {
    if (stepIndex === 0) {
      router.push("/");
      return;
    }
    goBack();
  }

  async function goNext() {
    const fields = stepFieldNames[stepId];
    const ok = await form.trigger(
      fields as Array<keyof QuestionarioFormValues>,
    );
    if (!ok) return;
    setStepIndex((s) => Math.min(stepOrder.length - 1, s + 1));
  }

  function toggleCulture(culture: Culture) {
    const current = form.getValues("cultures");
    const next = current.includes(culture)
      ? current.filter((x) => x !== culture)
      : [...current, culture];
    form.setValue("cultures", next, { shouldValidate: true });
  }

  const handleGenerateReport = form.handleSubmit(async (data) => {
    setIsProcessing(true);

    try {
      await new Promise((r) => setTimeout(r, 1100));

      const answers = data as unknown as QuestionarioAnswers;
      const report: QuestionarioReport = generateGenericReport(answers);
      const payload = { version: 2 as const, answers, report };
      sessionStorage.setItem(QUESTIONARIO_SESSION_KEY, JSON.stringify(payload));
      try {
        sessionStorage.removeItem(QUESTIONARIO_LEAD_PARTIAL_KEY);
      } catch {
        /* ignore */
      }
      router.push("/questionario/resultado");
    } finally {
      setIsProcessing(false);
    }
  });

  return (
    <div className="flex h-full flex-col">
      {progressPortalReady
        ? createPortal(
            <div
              className="pointer-events-none fixed inset-x-0 top-0 z-60 h-4 border-b border-border/80 bg-muted shadow-sm"
              role="progressbar"
              aria-valuenow={stepIndex + 1}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label="Progresso do questionário"
            >
              <div
                className={cn(
                  "h-full bg-accent transition-[width] duration-700 ease-out",
                  !isLastStep && "rounded-r-full",
                )}
                style={{ width: `${displayedFillPct}%` }}
              />
            </div>,
            document.body,
          )
        : null}
      <form
        id={QUESTIONARIO_FINAL_FORM_ID}
        className="flex min-h-0 flex-1 flex-col"
        aria-label="Questionário 250K"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isLastStep) return;
          void handleGenerateReport(e);
        }}
      >
        <div className="px-4 pt-3 text-center text-xs text-muted-foreground md:px-6">
          Passo {stepIndex + 1} de {totalSteps}
        </div>

        <div className="flex flex-1 flex-col px-4 pb-28 pt-4 md:px-6 md:pb-32 md:pt-6">
          <div className="mx-auto w-full max-w-4xl flex-1">
            <div className="mb-8 space-y-3 text-center">
              <h1 className="text-2xl md:text-4xl font-black text-primary tracking-tight">
                Sua fazenda é produtiva?
              </h1>
              {stepId === "dados_lead" ? (
                <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Primeiro, deixe seu nome e contato. Assim conseguimos enviar seu
                  relatório e retomar de onde parou se você sair antes de
                  concluir.
                </p>
              ) : stepId === "bloco1" ? (
                <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Se a resposta automática é “sim”, este questionário vai mostrar
                  onde a produtividade ainda está escapando — e o que fazer em
                  seguida.
                </p>
              ) : (
                <>
                  <p className="text-base md:text-lg font-semibold text-foreground max-w-2xl mx-auto leading-snug">
                    Anamnese para uma Alta Produtividade - 250K
                  </p>
                  <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Descubra o que está travando a produtividade da sua fazenda
                  </p>
                </>
              )}
            </div>
            <div className="space-y-6">
              {stepId === "dados_lead" ? (
                <div className="flex flex-col gap-4 pb-4">
                  <Label className="text-base">
                    Seus dados para contato e envio do relatório
                  </Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="clientName">Seu nome</Label>
                      <Input
                        id="clientName"
                        placeholder="Seu nome completo"
                        {...form.register("clientName")}
                        autoComplete="name"
                        disabled={isProcessing}
                        className={questionarioInputClassName}
                      />
                      {form.formState.errors.clientName ? (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.clientName.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Controller
                        name="whatsapp"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            id="whatsapp"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="(00) 0000-0000"
                            disabled={isProcessing}
                            className={questionarioInputClassName}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            value={formatBrazilianPhoneInput(field.value ?? "")}
                            onChange={(e) => {
                              const digits = normalizeWhatsapp(
                                e.target.value,
                              ).slice(0, 15);
                              field.onChange(digits);
                            }}
                          />
                        )}
                      />
                      {form.formState.errors.whatsapp ? (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.whatsapp.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        placeholder="seu@email.com"
                        inputMode="email"
                        type="email"
                        {...form.register("email")}
                        autoComplete="email"
                        disabled={isProcessing}
                        className={questionarioInputClassName}
                      />
                      {form.formState.errors.email ? (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.email.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

            {stepId === "bloco1" ||
            stepId === "culturas_decisao" ||
            stepId === "gargalo_impacto" ||
            stepId === "tentou_resolver" ? (
              <div className="space-y-6">
                <div
                  className={`grid grid-cols-1 gap-12 ${
                    stepId === "bloco1" ? "" : "hidden"
                  }`}
                >
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="farmName">Nome da Fazenda</Label>
                    <Input
                      id="farmName"
                      placeholder="Ex: Fazenda Boa Esperança"
                      {...form.register("farmName")}
                      className={questionarioInputClassName}
                    />
                    {form.formState.errors.farmName ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.farmName.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="municipality">Município</Label>
                    <Input
                      id="municipality"
                      placeholder="Ex: Lucas do Rio Verde"
                      {...form.register("municipality")}
                      className={questionarioInputClassName}
                    />
                    {form.formState.errors.municipality ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.municipality.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="totalAreaHa">
                      Área Total{" "}
                      <span className="text-xs text-muted-foreground">
                        (ha)
                      </span>
                    </Label>
                    <Input
                      id="totalAreaHa"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      placeholder="Ex: 1500"
                      {...form.register("totalAreaHa", { valueAsNumber: true })}
                      className={questionarioInputClassName}
                    />
                    {form.formState.errors.totalAreaHa ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.totalAreaHa.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div
                  className={`flex flex-col space-y-4 pb-12 ${
                    stepId === "culturas_decisao" ? "" : "hidden"
                  }`}
                >
                  <Label>
                    Culturas{" "}
                    <span className="text-xs text-muted-foreground">
                      (marque quantas quiser)
                    </span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cultureIds.map((culture) => (
                      <OptionCheckbox
                        key={culture}
                        id={optionId("culture", culture)}
                        checked={values.cultures.includes(culture)}
                        onChange={() => toggleCulture(culture)}
                        label={culture}
                      />
                    ))}
                  </div>
                  {form.formState.errors.cultures ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.cultures.message}
                    </p>
                  ) : null}
                </div>

                <div
                  className={`flex flex-col space-y-4 ${
                    stepId === "culturas_decisao" ? "" : "hidden"
                  }`}
                >
                  <Label>Na sua fazenda, quem é o tomador de decisão?</Label>
                  <RadioGroup
                    name="decisionMaker"
                    value={values.decisionMaker}
                    onValueChange={(v) =>
                      form.setValue(
                        "decisionMaker",
                        v as QuestionarioAnswers["decisionMaker"],
                        { shouldValidate: true },
                      )
                    }
                    className="grid-cols-1"
                  >
                    {decisionMakerOptions.map((opt) => (
                      <OptionRadio
                        key={opt}
                        value={opt}
                        id={optionId("decisionMaker", opt)}
                        checked={values.decisionMaker === opt}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>

                  {form.formState.errors.decisionMaker ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.decisionMaker.message}
                    </p>
                  ) : null}

                  {values.decisionMaker === "Outros" ? (
                    <div className="space-y-2">
                      <Label htmlFor="otherDecisionMaker">
                        Se outro, quem?
                      </Label>
                      <Input
                        id="otherDecisionMaker"
                        placeholder="Informe o nome ou papel"
                        value={values.otherDecisionMaker ?? ""}
                        onChange={(e) =>
                          form.setValue("otherDecisionMaker", e.target.value, {
                            shouldValidate: true,
                          })
                        }
                        className={questionarioInputClassName}
                      />
                      {form.formState.errors.otherDecisionMaker ? (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.otherDecisionMaker.message}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div
                  className={`flex flex-col space-y-4 pb-12 ${
                    stepId === "gargalo_impacto" ? "" : "hidden"
                  }`}
                >
                  <Label>Qual é o principal gargalo da fazenda?</Label>
                  <RadioGroup
                    name="mainBottleneck"
                    value={values.mainBottleneck}
                    onValueChange={(v) =>
                      form.setValue(
                        "mainBottleneck",
                        v as QuestionarioAnswers["mainBottleneck"],
                        { shouldValidate: true },
                      )
                    }
                    className="grid-cols-1 sm:grid-cols-2"
                  >
                    {gargaloOptions.map((opt) => (
                      <OptionRadio
                        key={opt}
                        value={opt}
                        id={optionId("mainBottleneck", opt)}
                        checked={values.mainBottleneck === opt}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                  {form.formState.errors.mainBottleneck ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.mainBottleneck.message}
                    </p>
                  ) : null}
                </div>

                <div
                  className={`flex flex-col space-y-4 ${
                    stepId === "gargalo_impacto" ? "" : "hidden"
                  }`}
                >
                  <div className="text-sm font-semibold text-primary">
                    Esse problema impacta mais
                  </div>
                  <RadioGroup
                    name="mainBottleneckImpact"
                    value={values.mainBottleneckImpact}
                    onValueChange={(v) =>
                      form.setValue(
                        "mainBottleneckImpact",
                        v as QuestionarioAnswers["mainBottleneckImpact"],
                        { shouldValidate: true },
                      )
                    }
                    className="grid-cols-1"
                  >
                    {impactoOptions.map((opt) => (
                      <OptionRadio
                        key={opt}
                        value={opt}
                        id={optionId("mainBottleneckImpact", opt)}
                        checked={values.mainBottleneckImpact === opt}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                  {form.formState.errors.mainBottleneckImpact ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.mainBottleneckImpact.message}
                    </p>
                  ) : null}
                </div>

                <div
                  className={`flex flex-col space-y-4 ${
                    stepId === "tentou_resolver" ? "" : "hidden"
                  }`}
                >
                  <Label>Já tentou resolver isto antes?</Label>
                  <RadioGroup
                    name="triedBefore"
                    value={values.triedBefore}
                    onValueChange={(v) =>
                      form.setValue(
                        "triedBefore",
                        v as QuestionarioAnswers["triedBefore"],
                        { shouldValidate: true },
                      )
                    }
                    className="grid-cols-1"
                  >
                    {tentouResolverOptions.map((opt) => (
                      <OptionRadio
                        key={opt}
                        value={opt}
                        id={optionId("triedBefore", opt)}
                        checked={values.triedBefore === opt}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                  {form.formState.errors.triedBefore ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.triedBefore.message}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {stepId === "taxa_variavel" ? (
              <div className="flex flex-col gap-12">
                <div className="flex flex-col space-y-4">
                  <Label>Faz amostragem georreferenciada?</Label>
                  <RadioGroup
                    name="georeferencedSampling"
                    value={values.georeferencedSampling}
                    onValueChange={(v) =>
                      form.setValue(
                        "georeferencedSampling",
                        v as QuestionarioAnswers["georeferencedSampling"],
                        { shouldValidate: true },
                      )
                    }
                    className="grid-cols-1"
                  >
                    {amostragemOptions.map((opt) => (
                      <OptionRadio
                        key={opt}
                        value={opt}
                        id={optionId("georeferencedSampling", opt)}
                        checked={values.georeferencedSampling === opt}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                  {form.formState.errors.georeferencedSampling ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.georeferencedSampling.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col space-y-4">
                  <Label>Usa taxa variável?</Label>
                  <RadioGroup
                    name="variableRate"
                    value={values.variableRate}
                    onValueChange={(v) =>
                      form.setValue(
                        "variableRate",
                        v as QuestionarioAnswers["variableRate"],
                        { shouldValidate: true },
                      )
                    }
                    className="grid-cols-1"
                  >
                    {taxaVariavelOptions.map((opt) => (
                      <OptionRadio
                        key={opt}
                        value={opt}
                        id={optionId("variableRate", opt)}
                        checked={values.variableRate === opt}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                  {form.formState.errors.variableRate ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.variableRate.message}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {stepId === "ajuste_manejo" ? (
              <div className="flex flex-col gap-12">
                <div className="flex flex-col space-y-4">
                  <Label>Possui histórico organizado?</Label>
                  <RadioGroup
                    name="organizedHistory"
                    value={values.organizedHistory}
                    onValueChange={(v) =>
                      form.setValue(
                        "organizedHistory",
                        v as QuestionarioAnswers["organizedHistory"],
                        { shouldValidate: true },
                      )
                    }
                    className="grid-cols-1"
                  >
                    {historicoOrganizadoOptions.map((opt) => (
                      <OptionRadio
                        key={opt}
                        value={opt}
                        id={optionId("organizedHistory", opt)}
                        checked={values.organizedHistory === opt}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                  {form.formState.errors.organizedHistory ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.organizedHistory.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col space-y-4">
                  <Label>
                    Está disposto a ajustar manejo se o diagnóstico indicar?
                  </Label>
                  <RadioGroup
                    name="willingAdjustManagement"
                    value={values.willingAdjustManagement}
                    onValueChange={(v) =>
                      form.setValue(
                        "willingAdjustManagement",
                        v as QuestionarioAnswers["willingAdjustManagement"],
                        { shouldValidate: true },
                      )
                    }
                    className="grid-cols-1"
                  >
                    {ajustarManejoOptions.map((opt) => (
                      <OptionRadio
                        key={opt}
                        value={opt}
                        id={optionId("willingAdjustManagement", opt)}
                        checked={values.willingAdjustManagement === opt}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                  {form.formState.errors.willingAdjustManagement ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.willingAdjustManagement.message}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {stepId === "urgencia" ? (
              <div className="flex flex-col gap-4 pb-12">
                <div className="flex flex-col space-y-4">
                  <Label>Quer resolver isso ainda nesta safra?</Label>
                  <RadioGroup
                    name="urgencyToResolve"
                    value={values.urgencyToResolve}
                    onValueChange={(v) =>
                      form.setValue(
                        "urgencyToResolve",
                        v as QuestionarioAnswers["urgencyToResolve"],
                        { shouldValidate: true },
                      )
                    }
                    className="grid-cols-1"
                  >
                    {urgenciaOptions.map((opt) => (
                      <OptionRadio
                        key={opt}
                        value={opt}
                        id={optionId("urgencyToResolve", opt)}
                        checked={values.urgencyToResolve === opt}
                        label={opt}
                      />
                    ))}
                  </RadioGroup>
                  {form.formState.errors.urgencyToResolve ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.urgencyToResolve.message}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 md:px-6">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleBack}
            disabled={isProcessing}
          >
            <ArrowLeft
              data-icon="inline-start"
              className="size-4"
              aria-hidden
            />
            Voltar
          </Button>
          {isLastStep ? (
            <Button type="submit" disabled={isProcessing} size="lg">
              {isProcessing ? (
                <>
                  <Loader2
                    data-icon="inline-start"
                    className="size-4 animate-spin"
                    aria-hidden
                  />
                  Processando...
                </>
              ) : (
                <>
                  <FileText
                    data-icon="inline-start"
                    className="size-4"
                    aria-hidden
                  />
                  Gerar relatório
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goNext}
              disabled={isProcessing}
              size="lg"
            >
              Próximo
              <ArrowRight
                data-icon="inline-end"
                className="size-4"
                aria-hidden
              />
            </Button>
          )}
        </div>
      </div>
      </form>
    </div>
  );
}
