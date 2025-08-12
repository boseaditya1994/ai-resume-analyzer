import { Link } from 'react-router';
import ScoreCircle from '~/components/ScoreCircle';
import { useEffect, useState } from 'react';
import { usePuterStore } from '~/lib/puter';

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: ResumeCardProps) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadResume = async () => {
      try {
        const blob = await fs.read(imagePath);
        if (blob && isMounted) {
          const url = URL.createObjectURL(blob);
          setResumeUrl(url);
        }
      } catch (error) {
        console.error('Error loading resume preview:', error);
      }
    };
    loadResume();

    return () => {
      isMounted = false;
    };
  }, [fs, imagePath]);

  const displayTitle = companyName || 'Resume';
  const displaySubtitle = jobTitle || '';

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label={`View resume for ${companyName || 'Unnamed candidate'}`}
    >
      <article className="resume-card-header" role="group">
        <header className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words">{displayTitle}</h2>
          {displaySubtitle && (
            <p className="text-lg break-words text-gray-500">
              {displaySubtitle}
            </p>
          )}
        </header>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </article>

      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt={`Preview of ${companyName || 'resume'}`}
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
