import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../../components/ui/ChartCard";
import { chartColors, tooltipStyle } from "../../theme/chartColors";

export default function RevenueChart({
  data,
}: {
  data: { month: string; revenue: number }[];
}) {
  return (
    <ChartCard title="Revenue Overview">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -10, right: 10 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.35} />
              <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.border} vertical={false} />
          <XAxis dataKey="month" stroke={chartColors.muted} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            stroke={chartColors.muted}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v === 0 ? "$0" : v >= 1000 ? `$${v / 1000}k` : `$${v}`)}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: chartColors.textPrimary }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke={chartColors.primary} strokeWidth={2.5} fill="url(#revenueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
