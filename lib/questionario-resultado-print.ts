import {
  DIAGNOSTICO_SECTION_KEYS,
  SECTION_TITLES_PT,
} from "@/components/questionario/diagnostico-engine";
import type { QuestionarioSessionPayload } from "@/components/questionario/questionario-types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function splitParagraphs(text: string): string[] {
  return text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

function buildReportHtmlBody(payload: QuestionarioSessionPayload): string {
  if (payload.report.sections) {
    return DIAGNOSTICO_SECTION_KEYS.map((key) => {
      const title = SECTION_TITLES_PT[key];
      const body = escapeHtml(payload.report.sections![key]);
      return `<h2>${escapeHtml(title)}</h2><p>${body}</p>`;
    }).join("");
  }
  const paragraphs = splitParagraphs(payload.report.reportText);
  return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
}

function buildMetricsLine(payload: QuestionarioSessionPayload): string {
  const { report } = payload;
  if (
    report.producerTier == null ||
    report.productiveLossScHa == null ||
    report.financialImpactRPerHa == null
  ) {
    return "";
  }
  const money = report.financialImpactRPerHa.toLocaleString("pt-BR");
  let line = `${report.producerTier} · Estimativa: ${report.productiveLossScHa} sc/ha (~R$ ${money}/ha)`;
  if (report.pricingCultureBasis === "Referência_soja") {
    line +=
      " — referência em saca de soja para culturas fora da tabela do manual";
  }
  return `<p class="metrics">${escapeHtml(line)}</p>`;
}

/**
 * Opens a minimal same-origin document and prints it. Avoids Chrome PDF bugs with
 * the main app DOM (visibility, overflow, theme tokens, etc.).
 */
export function printQuestionarioResultado(
  payload: QuestionarioSessionPayload,
): void {
  const win = window.open("", "_blank");
  if (!win) {
    window.alert(
      "Não foi possível abrir a janela de impressão. Permita pop-ups para este site e tente de novo.",
    );
    return;
  }

  const logoUrl = `${window.location.origin}/web-app-manifest-512x512.png`;
  const farmLine = `${payload.answers.farmName} - ${payload.answers.municipality}`;

  const listItems = payload.report.highlights
    .map((h) => `<li>${escapeHtml(h)}</li>`)
    .join("");

  const metricsLine = buildMetricsLine(payload);
  const reportInner = buildReportHtmlBody(payload);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(payload.report.reportType)} – 250K</title>
<style>
  @page { margin: 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #1a1a1a;
    background: #fff;
    margin: 0;
    padding: 10mm 12mm;
    font-size: 11pt;
    line-height: 1.45;
  }
  .kicker {
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 8.5pt;
    color: #555;
    margin: 0 0 0.35em;
  }
  h1 {
    font-size: 17pt;
    line-height: 1.2;
    margin: 0 0 0.35em;
    color: #22352d;
  }
  .farm {
    color: #333;
    margin: 0 0 0.65em;
    font-size: 10.5pt;
  }
  .metrics {
    margin: 0 0 1.1em;
    font-size: 10pt;
    color: #333;
    line-height: 1.35;
  }
  h2 {
    font-size: 10.5pt;
    margin: 0 0 0.45em;
    color: #22352d;
  }
  ul { margin: 0 0 1em; padding-left: 1.2em; }
  li { margin: 0.2em 0; font-size: 10.5pt; }
  .report p { margin: 0 0 0.55em; font-size: 10.5pt; color: #333; }
  .footer {
    margin-top: 1.25em;
    padding-top: 0.65em;
    border-top: 1px solid #d4d4d4;
    text-align: center;
  }
  .footer img { width: 40px; height: 40px; object-fit: contain; vertical-align: middle; }
  .tagline { font-size: 9.5pt; color: #555; margin: 0.4em 0 0; }
</style>
</head>
<body>
  <p class="kicker">Resultado do questionário</p>
  <h1>Tipo de Resposta: ${escapeHtml(payload.report.reportType)}</h1>
  <p class="farm">${escapeHtml(farmLine)}</p>
  ${metricsLine}
  <h2>Pontos-chave</h2>
  <ul>${listItems}</ul>
  <div class="report">${reportInner}</div>
  <div class="footer">
    <img src="${logoUrl}" alt="Logo 250K" width="40" height="40" />
    <p class="tagline">Anamnese para Alta Produtividade - 250K</p>
  </div>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();

  let printed = false;
  const runPrint = () => {
    if (printed) return;
    printed = true;
    win.focus();
    win.print();
    win.addEventListener("afterprint", () => win.close(), { once: true });
  };

  const img = win.document.querySelector("img");
  if (img) {
    if (img.complete) {
      runPrint();
    } else {
      img.addEventListener("load", runPrint, { once: true });
      img.addEventListener("error", runPrint, { once: true });
      window.setTimeout(runPrint, 2000);
    }
  } else {
    runPrint();
  }
}
