import type {
  AjustarManejo,
  Amostragem,
  Gargalo,
  GargaloImpacto,
  HistoricoOrganizado,
  QuestionarioAnswers,
  QuestionarioReport,
  TaxaVariavel,
  TentouResolver,
  Urgencia,
} from "./questionario-types";

function getReportType(mainBottleneck: Gargalo): string {
  switch (mainBottleneck) {
    case "Fertilidade/Calagem":
      return "Plano de Fertilidade e Calagem";
    case "Compactação":
      return "Plano de Estrutura do Solo e Compactação";
    case "Nematoides":
      return "Plano de Manejo Fitossanitário (Nematoides)";
    case "Falha de estande":
      return "Plano de Implantação e Falhas de Estande";
    case "Custo alto de adubo":
      return "Plano de Eficiência de Insumos";
    case "Baixa produtividade":
      return "Plano de Recuperação de Produtividade";
    case "Não sabe exatamente":
      return "Plano de Diagnóstico Estratégico";
    default: {
      const _exhaustive: never = mainBottleneck;
      return String(_exhaustive);
    }
  }
}

function getUrgencyTone(urgency: Urgencia): string {
  switch (urgency) {
    case "Sim":
      return "prioridade imediata para destravar resultados ainda nesta safra";
    case "Próxima safra":
      return "planejamento estruturado para execução na próxima safra";
    case "Só avaliando":
      return "etapa de diagnóstico e simulação para reduzir incertezas antes de investir";
    default: {
      const _exhaustive: never = urgency;
      return String(_exhaustive);
    }
  }
}

function getMaturitySignals(params: {
  georeferencedSampling: Amostragem;
  variableRate: TaxaVariavel;
  organizedHistory: HistoricoOrganizado;
}): string[] {
  const { georeferencedSampling, variableRate, organizedHistory } = params;
  const signals: string[] = [];

  if (georeferencedSampling === "Não") {
    signals.push("começar por amostragem que permita zoneamento operacional");
  } else {
    signals.push("usar o zoneamento para guiar decisões de manejo");
  }

  if (variableRate === "Não") {
    signals.push("definir uma estratégia de taxa variável para reduzir desperdícios");
  } else {
    signals.push("evoluir a taxa variável conforme resposta do talhão e histórico");
  }

  if (organizedHistory === "Não") {
    signals.push("organizar mapas e análises para fechar o ciclo de decisão");
  } else if (organizedHistory === "Parcial") {
    signals.push("completar padronização de registros (mapas, metas e resultados)");
  } else {
    signals.push("manter governança de dados para comparar safras e decisões");
  }

  return signals;
}

function getGeneralHighlights(answers: QuestionarioAnswers): string[] {
  const highlights: string[] = [];

  highlights.push(`foco principal no gargalo: ${answers.mainBottleneck}`);

  if (answers.mainBottleneckImpact !== "Todos") {
    highlights.push(`impacto mais relevante: ${answers.mainBottleneckImpact}`);
  }

  const maturitySignals = getMaturitySignals({
    georeferencedSampling: answers.georeferencedSampling,
    variableRate: answers.variableRate,
    organizedHistory: answers.organizedHistory,
  });
  highlights.push(...maturitySignals);

  const adjustTone = getAdjustTone(answers.willingAdjustManagement);
  highlights.push(adjustTone);

  return highlights;
}

function getAdjustTone(adjust: AjustarManejo): string {
  switch (adjust) {
    case "Sim":
      return "conduta recomendada: executar ajustes com governança e medir resposta por talhão";
    case "Depende do custo":
      return "conduta recomendada: priorizar ações por custo-benefício e construir ROI com dados";
    case "Não sei":
      return "conduta recomendada: iniciar com diagnóstico mínimo viável e simular cenários antes de comprometer orçamento";
    default: {
      const _exhaustive: never = adjust;
      return String(_exhaustive);
    }
  }
}

function getExecutionHints(params: {
  triedBefore: TentouResolver;
  urgencyToResolve: Urgencia;
  mainBottleneck: Gargalo;
}): string {
  const { triedBefore, urgencyToResolve, mainBottleneck } = params;

  const urgencyTone = getUrgencyTone(urgencyToResolve);

  if (triedBefore === "Nunca tratou de forma técnica") {
    return `Como não houve um tratamento técnico estruturado, a abordagem recomendada é começar com um plano de execução claro e mensurável (${urgencyTone}). Para ${mainBottleneck}, o foco é evitar tentativa-e-erro e priorizar variáveis que controlam a resposta.`;
  }

  if (triedBefore === "Sim e não funcionou") {
    return `Como já houve tentativa e não houve resultado, o plano deve trocar a lógica de decisão: reduzir dispersão, revisar hipóteses e ajustar o desenho de amostragem/monitoramento (${urgencyTone}). Para ${mainBottleneck}, o objetivo é corrigir causa raiz e validar com métricas.`;
  }

  return `Como houve resultado parcial, o próximo passo é aprofundar o diagnóstico e calibrar o manejo para ganhar previsibilidade (${urgencyTone}). Para ${mainBottleneck}, recomenda-se uma sequência de melhoria contínua com registros e comparação de safras.`;
}

function getReportText(answers: QuestionarioAnswers, reportType: string): string {
  const { farmName, municipality } = answers;

  const execution = getExecutionHints({
    triedBefore: answers.triedBefore,
    urgencyToResolve: answers.urgencyToResolve,
    mainBottleneck: answers.mainBottleneck,
  });

  return [
    `Relatório genérico de produtividade para a fazenda ${farmName} (${municipality}).`,
    `Tipo de resposta: ${reportType}.`,
    "",
    `Resumo executivo: ${execution}`,
    "",
    "Recomendações gerais:",
    "- Transformar diagnóstico em plano de ação por talhão.",
    "- Priorizar decisões mensuráveis e rastreáveis (mapas + análises + resultados).",
    "- Operacionalizar a melhoria em ciclos curtos (medir, ajustar, validar).",
  ].join("\n");
}

export function generateGenericReport(
  answers: QuestionarioAnswers,
): QuestionarioReport {
  const reportType = getReportType(answers.mainBottleneck);

  const highlights = getGeneralHighlights(answers);

  return {
    reportType,
    reportText: getReportText(answers, reportType),
    highlights,
  };
}

