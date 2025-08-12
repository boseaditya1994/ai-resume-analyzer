/**
 * PDF to Image Conversion Utility for CareerMind
 * ------------------------------------------------
 * Converts the first page of a PDF into a high-quality PNG image.
 * Optimized for performance, accessibility, and secure error handling.
 */

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: typeof import('pdfjs-dist') | null = null;
let loadPromise: Promise<typeof import('pdfjs-dist')> | null = null;

/**
 * Loads the PDF.js library dynamically (lazy-load to improve initial page speed)
 */
async function loadPdfJs(): Promise<typeof import('pdfjs-dist')> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  loadPromise = import('pdfjs-dist/build/pdf.mjs').then((lib) => {
    // Ensure worker is loaded from a trusted local path
    lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    pdfjsLib = lib;
    return lib;
  });

  return loadPromise;
}

/**
 * Converts the first page of a PDF to an image.
 * @param file PDF File to convert
 * @returns Promise<PdfConversionResult>
 */
export async function convertPdfToImage(
  file: File,
): Promise<PdfConversionResult> {
  if (!file || file.type !== 'application/pdf') {
    return {
      imageUrl: '',
      file: null,
      error: 'Invalid file type. Please upload a valid PDF.',
    };
  }

  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

    // We only process the first page for now
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 4 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
    }

    await page.render({ canvasContext: context!, viewport }).promise;

    return await new Promise<PdfConversionResult>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, '');
            const imageFile = new File([blob], `${originalName}.png`, {
              type: 'image/png',
            });

            const imageUrl = URL.createObjectURL(blob);

            resolve({
              imageUrl,
              file: imageFile,
            });

            // Optional: Release URL after a delay to free memory
            setTimeout(() => URL.revokeObjectURL(imageUrl), 60_000);
          } else {
            resolve({
              imageUrl: '',
              file: null,
              error: 'Image conversion failed: could not create blob.',
            });
          }
        },
        'image/png',
        1.0, // Maximum quality
      );
    });
  } catch (err) {
    console.error('PDF conversion error:', err);
    return {
      imageUrl: '',
      file: null,
      error: 'An error occurred while converting the PDF to an image.',
    };
  }
}
