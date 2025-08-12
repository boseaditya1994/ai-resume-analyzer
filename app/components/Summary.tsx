import ScoreGauge from '../components/ScoreGauge';
import ScoreBadge from '../components/ScoreBadge';

interface CategoryProps {
  title: string;
  score: number;
}

const Category: React.FC<CategoryProps> = ({ title, score }) => {
  const safeScore = Math.min(Math.max(score, 0), 100);
  const textColor =
    safeScore > 70
      ? 'text-green-600'
      : safeScore > 49
        ? 'text-yellow-600'
        : 'text-red-600';

  return (
    <div
      className="resume-summary px-4 py-2"
      role="group"
      aria-label={`${title} score: ${safeScore} out of 100`}
    >
      <div className="category flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-2xl font-medium">{title}</p>
          <ScoreBadge score={safeScore} />
        </div>
        <p className="text-2xl">
          <span className={textColor}>{safeScore}</span>
          <span className="sr-only"> out of 100</span>
          /100
        </p>
      </div>
    </div>
  );
};

interface SummaryProps {
  feedback: Feedback;
}

const Summary: React.FC<SummaryProps> = ({ feedback }) => {
  return (
    <section
      className="bg-white rounded-2xl shadow-md w-full"
      aria-labelledby="resume-score-heading"
    >
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={feedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 id="resume-score-heading" className="text-2xl font-bold">
            Your Resume Score
          </h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </section>
  );
};

export default Summary;
