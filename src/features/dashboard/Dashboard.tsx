import { useState } from "react";
import { Users, Car, User, CheckCircle2, CalendarDays, CreditCard } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import DateRangeToggle, { type DateRangeValue } from "../../components/ui/DateRangeToggle";
import RideStatisticsChart from "./RideStatisticsChart";
import RevenueChart from "./RevenueChart";
import { useProviderQuery } from "../../hooks/useProviderQuery";

// The provider returns stat cards without an icon (icons are a UI
// concern, not data) — map by label to keep StatCard's existing props.
const ICONS: Record<string, typeof Users> = {
  "Total Users": Users,
  "Active Riders": Car,
  "Active Passengers": User,
  "Completed Rides": CheckCircle2,
  "Today's Rides": CalendarDays,
  "Total Revenue": CreditCard,
};

export default function Dashboard() {
  const [range, setRange] = useState<DateRangeValue>("Today");
  const { data, isLoading } = useProviderQuery((p) => p.getDashboardData(range), [range]);

  return (
    <div className="p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-[var(--color-accent-muted)]">
            Real-time platform metrics and performance data.
          </p>
        </div>
        <DateRangeToggle active={range} onChange={setRange} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {isLoading || !data
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[122px] animate-pulse rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)]" />
            ))
          : data.statCards.map((card) => (
              <StatCard key={card.label} {...card} icon={ICONS[card.label] ?? Users} />
            ))}
      </div>

      <div className="mt-6 flex flex-col gap-6 xl:flex-row">
        <RideStatisticsChart data={data?.rideStatistics ?? []} />
        <RevenueChart data={data?.revenueOverview ?? []} />
      </div>
    </div>
  );
}
