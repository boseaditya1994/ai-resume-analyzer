interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = '';
  let badgeText = '';
  let badgeDescription = '';

  if (score > 70) {
    badgeColor = 'bg-badge-green text-green-600';
    badgeText = 'Strong';
    badgeDescription = 'This resume is performing at a strong level.';
  } else if (score > 49) {
    badgeColor = 'bg-badge-yellow text-yellow-600';
    badgeText = 'Good Start';
    badgeDescription =
      'This resume has potential and could improve with some refinements.';
  } else {
    badgeColor = 'bg-badge-red text-red-600';
    badgeText = 'Needs Work';
    badgeDescription =
      'This resume needs significant improvements to perform well.';
  }

  return (
    <div
      className={`px-3 py-1 rounded-full ${badgeColor}`}
      role="status"
      aria-label={badgeDescription}
      title={badgeDescription}
    >
      <span className="text-sm font-medium">{badgeText}</span>
    </div>
  );
};

export default ScoreBadge;
