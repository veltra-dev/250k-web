"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { ConfettiOverlay } from "@/components/questionario/confetti-overlay";
import type { QuestionarioSessionPayload } from "@/components/questionario/questionario-types";
import { QUESTIONARIO_SESSION_KEY } from "@/components/questionario/questionario-types";
import { printQuestionarioResultado } from "@/lib/questionario-resultado-print";

const RESULTADO_CONFETTI_MS = 8000;

function splitParagraphs(text: string): string[] {
  return text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function QuestionarioResultadoPage() {
  const [payload] = useState<QuestionarioSessionPayload | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(QUESTIONARIO_SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as QuestionarioSessionPayload;
      if (!parsed?.report?.reportType) return null;
      return parsed;
    } catch {
      return null;
    }
  });

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!payload) return;
    const showId = window.setTimeout(() => setShowConfetti(true), 0);
    const hideId = window.setTimeout(
      () => setShowConfetti(false),
      RESULTADO_CONFETTI_MS,
    );
    return () => {
      window.clearTimeout(showId);
      window.clearTimeout(hideId);
    };
  }, [payload]);

  const paragraphs = useMemo(() => {
    if (!payload) return [];
    return splitParagraphs(payload.report.reportText);
  }, [payload]);

  if (!payload) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-6 md:p-8 bg-card/60 border-border/60">
            <div className="text-primary font-semibold text-lg">
              Nenhum relatório foi encontrado.
            </div>
            <p className="text-muted-foreground mt-2">
              Preencha o questionário novamente para gerar seu resultado.
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link href="/questionario">Ir para o questionário</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="questionario-resultado-screen relative py-12 md:py-16 min-h-dvh flex items-center justify-center">
      <ConfettiOverlay
        active={showConfetti}
        durationMs={RESULTADO_CONFETTI_MS}
      />
      <div className="container h-full mx-auto px-4 max-w-4xl">
        <Card
          id="questionario-resultado-print"
          className="p-6 md:p-8 bg-card/60 border-border/60 h-full"
        >
          <div className="questionario-resultado-print-body space-y-6">
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Resultado do questionário
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary mt-1">
                Tipo de Resposta: {payload.report.reportType}
              </h1>
              <p className="text-muted-foreground mt-2">
                {payload.answers.farmName} - {payload.answers.municipality}
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold text-primary mb-3">
                Pontos-chave
              </div>
              <ul className="list-disc pl-5 space-y-2">
                {payload.report.highlights.map((h) => (
                  <li key={h} className="text-sm text-foreground/90">
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {paragraphs.map((p, idx) => (
                <p
                  key={`${idx}_${p.slice(0, 10)}`}
                  className="text-muted-foreground leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="questionario-resultado-print-footer pt-4 border-t border-border/60 flex flex-col items-center gap-4">
              <div className="questionario-resultado-print-logo relative h-20 w-20">
                <Image
                  src="/web-app-manifest-512x512.png"
                  alt="Logo da 250K"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Anamnese para Alta Produtividade - 250K
              </div>

              <div className="questionario-resultado-no-print w-full flex flex-col gap-3 sm:gap-4 sm:items-center">
                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  onClick={() => printQuestionarioResultado(payload)}
                >
                  <Printer data-icon="inline-start" aria-hidden />
                  Imprimir resultado
                </Button>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    asChild
                    className="flex-1"
                    size="lg"
                    variant="outline"
                  >
                    <Link href="/">
                      <Home data-icon="inline-start" aria-hidden />
                      Voltar ao início
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1"
                    size="lg"
                    variant="outline"
                  >
                    <Link href="/questionario">
                      <RotateCcw data-icon="inline-start" aria-hidden />
                      Refazer questionário
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
