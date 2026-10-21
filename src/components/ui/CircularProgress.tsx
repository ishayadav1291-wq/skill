import React from 'react';

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
  showPercent?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 140,
  strokeWidth = 12,
  label,
  subLabel,
  showPercent = true,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  // Determine color based on blueprint thresholds
  let color = '#2E8B57'; // Green (have/ready)
  if (clampedValue < 45) {
    color = '#C0392B'; // Red (missing / early stage)
  } else if (clampedValue < 75) {
    color = '#F28C28'; // Orange (partial / in progress)
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Central content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
        {showPercent && (
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {clampedValue}%
          </span>
        )}
        {label && <span className="text-xs font-semibold text-slate-600 mt-0.5">{label}</span>}
        {subLabel && <span className="text-[10px] text-slate-400">{subLabel}</span>}
      </div>
    </div>
  );
};
