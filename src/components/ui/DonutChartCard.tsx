import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "./ChartCard";
import { tooltipStyle } from "../../theme/chartColors";

export default function DonutChartCard({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <ChartCard
      title={title}
      legend={
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {data.map((d) => (
            <span key={d.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </span>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="85%" paddingAngle={2} stroke="none">
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [`${value}%`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
