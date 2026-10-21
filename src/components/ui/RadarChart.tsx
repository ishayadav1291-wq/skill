import React from 'react';

export interface RadarPoint {
  axis: string;
  value: number; // 0 to 5
  target?: number;
  verified?: boolean;
}

interface RadarChartProps {
  data: RadarPoint[];
  size?: number;
  maxValue?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 320,
  maxValue = 5,
}) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-sm text-slate-400 py-8">No skill data available</div>;
  }

  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (2 * Math.PI) / data.length;

  // Concentric polygon grid levels (1, 2, 3, 4, 5)
  const levels = [1, 2, 3, 4, 5];

  // Helper to calculate coordinates
  const getCoordinates = (index: number, val: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (val / maxValue) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points for current skills
  const points = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.value);
      return `${x},${y}`;
    })
    .join(' ');

  // Polygon points for target skills (if present)
  const hasTargets = data.some((d) => d.target !== undefined);
  const targetPoints = hasTargets
    ? data
        .map((d, i) => {
          const { x, y } = getCoordinates(i, d.target || 0);
          return `${x},${y}`;
        })
        .join(' ')
    : '';

  return (
    <div className="flex flex-col items-center justify-center relative w-full overflow-hidden">
      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Background circular / polygonal grid */}
        {levels.map((lvl) => {
          const gridPoints = data
            .map((_, i) => {
              const { x, y } = getCoordinates(i, lvl);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={`grid-${lvl}`}
              points={gridPoints}
              fill={lvl % 2 === 0 ? 'rgba(241, 245, 249, 0.4)' : 'transparent'}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis spokes */}
        {data.map((_, i) => {
          const { x, y } = getCoordinates(i, maxValue);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#CBD5E1"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Target role requirement boundary (dashed outline) */}
        {hasTargets && (
          <polygon
            points={targetPoints}
            fill="rgba(242, 140, 40, 0.08)"
            stroke="#F28C28"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
        )}

        {/* Current user skill filled polygon */}
        <polygon
          points={points}
          fill="rgba(31, 78, 121, 0.35)"
          stroke="#1F4E79"
          strokeWidth="2.5"
          className="transition-all duration-500"
        />

        {/* Interactive Point circles */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, d.value);
          return (
            <g key={`point-${i}`}>
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill={d.verified ? '#2E8B57' : '#1F4E79'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Axis labels */}
        {data.map((d, i) => {
          const angle = indexToAngle(i, data.length);
          const labelDist = radius + 22;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          const textAnchor =
            Math.abs(Math.cos(angle)) < 0.25
              ? 'middle'
              : Math.cos(angle) > 0
              ? 'start'
              : 'end';

          return (
            <text
              key={`label-${i}`}
              x={lx}
              y={ly}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="text-[11px] font-semibold fill-slate-700"
            >
              {d.axis.length > 18 ? `${d.axis.slice(0, 16)}…` : d.axis}
              <tspan className="text-[10px] fill-slate-400 font-normal">
                {' '}
                (L{d.value})
              </tspan>
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#1F4E79]/80 inline-block border border-white shadow-sm" />
          <span>Current Level</span>
        </div>
        {hasTargets && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-100 border border-[#F28C28] inline-block" />
            <span>Target Level</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B57] inline-block" />
          <span>Quiz Verified</span>
        </div>
      </div>
    </div>
  );
};

function indexToAngle(index: number, total: number) {
  return (index * (2 * Math.PI)) / total - Math.PI / 2;
}
