import type { Route } from './+types/upload';
import { type FormEvent, useState } from 'react';
import Navbar from '~/components/Navbar';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '../lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '../lib/pdf2img';
import { generateUUID } from '../lib/utils';
import { prepareInstructions } from '../../constants';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Upload Resume - Careermind' },
    {
      name: 'description',
      content:
        'Upload your resume to get an AI-powered ATS score and tailored improvement tips for your dream job.',
    },
    {
      name: 'keywords',
      content: 'resume upload, AI resume feedback, ATS score, job application',
    },
  ];
}

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText('Uploading the file...');
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText('Error: Failed to upload file');

    setStatusText('Converting to image...');
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatusText('Error: Failed to convert PDF to image');

    setStatusText('Uploading the image...');
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText('Error: Failed to upload image');

    setStatusText('Preparing data...');
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      jobDescription: jobDescription.trim(),
      feedback: '',
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText('Analyzing...');
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription }),
    );
    if (!feedback) return setStatusText('Error: Failed to analyze resume');

    const feedbackText =
      typeof feedback.message.content === 'string'
        ? feedback.message.content
        : feedback.message.content[0].text;

    try {
      data.feedback = JSON.parse(feedbackText);
    } catch {
      data.feedback = feedbackText;
    }

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText('Analysis complete, redirecting...');
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover" role="main">
      <Navbar />

      <section className="main-section" aria-labelledby="page-title">
        <div className="page-heading py-16">
          <h1 id="page-title">Smart Feedback for Your Dream Job</h1>

          {isProcessing ? (
            <>
              <p aria-live="polite">{statusText}</p>
              <img
                src="/images/resume-scan.gif"
                className="w-full"
                alt="Scanning resume animation"
                loading="lazy"
              />
            </>
          ) : (
            <h2 className="text-lg">
              Drop your resume for an ATS score and improvement tips
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
              aria-describedby="form-help"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={isProcessing}
              >
                Analyze Resume
              </button>

              <p id="form-help" className="sr-only">
                Fill out the form and upload your resume to receive AI-powered
                feedback.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
