"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type {
  Culture,
  QuestionarioAnswers,
  QuestionarioReport,
} from "./questionario-types";
import {
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
    decisionMaker: z.enum(decisionMakerOptions),
    otherDecisionMaker: z
      .string()
      .optional()
      .transform((s) => (s ? s.trim() : undefined)),
    mainBottleneck: z.enum(gargaloOptions),
    mainBottleneckImpact: z.enum(impactoOptions),
    triedBefore: z.enum(tentouResolverOptions),

    georeferencedSampling: z.enum(amostragemOptions),
    variableRate: z.enum(taxaVariavelOptions),
    organizedHistory: z.enum(historicoOrganizadoOptions),
    willingAdjustManagement: z.enum(ajustarManejoOptions),
    urgencyToResolve: z.enum(urgenciaOptions),

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
  | "bloco1"
  | "culturas_decisao"
  | "gargalo_impacto"
  | "tentou_resolver"
  | "taxa_variavel"
  | "ajuste_manejo"
  | "urgencia_e_dados";

const stepOrder: StepId[] = [
  "bloco1",
  "culturas_decisao",
  "gargalo_impacto",
  "tentou_resolver",
  "taxa_variavel",
  "ajuste_manejo",
  "urgencia_e_dados",
];

const stepFieldNames: Record<StepId, Array<keyof QuestionarioFormValues>> =
  {
    bloco1: ["farmName", "municipality", "totalAreaHa"],
    culturas_decisao: [
      "cultures",
      "decisionMaker",
      "otherDecisionMaker",
    ],
    gargalo_impacto: ["mainBottleneck", "mainBottleneckImpact"],
    tentou_resolver: ["triedBefore"],
    taxa_variavel: ["georeferencedSampling", "variableRate"],
    ajuste_manejo: ["organizedHistory", "willingAdjustManagement"],
    urgencia_e_dados: ["urgencyToResolve", "clientName", "whatsapp", "email"],
  };

const cultureIds: readonly Culture[] = cultureOptions;

function OptionRadio(props: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  id: string;
  label: string;
  description?: string;
}) {
  const { id, checked, onChange, label, description, value, name } = props;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="pt-0.5">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-accent"
        />
      </div>
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-sm font-medium">{label}</span>
        {description ? (
          <span className="block text-xs text-muted-foreground mt-0.5">
            {description}
          </span>
        ) : null}
      </label>
    </div>
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
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3">
      <div className="pt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-accent"
        />
      </div>
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-sm font-medium">{label}</span>
      </label>
    </div>
  );
}

function ConfettiOverlay({ active, durationMs }: { active: boolean; durationMs: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const colors = ["#22352D", "#B14F32", "#ffffff", "#F59E0B", "#10B981"];
    const createParticle = () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.2,
      vy: Math.random() * 4 + 6,
      size: Math.random() * 7 + 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      shape: Math.random() < 0.5 ? "rect" : "tri",
    });

    const particles = Array.from({ length: 180 }, createParticle);
    const gravity = 0.12;

    const start = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < durationMs) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, durationMs]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export function QuestionarioForm() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const stepId = stepOrder[stepIndex];

  const form = useForm<QuestionarioAnswers>({
    resolver: zodResolver(questionarioSchema),
    defaultValues: {
      farmName: "",
      municipality: "",
      totalAreaHa: 0,
      cultures: [],
      decisionMaker: "Produtor",
      otherDecisionMaker: "",
      mainBottleneck: "Fertilidade/Calagem",
      mainBottleneckImpact: "Produtividade",
      triedBefore: "Sim e funcionou parcialmente",

      georeferencedSampling: "Não",
      variableRate: "Não",
      organizedHistory: "Não",
      willingAdjustManagement: "Sim",
      urgencyToResolve: "Sim",

      clientName: "",
      whatsapp: "",
      email: "",
    },
    mode: "onTouched",
  });

  const values = form.watch();

  function goBack() {
    setStepIndex((s) => Math.max(0, s - 1));
  }

  async function goNext() {
    const fields = stepFieldNames[stepId];
    const ok = await form.trigger(fields as Array<keyof QuestionarioAnswers>);
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
    const CONFETTI_DURATION_MS = 1800;
    setIsProcessing(true);

    try {
      // UX: simular tempo de processamento e geração.
      await new Promise((r) => setTimeout(r, 1100));

      const report: QuestionarioReport = generateGenericReport(data);
      const payload = { version: 1 as const, answers: data, report };
      sessionStorage.setItem(
        QUESTIONARIO_SESSION_KEY,
        JSON.stringify(payload),
      );

      setShowConfetti(true);
      window.setTimeout(() => {
        setShowConfetti(false);
        router.push("/questionario/resultado");
      }, CONFETTI_DURATION_MS);
    } finally {
      setIsProcessing(false);
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <ConfettiOverlay active={showConfetti} durationMs={1800} />
      <Card className="border-border/60 bg-primary/5 shadow-sm ring-primary/10 dark:bg-primary/10 dark:ring-primary/20 h-full">
        <div className="p-6 md:p-8 flex-1">
          <div className="mb-8 text-center space-y-3">
            <h1 className="text-2xl md:text-4xl font-black text-primary tracking-tight">
              Sua fazenda é produtiva?
            </h1>
            {stepIndex === 0 ? (
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Se a resposta automática é “sim”, este questionário vai mostrar onde
                a produtividade ainda está escapando — e o que fazer em seguida.
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
          <div className="rounded-xl border border-border bg-background/40 p-4 md:p-6">

          {stepId === "bloco1" ||
          stepId === "culturas_decisao" ||
          stepId === "gargalo_impacto" ||
          stepId === "tentou_resolver" ? (
            <div className="space-y-6">
              <div
                className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
                  stepId === "bloco1" ? "" : "hidden"
                }`}
              >
                <div className="space-y-2">
                  <Label htmlFor="farmName">Nome da Fazenda:</Label>
                  <Input
                    id="farmName"
                    placeholder="Ex: Fazenda Boa Esperança"
                    {...form.register("farmName")}
                  />
                  {form.formState.errors.farmName ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.farmName.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipality">Município:</Label>
                  <Input
                    id="municipality"
                    placeholder="Ex: Lucas do Rio Verde"
                    {...form.register("municipality")}
                  />
                  {form.formState.errors.municipality ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.municipality.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAreaHa">Área Total (ha):</Label>
                  <Input
                    id="totalAreaHa"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="Ex: 1500"
                    {...form.register("totalAreaHa", { valueAsNumber: true })}
                  />
                  {form.formState.errors.totalAreaHa ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.totalAreaHa.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div
                className={`space-y-3 ${
                  stepId === "culturas_decisao" ? "" : "hidden"
                }`}
              >
                <div className="text-sm font-semibold text-primary">
                  Culturas: (marque quantas quiser)
                </div>
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
                className={`space-y-3 ${
                  stepId === "culturas_decisao" ? "" : "hidden"
                }`}
              >
                <div className="text-sm font-semibold text-primary">
                  Na sua fazenda, quem é o tomador de decisão?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {decisionMakerOptions.map((opt) => (
                    <OptionRadio
                      key={opt}
                      name="decisionMaker"
                      value={opt}
                      id={optionId("decisionMaker", opt)}
                      checked={values.decisionMaker === opt}
                      onChange={() => form.setValue("decisionMaker", opt, { shouldValidate: true })}
                      label={opt}
                    />
                  ))}
                </div>

                {form.formState.errors.decisionMaker ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.decisionMaker.message}
                  </p>
                ) : null}

                {values.decisionMaker === "Outros" ? (
                  <div className="space-y-2">
                    <Label htmlFor="otherDecisionMaker">Se outro, quem?</Label>
                    <Input
                      id="otherDecisionMaker"
                      placeholder="Informe o nome ou papel"
                      value={values.otherDecisionMaker ?? ""}
                      onChange={(e) =>
                        form.setValue(
                          "otherDecisionMaker",
                          e.target.value,
                          { shouldValidate: true }
                        )
                      }
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
                className={`space-y-3 ${
                  stepId === "gargalo_impacto" ? "" : "hidden"
                }`}
              >
                <div className="text-sm font-semibold text-primary">
                  Qual é o principal gargalo da fazenda?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gargaloOptions.map((opt) => (
                    <OptionRadio
                      key={opt}
                      name="mainBottleneck"
                      value={opt}
                      id={optionId("mainBottleneck", opt)}
                      checked={values.mainBottleneck === opt}
                      onChange={() =>
                        form.setValue("mainBottleneck", opt, { shouldValidate: true })
                      }
                      label={opt}
                    />
                  ))}
                </div>
                {form.formState.errors.mainBottleneck ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.mainBottleneck.message}
                  </p>
                ) : null}
              </div>

              <div
                className={`space-y-3 ${
                  stepId === "gargalo_impacto" ? "" : "hidden"
                }`}
              >
                <div className="text-sm font-semibold text-primary">
                  Esse problema impacta mais
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {impactoOptions.map((opt) => (
                    <OptionRadio
                      key={opt}
                      name="mainBottleneckImpact"
                      value={opt}
                      id={optionId("mainBottleneckImpact", opt)}
                      checked={values.mainBottleneckImpact === opt}
                      onChange={() =>
                        form.setValue("mainBottleneckImpact", opt, { shouldValidate: true })
                      }
                      label={opt}
                    />
                  ))}
                </div>
                {form.formState.errors.mainBottleneckImpact ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.mainBottleneckImpact.message}
                  </p>
                ) : null}
              </div>

              <div
                className={`space-y-3 ${
                  stepId === "tentou_resolver" ? "" : "hidden"
                }`}
              >
                <div className="text-sm font-semibold text-primary">
                  Já tentou resolver isto antes?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tentouResolverOptions.map((opt) => (
                    <OptionRadio
                      key={opt}
                      name="triedBefore"
                      value={opt}
                      id={optionId("triedBefore", opt)}
                      checked={values.triedBefore === opt}
                      onChange={() =>
                        form.setValue("triedBefore", opt, { shouldValidate: true })
                      }
                      label={opt}
                    />
                  ))}
                </div>
                {form.formState.errors.triedBefore ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.triedBefore.message}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {stepId === "taxa_variavel" ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-primary">
                  Faz amostragem georreferenciada? *
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {amostragemOptions.map((opt) => (
                    <OptionRadio
                      key={opt}
                      name="georeferencedSampling"
                      value={opt}
                      id={optionId("georeferencedSampling", opt)}
                      checked={values.georeferencedSampling === opt}
                      onChange={() =>
                        form.setValue("georeferencedSampling", opt, {
                          shouldValidate: true,
                        })
                      }
                      label={opt}
                    />
                  ))}
                </div>
                {form.formState.errors.georeferencedSampling ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.georeferencedSampling.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-primary">
                  Usa taxa variável? *
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {taxaVariavelOptions.map((opt) => (
                    <OptionRadio
                      key={opt}
                      name="variableRate"
                      value={opt}
                      id={optionId("variableRate", opt)}
                      checked={values.variableRate === opt}
                      onChange={() =>
                        form.setValue("variableRate", opt, { shouldValidate: true })
                      }
                      label={opt}
                    />
                  ))}
                </div>
                {form.formState.errors.variableRate ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.variableRate.message}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {stepId === "ajuste_manejo" ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-primary">
                  Possui histórico organizado? *
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {historicoOrganizadoOptions.map((opt) => (
                    <OptionRadio
                      key={opt}
                      name="organizedHistory"
                      value={opt}
                      id={optionId("organizedHistory", opt)}
                      checked={values.organizedHistory === opt}
                      onChange={() =>
                        form.setValue("organizedHistory", opt, { shouldValidate: true })
                      }
                      label={opt}
                    />
                  ))}
                </div>
                {form.formState.errors.organizedHistory ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.organizedHistory.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-primary">
                  Está disposto a ajustar manejo se o diagnóstico indicar? *
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ajustarManejoOptions.map((opt) => (
                    <OptionRadio
                      key={opt}
                      name="willingAdjustManagement"
                      value={opt}
                      id={optionId("willingAdjustManagement", opt)}
                      checked={values.willingAdjustManagement === opt}
                      onChange={() =>
                        form.setValue("willingAdjustManagement", opt, { shouldValidate: true })
                      }
                      label={opt}
                    />
                  ))}
                </div>
                {form.formState.errors.willingAdjustManagement ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.willingAdjustManagement.message}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {stepId === "urgencia_e_dados" ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-primary">
                  Quer resolver isso ainda nesta safra? *
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {urgenciaOptions.map((opt) => (
                    <OptionRadio
                      key={opt}
                      name="urgencyToResolve"
                      value={opt}
                      id={optionId("urgencyToResolve", opt)}
                      checked={values.urgencyToResolve === opt}
                      onChange={() =>
                        form.setValue("urgencyToResolve", opt, { shouldValidate: true })
                      }
                      label={opt}
                    />
                  ))}
                </div>
                {form.formState.errors.urgencyToResolve ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.urgencyToResolve.message}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {stepId === "urgencia_e_dados" ? (
            <form
              onSubmit={handleGenerateReport}
              className="space-y-6"
              aria-label="Questionário 250K"
            >
              <div className="rounded-lg border border-border/70 bg-background/50 p-4">
                <div className="text-sm font-semibold text-primary">
                  Para finalizar e entregarmos o seu relatório final, preciso de
                  mais algumas informações:
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="clientName">Seu Nome:</Label>
                  <Input
                    id="clientName"
                    placeholder="Seu nome completo"
                    {...form.register("clientName")}
                    autoComplete="name"
                    disabled={isProcessing}
                  />
                  {form.formState.errors.clientName ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.clientName.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="whatsapp">WhatsApp:</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(00) 00000-0000"
                    inputMode="tel"
                    {...form.register("whatsapp")}
                    autoComplete="tel"
                    disabled={isProcessing}
                  />
                  {form.formState.errors.whatsapp ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.whatsapp.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="email">E-mail:</Label>
                  <Input
                    id="email"
                    placeholder="seu@email.com"
                    inputMode="email"
                    type="email"
                    {...form.register("email")}
                    autoComplete="email"
                    disabled={isProcessing}
                  />
                  {form.formState.errors.email ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                {isProcessing ? (
                  <div className="text-muted-foreground">Processando...</div>
                ) : (
                  <Button type="submit" disabled={isProcessing}>
                    Gerar relatório
                  </Button>
                )}
              </div>
            </form>
          ) : null}
        </div>

        {stepIndex < stepOrder.length - 1 ? (
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              Voltar
            </Button>
            <Button type="button" onClick={goNext}>
              Próximo
            </Button>
          </div>
        ) : stepIndex === stepOrder.length - 1 && stepIndex > 0 ? (
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              Voltar
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
    </div>
  );
}

