export const QUESTIONARIO_SESSION_KEY = "questionario_250k_v1";

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
  "Produtor",
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

export interface QuestionarioReport {
  reportType: string;
  reportText: string;
  highlights: string[];
}

export interface QuestionarioSessionPayload {
  version: 1;
  answers: QuestionarioAnswers;
  report: QuestionarioReport;
}

