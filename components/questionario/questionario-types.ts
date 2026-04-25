export const QUESTIONARIO_SESSION_KEY = "questionario_250k_v1";

/** Lead parcial (início do questionário) para recuperação se o usuário abandonar o fluxo. */
export const QUESTIONARIO_LEAD_PARTIAL_KEY = "questionario_250k_lead_partial_v1";

export interface QuestionarioLeadPartialPayload {
  version: 1;
  clientName: string;
  whatsapp: string;
  email: string;
  savedAt: string;
  stepIndex: number;
}

export const cultureOptions = [
  "Milho",
  "Soja",
  "Algodão",
  "Feijão",
  "Arroz",
  "Gergelim",
] as const;
export type Culture = (typeof cultureOptions)[number];

export const decisionMakerOptions = [
  "Eu",
  "Gerente",
  "Consultor",
  "Grupo familiar",
  "Outros",
] as const;
export type DecisionMaker = (typeof decisionMakerOptions)[number];

export const gargaloOptions = [
  "Fertilidade/Calagem",
  "Compactação",
  "Nematoides",
  "Falha de estande",
  "Custo alto de adubo",
  "Baixa produtividade",
  "Não sabe exatamente",
] as const;
export type Gargalo = (typeof gargaloOptions)[number];

export const impactoOptions = [
  "Produtividade",
  "Custo",
  "Operação",
  "Utilizar da Tecnologia",
  "Todos",
] as const;
export type GargaloImpacto = (typeof impactoOptions)[number];

export const tentouResolverOptions = [
  "Sim e não funcionou",
  "Sim e funcionou parcialmente",
  "Nunca tratou de forma técnica",
] as const;
export type TentouResolver = (typeof tentouResolverOptions)[number];

export const amostragemOptions = [
  "Não",
  "Sim – malha maior que 10 ha",
  "Sim – malha entre 5–10 ha",
  "Sim – malha menor que 5 ha",
] as const;
export type Amostragem = (typeof amostragemOptions)[number];

export const taxaVariavelOptions = [
  "Não",
  "Apenas calcário",
  "Calcário + KCl",
  "Múltiplos nutrientes",
  "Semente",
] as const;
export type TaxaVariavel = (typeof taxaVariavelOptions)[number];

export const historicoOrganizadoOptions = [
  "Não",
  "Parcial",
  "Sim, organizado",
] as const;
export type HistoricoOrganizado = (typeof historicoOrganizadoOptions)[number];

export const ajustarManejoOptions = [
  "Sim",
  "Depende do custo",
  "Não sei",
] as const;
export type AjustarManejo = (typeof ajustarManejoOptions)[number];

export const urgenciaOptions = [
  "Sim",
  "Próxima safra",
  "Só avaliando",
] as const;
export type Urgencia = (typeof urgenciaOptions)[number];

export interface QuestionarioAnswers {
  farmName: string;
  municipality: string;
  totalAreaHa: number;
  cultures: Culture[];
  decisionMaker: DecisionMaker;
  otherDecisionMaker?: string;

  mainBottleneck: Gargalo;
  mainBottleneckImpact: GargaloImpacto;
  triedBefore: TentouResolver;

  georeferencedSampling: Amostragem;
  variableRate: TaxaVariavel;
  organizedHistory: HistoricoOrganizado;
  willingAdjustManagement: AjustarManejo;
  urgencyToResolve: Urgencia;

  clientName: string;
  whatsapp: string;
  email: string;
}

export type ProducerTier =
  | "Fundação Produtiva"
  | "Desenvolvimento Técnico"
  | "Eficiência Produtiva"
  | "Alta Performance";


export interface DiagnosticoReportSections {
  diagnosis: string;
  mainPain: string;
  productiveImpact: string;
  financialImpact: string;
  opportunity: string;
  solution: string;
  nextStep: string;
}

export interface QuestionarioReport {
  reportType: string;
  /** Legacy flat text; mirrors sections when present for print/session fallback. */
  reportText: string;
  highlights: string[];

  producerTier?: ProducerTier;
  /** Single dominant pain title aligned with manuals (one primary issue). */
  dominantPain?: string;
  /**
   * Estimated productive loss (sc/ha). Manual bands: ~10 moderate, ~20 high, up to ~40 critical.
   */
  productiveLossScHa?: number;
  /** R$/ha from productiveLossScHa × price per saca / ha (already per ha). */
  financialImpactRPerHa?: number;
  /**
   * Culture basis for R$/sc: Soja R$120/sc, Milho R$60/sc (manual).
   * Other cultures: saca de soja used as comparable reference (documented in financial copy).
   */
  pricingCultureBasis?: "Soja" | "Milho" | "Referência_soja";
  /** Optional scale of total farm exposure (R$/ha × área). */
  farmTotalLossRApprox?: number;
  sections?: DiagnosticoReportSections;
}

export interface QuestionarioSessionPayload {
  version: 1 | 2;
  answers: QuestionarioAnswers;
  report: QuestionarioReport;
}

