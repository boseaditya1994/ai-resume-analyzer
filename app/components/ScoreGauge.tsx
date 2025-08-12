import { useEffect, useRef, useState } from 'react';

interface ScoreGaugeProps {
  score?: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score = 75 }) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  // Clamp score between 0–100 for safety
  const safeScore = Math.min(Math.max(score, 0), 100);
  const percentage = safeScore / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={`Gauge showing score: ${safeScore} out of 100`}
      title={`Gauge showing score: ${safeScore} out of 100`}
    >
      <div className="relative w-40 h-20">
        <svg
          viewBox="0 0 100 50"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Foreground arc */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
          />
        </svg>

        {/* Score label */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pt-2"
          aria-hidden="true"
        >
          <div className="text-xl font-semibold pt-4">{safeScore}/100</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
