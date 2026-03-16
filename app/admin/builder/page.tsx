import { Suspense } from "react";
import { BuilderPageContent } from "@/components/builder/builder-page-content";

function BuilderFallback() {
  return (
    <div className="container mx-auto px-4 py-6">
      <p className="text-muted-foreground">Carregando…</p>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<BuilderFallback />}>
      <BuilderPageContent />
    </Suspense>
  );
}
