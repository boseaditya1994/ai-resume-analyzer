import type { Route } from './+types/home';
import Navbar from '~/components/Navbar';
import ResumeCard from '~/components/ResumeCard';
import { usePuterStore } from '../lib/puter';
import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: 'CareerMind Dashboard | Track Applications & Resume Feedback',
    },
    {
      name: 'description',
      content:
        'Monitor your job applications, track resume ratings, and get AI-powered feedback with CareerMind. Improve your chances of landing your dream job.',
    },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated, navigate]);

  // Load resumes from storage
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      try {
        const resumesData = (await kv.list('resume:*', true)) as KVItem[];
        const parsedResumes = resumesData?.map(
          (resume) => JSON.parse(resume.value) as Resume,
        );
        setResumes(parsedResumes || []);
      } catch (error) {
        console.error('Error loading resumes:', error);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [kv]);

  return (
    <main
      className="bg-[url('/images/bg-main.svg')] bg-cover"
      role="main"
      aria-label="CareerMind Dashboard"
    >
      <Navbar />

      <section className="main-section">
        {/* Page Heading */}
        <div className="page-heading py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Track Your Applications & Resume Ratings
          </h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2 className="text-lg text-gray-700">
              No resumes found. Upload your first resume to get AI-powered
              feedback and improve your job prospects.
            </h2>
          ) : (
            <h2 className="text-lg text-gray-700">
              Review your submissions and check personalized, AI-powered resume
              insights.
            </h2>
          )}
        </div>

        {/* Loading Indicator */}
        {loadingResumes && (
          <div
            className="flex flex-col items-center justify-center"
            aria-busy="true"
            aria-label="Loading resumes"
          >
            <img
              src="/images/resume-scan-2.gif"
              alt="Scanning resumes animation"
              className="w-[200px]"
            />
          </div>
        )}

        {/* Resumes list */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section grid gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* No resumes uploaded */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
              aria-label="Upload your resume to CareerMind"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
