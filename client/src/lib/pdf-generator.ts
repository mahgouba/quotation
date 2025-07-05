import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to create PDF from HTML element
export async function generateQuotationPDFFromHTML(element: HTMLElement): Promise<jsPDF> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Calculate image dimensions to fit A4
  const imgWidth = pageWidth - 20; // 20mm margins
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  // Add image to PDF
  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
  
  return pdf;
}

// Alternative text-based PDF generator with better Arabic support
export function generateQuotationPDF(data: any): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors - Dark Teal and Gold
  const darkTeal: [number, number, number] = [0, 98, 127]; // #00627F
  const gold: [number, number, number] = [199, 156, 69]; // #C79C45
  
  let currentY = 15;
  
  // Header Section with Dark Teal Background
  doc.setFillColor(...darkTeal);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Company logo on right (Arabic RTL)
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'JPEG', pageWidth - 45, 8, 30, 30);
    } catch (error) {
      console.warn('Could not add logo to PDF');
    }
  }
  
  // Header text in Arabic
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('عرض سعر', pageWidth - 15, 25, { align: 'right' });
  
  // Company name on left
  doc.setTextColor(199, 156, 69);
  doc.setFontSize(16);
  doc.text(data.companyName || 'ALBARIMI', 15, 25);
  
  // Date and quotation number
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const quotationNumber = data.quotationNumber || `Q${Date.now()}`.slice(-6);
  doc.text(`التاريخ: ${currentDate}`, pageWidth - 15, 35, { align: 'right' });
  doc.text(`رقم العرض: ${quotationNumber}`, 15, 35);
  
  currentY = 55;
  
  // Greeting section
  doc.setFillColor(250, 250, 250);
  doc.rect(15, currentY, pageWidth - 30, 15, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text('تحية طيبة وبعد،', pageWidth - 25, currentY + 10, { align: 'right' });
  
  currentY += 25;
  
  // Customer and Vehicle Data (Two columns)
  const colWidth = (pageWidth - 40) / 2;
  
  // Customer Info (Right column)
  doc.setFillColor(248, 248, 248);
  doc.rect(pageWidth/2 + 10, currentY, colWidth, 50, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(pageWidth/2 + 10, currentY, colWidth, 50, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text('بيانات العميل', pageWidth - 20, currentY + 12, { align: 'right' });
  
  doc.setFontSize(9);
  doc.text(`الاسم: ${data.customerName || 'غير محدد'}`, pageWidth - 20, currentY + 22, { align: 'right' });
  doc.text(`رقم الهوية: ${data.customerIdNumber || 'غير محدد'}`, pageWidth - 20, currentY + 30, { align: 'right' });
  doc.text(`رقم الهاتف: ${data.customerPhone || 'غير محدد'}`, pageWidth - 20, currentY + 38, { align: 'right' });
  
  // Vehicle Info (Left column)
  doc.setFillColor(248, 248, 248);
  doc.rect(15, currentY, colWidth, 50, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15, currentY, colWidth, 50, 'S');
  
  doc.setFontSize(11);
  doc.text('بيانات المركبة', pageWidth/2 - 10, currentY + 12, { align: 'right' });
  
  doc.setFontSize(9);
  doc.text(`الماركة: ${data.carMaker || 'غير محدد'}`, pageWidth/2 - 10, currentY + 22, { align: 'right' });
  doc.text(`الموديل: ${data.carModel || 'غير محدد'}`, pageWidth/2 - 10, currentY + 30, { align: 'right' });
  doc.text(`السنة: ${data.carYear || 'غير محدد'}`, pageWidth/2 - 10, currentY + 38, { align: 'right' });
  doc.text(`رقم الهيكل: ${data.vinNumber || 'غير محدد'}`, pageWidth/2 - 10, currentY + 46, { align: 'right' });
  
  currentY += 70;
  
  // Vehicle Specifications Section
  doc.setFillColor(252, 252, 252);
  doc.rect(15, currentY, pageWidth - 30, 80, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(15, currentY, pageWidth - 30, 80, 'S');
  
  doc.setTextColor(...darkTeal);
  doc.setFontSize(12);
  doc.text('المواصفات التفصيلية', pageWidth - 25, currentY + 15, { align: 'right' });
  
  // Add specifications text with proper Arabic formatting
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const specs = data.vehicleSpecifications || data.detailedSpecs || 'مواصفات السيارة التفصيلية';
  
  // Split specifications into lines for better display
  const specLines = specs.split('\n').slice(0, 6);
  let specY = currentY + 25;
  
  specLines.forEach((line: string) => {
    if (line.trim()) {
      doc.text(line.trim(), pageWidth - 25, specY, { align: 'right' });
      specY += 8;
    }
  });
  
  // Add company logo watermark if available
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'JPEG', pageWidth/2 - 20, currentY + 25, 40, 40);
    } catch (error) {
      console.warn('Could not add watermark logo');
    }
  }
  
  currentY += 100;
  
  // Offer Summary Section
  doc.setFillColor(250, 250, 250);
  doc.rect(15, currentY, pageWidth - 30, 70, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(15, currentY, pageWidth - 30, 70, 'S');
  
  doc.setTextColor(...darkTeal);
  doc.setFontSize(12);
  doc.text('ملخص العرض', pageWidth - 25, currentY + 15, { align: 'right' });
  
  // Calculate pricing
  const basePrice = parseFloat(data.basePrice || '0');
  const quantity = parseInt(data.quantity || '1');
  const platePrice = parseFloat(data.platePrice || '0');
  const subtotal = basePrice * quantity;
  const tax = subtotal * 0.15;
  const total = subtotal + tax + platePrice;
  
  // Create pricing table
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  let tableY = currentY + 25;
  
  // Table headers
  doc.text('البيان', pageWidth - 25, tableY, { align: 'right' });
  doc.text('المبلغ (ريال)', pageWidth - 80, tableY, { align: 'right' });
  
  // Table rows
  tableY += 8;
  doc.text(`السعر الإفرادي`, pageWidth - 25, tableY, { align: 'right' });
  doc.text(`${basePrice.toLocaleString()}`, pageWidth - 80, tableY, { align: 'right' });
  
  tableY += 6;
  doc.text(`الكمية`, pageWidth - 25, tableY, { align: 'right' });
  doc.text(`${quantity}`, pageWidth - 80, tableY, { align: 'right' });
  
  tableY += 6;
  doc.text(`الإجمالي قبل الضريبة`, pageWidth - 25, tableY, { align: 'right' });
  doc.text(`${subtotal.toLocaleString()}`, pageWidth - 80, tableY, { align: 'right' });
  
  tableY += 6;
  doc.text(`الضريبة المضافة (%15)`, pageWidth - 25, tableY, { align: 'right' });
  doc.text(`${tax.toLocaleString()}`, pageWidth - 80, tableY, { align: 'right' });
  
  tableY += 6;
  doc.text(`المجموع النهائي`, pageWidth - 25, tableY, { align: 'right' });
  doc.text(`${total.toLocaleString()}`, pageWidth - 80, tableY, { align: 'right' });
  
  // Amount in words
  doc.setTextColor(...gold);
  doc.setFontSize(11);
  doc.text(`المبلغ كتابة: ${total.toLocaleString()} ريال سعودي فقط لا غير`, pageWidth - 25, tableY + 12, { align: 'right' });
  
  currentY += 90;
  
  // Terms and conditions from company data
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  const termsText = data.companyTerms || 
    '• يجب على العميل دفع مقدم بنسبة 50% من إجمالي السعر\n• الباقي يُدفع عند استلام المركبة\n• مدة التسليم: 2-4 أسابيع من تاريخ تأكيد الطلب\n• ضمان الوكيل لمدة 3 سنوات أو 100,000 كم أيهما أقل\n• العرض لا يشمل التأمين ورسوم النقل\n• الشركة غير مسؤولة عن التأخير الناجم عن ظروف خارجة عن إرادتها';
  
  doc.text('الشروط والأحكام:', pageWidth - 25, currentY, { align: 'right' });
  currentY += 8;
  
  const terms = termsText.split('\n').filter((term: string) => term.trim());
  
  terms.forEach((term: string) => {
    doc.text(term, pageWidth - 25, currentY, { align: 'right' });
    currentY += 6;
  });
  
  currentY += 10;
  
  // Three-column bottom section: Rep Info, Price Summary, QR Code
  const bottomY = currentY;
  const sectionWidth = (pageWidth - 60) / 3;
  
  // Representative info (right section)
  doc.setFillColor(248, 250, 252);
  doc.rect(pageWidth - 15 - sectionWidth, bottomY, sectionWidth, 45, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(pageWidth - 15 - sectionWidth, bottomY, sectionWidth, 45, 'S');
  
  doc.setTextColor(...darkTeal);
  doc.setFontSize(10);
  doc.text('بيانات مندوب المبيعات', pageWidth - 20, bottomY + 10, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text(`الاسم: ${data.salesRepName || 'غير محدد'}`, pageWidth - 20, bottomY + 18, { align: 'right' });
  doc.text(`الهاتف: ${data.salesRepPhone || 'غير محدد'}`, pageWidth - 20, bottomY + 26, { align: 'right' });
  doc.text(`البريد: ${data.salesRepEmail || 'غير محدد'}`, pageWidth - 20, bottomY + 34, { align: 'right' });
  
  // Price summary (center section)
  const centerX = pageWidth/2 - sectionWidth/2;
  doc.setFillColor(255, 248, 220);
  doc.rect(centerX, bottomY, sectionWidth, 45, 'F');
  doc.setDrawColor(...gold);
  doc.rect(centerX, bottomY, sectionWidth, 45, 'S');
  
  doc.setTextColor(...gold);
  doc.setFontSize(10);
  doc.text('ملخص الأسعار', centerX + sectionWidth/2, bottomY + 10, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text(`السعر الأساسي: ${data.basePrice || '0'} ريال`, centerX + sectionWidth - 5, bottomY + 18, { align: 'right' });
  doc.text(`الكمية: ${data.quantity || 1}`, centerX + sectionWidth - 5, bottomY + 26, { align: 'right' });
  doc.text(`الإجمالي: ${data.totalPrice || '0'} ريال`, centerX + sectionWidth - 5, bottomY + 34, { align: 'right' });
  
  // QR Code and Signature (left section)
  doc.setFillColor(240, 245, 255);
  doc.rect(15, bottomY, sectionWidth, 45, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(15, bottomY, sectionWidth, 45, 'S');
  
  // QR Code placeholder
  doc.setFillColor(255, 255, 255);
  doc.rect(20, bottomY + 5, 25, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, bottomY + 5, 25, 25, 'S');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('QR', 32.5, bottomY + 19, { align: 'center' });
  
  // Signature area
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text('ختم وتوقيع الشركة', 15 + sectionWidth/2, bottomY + 38, { align: 'center' });
  
  // Footer with Gold background
  doc.setFillColor(...gold);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`${data.companyName || 'ALBARIMI'}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
  doc.text(`الهاتف: ${data.companyPhone || 'غير محدد'}`, pageWidth/2, pageHeight - 10, { align: 'center' });
  doc.text(`البريد: ${data.companyEmail || 'غير محدد'}`, 15, pageHeight - 10);
  
  return doc;
}