import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import type { Route } from './+types/root';
import './app.css';
import { usePuterStore } from '../app/lib/puter';
import { useEffect } from 'react';

export const links: Route.LinksFunction = () => [
  { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
  { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function meta() {
  return [
    { title: 'CareerMind | Your Job Growth Companion' },
    {
      name: 'description',
      content:
        'CareerMind helps you optimize your career journey with resume reviews, ATS insights, and professional growth tools.',
    },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charSet: 'utf-8' },
    { name: 'robots', content: 'index, follow' },
    // Open Graph
    { property: 'og:title', content: 'CareerMind' },
    {
      property: 'og:description',
      content:
        'Get resume feedback, ATS scoring, and personalized career insights.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://careermind.com' },
    { property: 'og:image', content: '/images/careermind-og.jpg' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'CareerMind' },
    {
      name: 'twitter:description',
      content:
        'CareerMind helps you optimize your career journey with smart resume feedback.',
    },
    { name: 'twitter:image', content: '/images/careermind-og.jpg' },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { init } = usePuterStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <html lang="en" dir="ltr">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {/* Safer external script loading */}
        <script
          src="https://js.puter.com/v2/"
          async
          // integrity attribute is example only — replace with real SRI hash
          integrity="sha384-abc123"
          crossOrigin="anonymous"
        ></script>

        <div id="app-root" role="main">
          {children}
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'Something went wrong on CareerMind';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404 - Page Not Found' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main
      className="pt-16 p-4 container mx-auto"
      role="alert"
      aria-live="assertive"
    >
      <h1 className="text-2xl font-bold">{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-gray-100 text-sm rounded-md">
          <code>{stack}</code>
        </pre>
      )}
      <a
        href="/"
        className="text-blue-600 underline mt-4 inline-block"
        aria-label="Return to the homepage"
      >
        Go back to Homepage
      </a>
    </main>
  );
}
