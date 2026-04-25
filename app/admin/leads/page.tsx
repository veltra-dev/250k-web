import { AdminLeadsMock } from "@/components/admin/admin-leads-mock";

export default function AdminLeadsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex max-w-3xl flex-col gap-2">
          <h1 className="text-2xl font-bold text-primary">Leads</h1>
          <p className="text-muted-foreground">
            Captações pelo formulário de contato e pelo questionário. Abaixo,
            uma prévia de interface com dados fictícios para apresentação.
          </p>
        </div>
        <AdminLeadsMock />
      </div>
    </div>
  );
}
