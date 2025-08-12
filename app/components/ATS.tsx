import React from 'react';

interface Suggestion {
  type: 'good' | 'improve';
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Accessibility: Generate semantic labels and aria descriptions
  const scoreLabel = `ATS Score: ${score} out of 100`;
  const scoreDescription =
    score > 69
      ? 'Your resume is highly optimized for Applicant Tracking Systems.'
      : score > 49
        ? 'Your resume is moderately optimized for ATS systems.'
        : 'Your resume needs improvements to pass ATS screening.';

  // Determine background gradient based on score
  const gradientClass =
    score > 69
      ? 'from-green-100'
      : score > 49
        ? 'from-yellow-100'
        : 'from-red-100';

  // Determine icon based on score
  const iconSrc =
    score > 69
      ? '/icons/ats-good.svg'
      : score > 49
        ? '/icons/ats-warning.svg'
        : '/icons/ats-bad.svg';

  // Determine subtitle based on score
  const subtitle =
    score > 69 ? 'Great Job!' : score > 49 ? 'Good Start' : 'Needs Improvement';

  return (
    <section
      className={`bg-gradient-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}
      aria-label="ATS Score Section"
    >
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={iconSrc}
          alt={subtitle}
          width={48}
          height={48}
          className="w-12 h-12"
          loading="lazy"
        />
        <div>
          <h2
            className="text-2xl font-bold"
            aria-label={scoreLabel}
            aria-describedby="ats-score-description"
          >
            ATS Score - {score}/100
          </h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
        <p id="ats-score-description" className="text-gray-600 mb-4">
          {scoreDescription}
        </p>

        {/* Suggestions list */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const isPositive = suggestion.type === 'good';
            return (
              <div
                key={index}
                className="flex items-start gap-3"
                role="listitem"
              >
                <img
                  src={isPositive ? '/icons/check.svg' : '/icons/warning.svg'}
                  alt={
                    isPositive
                      ? 'Positive suggestion'
                      : 'Improvement suggestion'
                  }
                  width={20}
                  height={20}
                  className="w-5 h-5 mt-1"
                  loading="lazy"
                />
                <p className={isPositive ? 'text-green-700' : 'text-amber-700'}>
                  {suggestion.tip}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing encouragement */}
      <p className="text-gray-700 italic">
        Keep refining your resume to improve your chances of getting past ATS
        filters and into the hands of recruiters.
      </p>
    </section>
  );
};

export default ATS;
