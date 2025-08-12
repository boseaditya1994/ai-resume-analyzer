import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { usePuterStore } from '../lib/puter';
import Summary from '~/components/Summary';
import ATS from '~/components/ATS';
import Details from '~/components/Details';

// SEO metadata
export const meta = () => [
  { title: 'Careermind | Resume Review & ATS Analysis' },
  {
    name: 'description',
    content:
      'Get a detailed, AI-powered review of your resume, including ATS score, recruiter tips, and actionable feedback for your next career move.',
  },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${encodeURIComponent(id || '')}`);
    }
  }, [isLoading, auth.isAuthenticated, id, navigate]);

  // Fetch resume data
  useEffect(() => {
    const loadResume = async () => {
      const resumeData = await kv.get(`resume:${id}`);
      if (!resumeData) return;

      const data = JSON.parse(resumeData);

      // Resume PDF
      const resumeBlob = await fs.read(data.resumePath);
      if (resumeBlob) {
        const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
        setResumeUrl(URL.createObjectURL(pdfBlob));
      }

      // Resume preview image
      const imageBlob = await fs.read(data.imagePath);
      if (imageBlob) {
        setImageUrl(URL.createObjectURL(imageBlob));
      }

      setFeedback(data.feedback || null);
    };

    loadResume();
  }, [id, fs, kv]);

  return (
    <main className="!pt-0">
      {/* Accessible nav back link */}
      <nav className="resume-nav" aria-label="Back navigation">
        <Link to="/" className="back-button" aria-label="Go back to homepage">
          <img
            src="/icons/back.svg"
            alt=""
            className="w-2.5 h-2.5"
            aria-hidden="true"
          />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* Resume preview section */}
        <section
          className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 flex items-center justify-center"
          aria-label="Resume preview"
        >
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open full resume in new tab"
              >
                <img
                  src={imageUrl}
                  alt="Preview of your uploaded resume"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </a>
            </div>
          )}
        </section>

        {/* Feedback & ATS analysis section */}
        <section
          className="feedback-section"
          aria-label="Resume feedback and ATS analysis"
        >
          <h1 className="text-4xl !text-black font-bold mb-4">Resume Review</h1>
          {feedback ? (
            <div
              className="flex flex-col gap-8 animate-in fade-in duration-1000"
              role="region"
              aria-live="polite"
            >
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS?.score || 0}
                suggestions={feedback.ATS?.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex justify-center">
              <img
                src="/images/resume-scan-2.gif"
                alt="Loading resume analysis..."
                className="w-full max-w-md"
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
