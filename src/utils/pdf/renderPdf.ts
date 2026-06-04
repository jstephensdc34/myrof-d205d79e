import html2pdf from 'html2pdf.js';

export interface RenderPdfProgress {
  status: 'preparing' | 'rendering' | 'generating' | 'finalizing' | 'complete';
  percentage: number;
}

/**
 * Render a PDF directly from a live DOM element using html2pdf.js.
 * This preserves Tailwind CSS, grid layouts, and applies CSS page breaks.
 */
export const renderPdfFromElement = async (
  element: HTMLElement,
  patientName: string,
  onProgress?: (progress: RenderPdfProgress) => void
): Promise<void> => {
  onProgress?.({ status: 'preparing', percentage: 10 });

  // Ensure all images inside are loaded before rendering
  const imgs = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) return resolve();
          img.onload = () => resolve();
          img.onerror = () => {
            img.src = '/placeholder.svg';
            resolve();
          };
        })
    )
  );

  onProgress?.({ status: 'rendering', percentage: 30 });

  const cleanPatientName = patientName.replace(/[^a-zA-Z0-9]/g, '_') || 'Patient';
  const filename = `${cleanPatientName}_Report_${new Date().toISOString().split('T')[0]}.pdf`;

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
    pagebreak: { mode: ['css', 'legacy'], avoid: ['.item-card', '.pdf-avoid-break'] },
  };

  try {
    onProgress?.({ status: 'generating', percentage: 60 });
    await html2pdf().set(opt).from(element).save();
    onProgress?.({ status: 'finalizing', percentage: 95 });
    onProgress?.({ status: 'complete', percentage: 100 });
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error instanceof Error ? error : new Error('Failed to generate PDF');
  }
};
