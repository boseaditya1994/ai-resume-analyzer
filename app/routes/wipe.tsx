import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { usePuterStore } from '../lib/puter';

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  // Load files from the root directory
  const loadFiles = async () => {
    try {
      const filesList = (await fs.readDir('./')) as FSItem[];
      setFiles(filesList);
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate('/auth?next=/wipe');
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  // Delete all files and flush KV storage
  const handleDelete = async () => {
    try {
      await Promise.all(files.map((file) => fs.delete(file.path)));
      await kv.flush();
      await loadFiles();
      navigate('/');
    } catch (err) {
      console.error('Error wiping app data:', err);
    }
  };

  if (isLoading) {
    return (
      <div role="status" aria-live="polite" className="p-4">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Wipe Application Data
        </h1>
        <p className="text-sm text-gray-600">
          Authenticated as:{' '}
          <span className="font-semibold">{auth.user?.username}</span>
        </p>
      </header>

      <section aria-labelledby="existing-files-section" className="mb-6">
        <h2
          id="existing-files-section"
          className="text-xl font-semibold text-gray-700 mb-2"
        >
          Existing Files
        </h2>
        {files.length > 0 ? (
          <ul className="space-y-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="p-2 border rounded bg-white shadow-sm"
              >
                <p className="text-gray-800">{file.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No files found.</p>
        )}
      </section>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        onClick={handleDelete}
        aria-label="Delete all application data"
      >
        Wipe App Data
      </button>
    </main>
  );
};

export default WipeApp;
