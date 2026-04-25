"use client";

import type {
  DashboardDayPoint,
  DashboardMonthPoint,
} from "@/actions/admin-dashboard-metrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BAR_FILL = "hsl(var(--primary))";
const BAR_FILL_SECONDARY = "hsl(150 16% 38%)";

const MOCK_BLOG_VIEWS_BY_DAY = Array.from({ length: 14 }, (_, i) => ({
  label: `D${i + 1}`,
  views: Math.round(240 + Math.sin(i / 2.2) * 95 + (i % 5) * 28 + i * 6),
}));

const MOCK_VIEWS_GRADIENT_ID = "admin-dashboard-mock-views-fill";

type Props = {
  leadsByDay: DashboardDayPoint[];
  blogPostsByMonth: DashboardMonthPoint[];
};

export function AdminDashboardCharts({ leadsByDay, blogPostsByMonth }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Captura de leads</CardTitle>
          <CardDescription>
            Envios do formulário de contato — últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[220px] min-h-0 sm:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={leadsByDay}
              margin={{ left: 4, right: 8, top: 8, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval={4}
                angle={-30}
                textAnchor="end"
                height={52}
              />
              <YAxis allowDecimals={false} width={36} tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
                formatter={(value: number) => [value, "Leads"]}
              />
              <Bar
                dataKey="leads"
                name="Leads"
                fill={BAR_FILL}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publicações no blog</CardTitle>
          <CardDescription>
            Posts com data de publicação — últimos 6 meses (Sanity)
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[220px] min-h-0 sm:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={blogPostsByMonth}
              margin={{ left: 4, right: 8, top: 8, bottom: 28 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} width={36} tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
                formatter={(value: number) => [value, "Posts"]}
              />
              <Bar
                dataKey="posts"
                name="Posts"
                fill={BAR_FILL_SECONDARY}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Visualizações nas publicações</CardTitle>
          <CardDescription>
            Dados de exemplo (blog) — substitua por Plausible, GA4 ou API
            própria quando estiver disponível.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[220px] min-h-0 sm:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MOCK_BLOG_VIEWS_BY_DAY}
              margin={{ left: 4, right: 8, top: 8, bottom: 8 }}
            >
              <defs>
                <linearGradient id={MOCK_VIEWS_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={2} height={28} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
                formatter={(value: number) => [value, "Visualizações (mock)"]}
              />
              <Area
                type="monotone"
                dataKey="views"
                name="Visualizações"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill={`url(#${MOCK_VIEWS_GRADIENT_ID})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
