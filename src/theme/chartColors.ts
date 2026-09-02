// Recharts renders to SVG and needs literal color strings for stroke/fill —
// keep these in sync with the CSS custom properties in src/index.css.
export const chartColors = {
  primary: "#C8102E", // accent
  accent: "#F04B5F", // accent-soft
  secondary: "#8F1025",
  muted: "#8B6870", // accent-muted
  border: "#F0DDE0", // card-border
  card: "#FFFFFF",
  positive: "#2E9B62",
  negative: "#D62839",
  warning: "#E9A23B",
  textPrimary: "#3B0A12",
};

export const tooltipStyle = {
  background: chartColors.card,
  border: `1px solid ${chartColors.border}`,
  borderRadius: 8,
  fontSize: 12,
  color: chartColors.textPrimary,
};
