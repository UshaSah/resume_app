import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';


export const generatePDF = async (resumeElement) => {
    const canvas = await html2canvas(resumeElement);
    const imgData = canvas.toDataURL9('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // calculate image dimensions to fit page
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, 'PND', 0, 0, imgWidth, imgHeight);

    pdf.save('resume.pdf');

}

