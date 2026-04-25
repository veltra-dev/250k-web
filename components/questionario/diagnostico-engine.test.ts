import { describe, expect, it } from "vitest";
import {
  financialImpactRPerHa,
  generateDiagnosticoReport,
  estimateProductiveLossScHa,
  pickPricingCulture,
  PRECO_SACA_MILHO_R,
  PRECO_SACA_SOJA_R,
  resolveEffectiveGargalo,
} from "./diagnostico-engine";
import type { QuestionarioAnswers } from "./questionario-types";

const base: QuestionarioAnswers = {
  farmName: "Fazenda Teste",
  municipality: "Uberaba",
  totalAreaHa: 500,
  cultures: ["Soja"],
  decisionMaker: "Eu",
  mainBottleneck: "Baixa produtividade",
  mainBottleneckImpact: "Produtividade",
  triedBefore: "Nunca tratou de forma técnica",
  georeferencedSampling: "Não",
  variableRate: "Não",
  organizedHistory: "Não",
  willingAdjustManagement: "Sim",
  urgencyToResolve: "Próxima safra",
  clientName: "Cliente",
  whatsapp: "34999999999",
  email: "teste@exemplo.com",
};

function answers(p: Partial<QuestionarioAnswers>): QuestionarioAnswers {
  return { ...base, ...p };
}

describe("pickPricingCulture", () => {
  it("prioriza Soja quando Soja e Milho estão na lista", () => {
    const r = pickPricingCulture(["Milho", "Soja"]);
    expect(r.basis).toBe("Soja");
    expect(r.pricePerScR).toBe(PRECO_SACA_SOJA_R);
  });

  it("usa Milho quando não há Soja", () => {
    const r = pickPricingCulture(["Milho"]);
    expect(r.basis).toBe("Milho");
    expect(r.pricePerScR).toBe(PRECO_SACA_MILHO_R);
  });

  it("usa referência saca soja para outras culturas", () => {
    const r = pickPricingCulture(["Algodão", "Feijão"]);
    expect(r.basis).toBe("Referência_soja");
    expect(r.pricePerScR).toBe(PRECO_SACA_SOJA_R);
  });
});

describe("resolveEffectiveGargalo", () => {
  it("mantém gargalo explícito do produtor", () => {
    expect(resolveEffectiveGargalo(answers({ mainBottleneck: "Nematoides" }))).toBe(
      "Nematoides",
    );
  });

  it("Não sabe + Todos + sem amostragem → Fertilidade/Calagem (fallback nutrição)", () => {
    expect(
      resolveEffectiveGargalo(
        answers({
          mainBottleneck: "Não sabe exatamente",
          mainBottleneckImpact: "Todos",
          georeferencedSampling: "Não",
        }),
      ),
    ).toBe("Fertilidade/Calagem");
  });

  it("Não sabe + Todos + com amostragem → Baixa produtividade", () => {
    expect(
      resolveEffectiveGargalo(
        answers({
          mainBottleneck: "Não sabe exatamente",
          mainBottleneckImpact: "Todos",
          georeferencedSampling: "Sim – malha maior que 10 ha",
        }),
      ),
    ).toBe("Baixa produtividade");
  });

  it("Não sabe + Custo → Custo alto de adubo", () => {
    expect(
      resolveEffectiveGargalo(
        answers({
          mainBottleneck: "Não sabe exatamente",
          mainBottleneckImpact: "Custo",
        }),
      ),
    ).toBe("Custo alto de adubo");
  });
});

describe("estimateProductiveLossScHa", () => {
  it("mantém faixa entre 10 e 40 sc/ha", () => {
    const a = answers({
      mainBottleneck: "Nematoides",
      urgencyToResolve: "Sim",
      triedBefore: "Sim e não funcionou",
      mainBottleneckImpact: "Todos",
      georeferencedSampling: "Não",
    });
    const sc = estimateProductiveLossScHa(a, "Nematoides");
    expect(sc).toBeGreaterThanOrEqual(10);
    expect(sc).toBeLessThanOrEqual(40);
  });
});

describe("financialImpactRPerHa", () => {
  it("multiplica sc/ha pelo preço da saca", () => {
    expect(financialImpactRPerHa(10, PRECO_SACA_MILHO_R)).toBe(600);
    expect(financialImpactRPerHa(10, PRECO_SACA_SOJA_R)).toBe(1200);
  });
});

describe("generateDiagnosticoReport", () => {
  it("gera sete seções e métricas coerentes com Soja", () => {
    const r = generateDiagnosticoReport(base);
    expect(r.sections).toBeDefined();
    expect(r.sections?.diagnosis.length).toBeGreaterThan(40);
    expect(r.sections?.mainPain).toContain("única prioridade narrativa");
    expect(r.productiveLossScHa).toBeDefined();
    expect(r.financialImpactRPerHa).toBe(
      financialImpactRPerHa(r.productiveLossScHa ?? 0, PRECO_SACA_SOJA_R),
    );
    expect(r.pricingCultureBasis).toBe("Soja");
  });

  it("mistura Milho+Soja prioriza Soja no preço", () => {
    const r = generateDiagnosticoReport(
      answers({ cultures: ["Milho", "Soja"] }),
    );
    expect(r.pricingCultureBasis).toBe("Soja");
  });

  it("só Milho usa preço do milho", () => {
    const r = generateDiagnosticoReport(answers({ cultures: ["Milho"] }));
    expect(r.pricingCultureBasis).toBe("Milho");
    expect(r.financialImpactRPerHa).toBe(
      financialImpactRPerHa(r.productiveLossScHa ?? 0, PRECO_SACA_MILHO_R),
    );
  });
});
