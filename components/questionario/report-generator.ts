import type { QuestionarioAnswers, QuestionarioReport } from "./questionario-types";
import { generateDiagnosticoReport } from "./diagnostico-engine";

export { generateDiagnosticoReport } from "./diagnostico-engine";

export function generateGenericReport(
  answers: QuestionarioAnswers,
): QuestionarioReport {
  return generateDiagnosticoReport(answers);
}
