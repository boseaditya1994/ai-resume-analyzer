import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from '../lib/utils';

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { 'application/pdf': ['.pdf'] },
      maxSize: maxFileSize,
    });

  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full gradient-border">
      <div
        {...getRootProps({
          role: 'button',
          tabIndex: 0,
          'aria-label': 'Upload PDF file',
        })}
      >
        {/* Hidden input for file selection */}
        <input {...getInputProps()} aria-hidden="true" />

        <div className="space-y-4 cursor-pointer">
          {file ? (
            // Selected file preview
            <div
              className="uploader-selected-file"
              role="group"
              aria-label={`Selected file: ${file.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/images/pdf.png"
                alt="PDF file icon"
                className="size-10"
              />
              <div className="flex items-center space-x-3">
                <div>
                  <p
                    className="text-sm font-medium text-gray-700 truncate max-w-xs"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 cursor-pointer"
                aria-label="Remove selected file"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect?.(null);
                }}
              >
                <img
                  src="/icons/cross.svg"
                  alt="Remove file"
                  className="w-4 h-4"
                />
              </button>
            </div>
          ) : (
            // Upload prompt
            <div className="text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img
                  src="/icons/info.svg"
                  alt="Upload file icon"
                  className="size-20"
                />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-lg text-gray-500">
                PDF (max {formatSize(maxFileSize)})
              </p>
              {isDragActive && (
                <p className="text-blue-600" role="status">
                  Drop your file here…
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
