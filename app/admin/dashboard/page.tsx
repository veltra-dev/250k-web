import { getAdminDashboardMetrics } from "@/actions/admin-dashboard-metrics";
import { AdminDashboardCharts } from "@/components/admin/admin-dashboard-charts";

export default async function AdminDashboardPage() {
  const { leadsByDay, blogPostsByMonth } = await getAdminDashboardMetrics();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="container mx-auto max-w-6xl px-4 py-5">
        <h1 className="mb-2 text-2xl font-bold text-primary">Visão geral</h1>
        <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
          Resumo de leads do site e ritmo de publicação no blog. Use as outras
          seções para editar landings, listar leads e gerenciar conteúdo no
          Studio.
        </p>
        <AdminDashboardCharts
          leadsByDay={leadsByDay}
          blogPostsByMonth={blogPostsByMonth}
        />
      </div>
    </div>
  );
}
