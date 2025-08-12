import { usePuterStore } from '~/lib/puter';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export const meta = () => [
  {
    title: 'CareerMind Login | Continue Your Career Journey',
  },
  {
    name: 'description',
    content:
      'Sign in to CareerMind to access personalized job recommendations, application tracking, and career resources.',
  },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse `next` safely
  const params = new URLSearchParams(location.search);
  const next = params.get('next') || '/';

  // Redirect when already authenticated
  useEffect(() => {
    if (auth.isAuthenticated && next !== '/auth') {
      navigate(next);
    }
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main
      className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center"
      role="main"
    >
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10 max-w-lg w-full">
          {/* Headings */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to CareerMind — Your Partner in Career Growth
            </h1>
            <h2 className="text-lg text-gray-700 mt-4">
              Log In to Continue Your Job Journey
            </h2>
            <p className="text-gray-600 max-w-md mt-4">
              Access your personalized dashboard, and track resumes with
              CareerMind.
            </p>
          </div>

          {/* Auth buttons */}
          <div className="flex justify-center">
            {isLoading ? (
              <button
                className="auth-button animate-pulse"
                aria-label="Signing in, please wait"
                disabled
              >
                Signing you in...
              </button>
            ) : auth.isAuthenticated ? (
              <button
                className="auth-button"
                onClick={auth.signOut}
                aria-label="Log out of CareerMind"
              >
                Log Out
              </button>
            ) : (
              <button
                className="auth-button"
                onClick={auth.signIn}
                aria-label="Log in to CareerMind"
              >
                Log In
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
