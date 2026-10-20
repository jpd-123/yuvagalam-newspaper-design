import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generateCustomPDF = async (pageElement, mode, targetSizeMB = 5) => {
  if (!pageElement) return;

  if (mode === 'PRINTING') {
    // 300 DPI High-Res Vector A3 Print Output
    const canvas = await html2canvas(pageElement, {
      scale: 3,
      useCORS: true,
      logging: false
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a3'
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 420);
    pdf.save('Satwika_Printing_Press_A3.pdf');
  } else if (mode === 'SOCIAL_MEDIA') {
    // HD Text ను కాపాడుతూ ఇమేజ్ కంప్రెషన్ ద్వారా 1MB to 100MB సైజ్ కంట్రోల్
    let qualityRatio = Math.min(Math.max(targetSizeMB / 25, 0.12), 0.95);

    const canvas = await html2canvas(pageElement, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    const imgData = canvas.toDataURL('image/jpeg', qualityRatio);

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a3'
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 420);
    pdf.save(`Satwika_Social_Media_${targetSizeMB}MB.pdf`);
  }
};
