import { renderPdfFromElement, RenderPdfProgress } from './renderPdf';

interface GeneratePDFParams {
  element: HTMLElement;
  patientName: string;
  onProgress?: (progress: RenderPdfProgress) => void;
}

export const generatePDF = async (params: GeneratePDFParams): Promise<void> => {
  const { element, patientName, onProgress } = params;
  if (!element) {
    throw new Error('Report preview element is not available yet.');
  }
  await renderPdfFromElement(element, patientName, onProgress);
};
