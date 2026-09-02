import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "../../components/ui/PageHeader";
import ChartCard from "../../components/ui/ChartCard";
import DonutChartCard from "../../components/ui/DonutChartCard";
import { chartColors, tooltipStyle } from "../../theme/chartColors";
import { useProviderQuery } from "../../hooks/useProviderQuery";

export default function Reports() {
  const { data, isLoading } = useProviderQuery((p) => p.getReportsData());

  return (
    <div className="p-8">
      <PageHeader
        title="Reports"
        description="Platform performance summary and exportable reports."
        action={
          <button className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        }
      />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[104px] animate-pulse rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)]" />
            ))
          : data.summary.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5"
              >
                <p className="text-sm text-[var(--color-accent-muted)]">{s.label}</p>
                <p className="mt-3 text-2xl font-semibold text-[var(--color-text-primary)]">{s.value}</p>
                <p
                  className={[
                    "mt-2 text-xs font-medium",
                    s.trendDirection === "up" ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]",
                  ].join(" ")}
                >
                  {s.trend}
                </p>
              </div>
            ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <ChartCard title="Rides Overview">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.ridesOverview ?? []} margin={{ left: -10, right: 10 }}>
                <CartesianGrid stroke={chartColors.border} vertical={false} />
                <XAxis dataKey="day" stroke={chartColors.muted} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColors.muted} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="requested" fill={chartColors.border} radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <DonutChartCard title="Top Routes" data={data?.topRoutes ?? []} />
        <DonutChartCard title="Payment Methods" data={data?.paymentMethods ?? []} />
      </div>
    </div>
  );
}
