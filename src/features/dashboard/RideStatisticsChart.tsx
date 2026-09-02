import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../../components/ui/ChartCard";
import { chartColors, tooltipStyle } from "../../theme/chartColors";

export default function RideStatisticsChart({
  data,
}: {
  data: { day: string; completed: number; requested: number }[];
}) {
  return (
    <ChartCard
      title="Ride Statistics"
      legend={
        <>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors.primary }} />
            Completed
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors.muted }} />
            Requested
          </span>
        </>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -10, right: 10 }}>
          <CartesianGrid stroke={chartColors.border} vertical={false} />
          <XAxis dataKey="day" stroke={chartColors.muted} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            stroke={chartColors.muted}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v === 0 ? "0" : v >= 1000 ? `${v / 1000}k` : v)}
          />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: chartColors.textPrimary }} />
          <Line type="monotone" dataKey="requested" stroke={chartColors.muted} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="completed" stroke={chartColors.primary} strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
