import { cn } from '../lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from '../components/Accordion';

interface Tip {
  type: 'good' | 'improve';
  tip: string;
  explanation: string;
}

interface FeedbackCategory {
  score: number;
  tips: Tip[];
}

interface Feedback {
  toneAndStyle: FeedbackCategory;
  content: FeedbackCategory;
  structure: FeedbackCategory;
  skills: FeedbackCategory;
}

const ScoreBadge = ({ score }: { score: number }) => {
  const isHigh = score > 69;
  const isMedium = score > 39 && score <= 69;

  const badgeBg = isHigh
    ? 'bg-badge-green'
    : isMedium
      ? 'bg-badge-yellow'
      : 'bg-badge-red';

  const badgeText = isHigh
    ? 'text-badge-green-text'
    : isMedium
      ? 'text-badge-yellow-text'
      : 'text-badge-red-text';

  const iconSrc = isHigh ? '/icons/check.svg' : '/icons/warning.svg';
  const iconAlt = isHigh
    ? 'High score indicator'
    : isMedium
      ? 'Moderate score indicator'
      : 'Low score indicator';

  return (
    <div
      className={cn(
        'flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]',
        badgeBg,
      )}
      aria-label={`Score badge showing ${score} out of 100`}
    >
      <img
        src={iconSrc}
        alt={iconAlt}
        className="size-4"
        loading="lazy"
        decoding="async"
      />
      <p className={cn('text-sm font-medium', badgeText)}>{score}/100</p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => (
  <div className="flex flex-row gap-4 items-center py-2">
    <h3 className="text-2xl font-semibold">{title}</h3>
    <ScoreBadge score={categoryScore} />
  </div>
);

const CategoryContent = ({ tips }: { tips: Tip[] }) => (
  <div className="flex flex-col gap-4 items-center w-full">
    {/* Summary tips grid */}
    <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
      {tips.map((tip, index) => (
        <div
          className="flex flex-row gap-2 items-center"
          key={`${index}-summary`}
        >
          <img
            src={
              tip.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'
            }
            alt={tip.type === 'good' ? 'Positive tip' : 'Improvement tip'}
            className="size-5"
            loading="lazy"
            decoding="async"
          />
          <p className="text-xl text-gray-500">{tip.tip}</p>
        </div>
      ))}
    </div>

    {/* Detailed explanations */}
    <div className="flex flex-col gap-4 w-full">
      {tips.map((tip, index) => {
        const isGood = tip.type === 'good';
        return (
          <div
            key={`${index}-detail`}
            className={cn(
              'flex flex-col gap-2 rounded-2xl p-4',
              isGood
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-yellow-50 border border-yellow-200 text-yellow-700',
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
                src={isGood ? '/icons/check.svg' : '/icons/warning.svg'}
                alt={isGood ? 'Positive tip' : 'Improvement tip'}
                className="size-5"
                loading="lazy"
                decoding="async"
              />
              <p className="text-xl font-semibold">{tip.tip}</p>
            </div>
            <p>{tip.explanation}</p>
          </div>
        );
      })}
    </div>
  </div>
);

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <section
      className="flex flex-col gap-4 w-full"
      aria-label="Detailed resume feedback"
    >
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Details;
