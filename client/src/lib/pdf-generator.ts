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
  
  // Calculate image dimensions to fit A4 with minimal margins (5mm instead of 10mm)
  const imgWidth = pageWidth - 10; // 5mm margins on each side
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  // Add image to PDF with reduced margins
  pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
  
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
  
  // Reduced margins for A4 printing - start from 5mm
  let currentY = 5;
  
  // Header Section with Dark Teal Background - full width for A4
  doc.setFillColor(...darkTeal);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company logo on right (Arabic RTL) - Optimized for A4
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'JPEG', pageWidth - 55, 3, 50, 34);
    } catch (error) {
      console.warn('Could not add logo to PDF');
    }
  }
  
  // Header text in Arabic
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('عرض سعر', pageWidth - 8, 22, { align: 'right' });
  
  // Company name on left
  doc.setTextColor(199, 156, 69);
  doc.setFontSize(16);
  doc.text(data.companyName || 'شركة البريمي', 8, 22);
  
  // Issue date and quotation number only
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const quotationNumber = data.quotationNumber || `Q${Date.now()}`.slice(-6);
  doc.text(`تاريخ الإصدار: ${currentDate}`, pageWidth - 8, 32, { align: 'right' });
  doc.text(`رقم العرض: ${quotationNumber}`, 8, 32);
  
  currentY = 45;
  
  // Greeting section - reduced margins
  doc.setFillColor(250, 250, 250);
  doc.rect(5, currentY, pageWidth - 10, 15, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text('تحية طيبة وبعد،', pageWidth - 15, currentY + 10, { align: 'right' });
  
  currentY += 20;
  
  // Customer and Vehicle Data (Two columns) - reduced margins
  const colWidth = (pageWidth - 15) / 2;
  
  // Customer Info (Right column)
  doc.setFillColor(248, 248, 248);
  doc.rect(pageWidth/2 + 2.5, currentY, colWidth, 45, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(pageWidth/2 + 2.5, currentY, colWidth, 45, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text('بيانات العميل', pageWidth - 10, currentY + 10, { align: 'right' });
  
  doc.setFontSize(9);
  let customerInfoY = currentY + 18;
  
  if (data.customerName) {
    doc.text(`الاسم: ${data.customerName}`, pageWidth - 10, customerInfoY, { align: 'right' });
    customerInfoY += 8;
  }
  if (data.customerIdNumber) {
    doc.text(`رقم الهوية: ${data.customerIdNumber}`, pageWidth - 10, customerInfoY, { align: 'right' });
    customerInfoY += 8;
  }
  if (data.customerPhone) {
    doc.text(`رقم الهاتف: ${data.customerPhone}`, pageWidth - 10, customerInfoY, { align: 'right' });
    customerInfoY += 8;
  }
  
  // Vehicle Info (Left column)
  doc.setFillColor(248, 248, 248);
  doc.rect(5, currentY, colWidth, 45, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(5, currentY, colWidth, 45, 'S');
  
  doc.setFontSize(11);
  doc.text('بيانات المركبة', pageWidth/2 - 5, currentY + 10, { align: 'right' });
  
  doc.setFontSize(9);
  let vehicleInfoY = currentY + 18;
  
  if (data.carMaker) {
    doc.text(`الماركة: ${data.carMaker}`, pageWidth/2 - 5, vehicleInfoY, { align: 'right' });
    vehicleInfoY += 8;
  }
  if (data.carModel) {
    doc.text(`الموديل: ${data.carModel}`, pageWidth/2 - 5, vehicleInfoY, { align: 'right' });
    vehicleInfoY += 8;
  }
  if (data.carYear) {
    doc.text(`السنة: ${data.carYear}`, pageWidth/2 - 5, vehicleInfoY, { align: 'right' });
    vehicleInfoY += 8;
  }
  if (data.vinNumber) {
    doc.text(`رقم الهيكل: ${data.vinNumber}`, pageWidth/2 - 5, vehicleInfoY, { align: 'right' });
    vehicleInfoY += 8;
  }
  if (data.exteriorColor) {
    doc.text(`اللون الخارجي: ${data.exteriorColor}`, pageWidth/2 - 5, vehicleInfoY, { align: 'right' });
    vehicleInfoY += 8;
  }
  if (data.interiorColor) {
    doc.text(`اللون الداخلي: ${data.interiorColor}`, pageWidth/2 - 5, vehicleInfoY, { align: 'right' });
    vehicleInfoY += 8;
  }
  
  currentY += 50;
  
  // Vehicle Specifications Section - reduced margins
  doc.setFillColor(252, 252, 252);
  doc.rect(5, currentY, pageWidth - 10, 75, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(5, currentY, pageWidth - 10, 75, 'S');
  
  doc.setTextColor(...darkTeal);
  doc.setFontSize(12);
  doc.text('المواصفات التفصيلية', pageWidth - 15, currentY + 15, { align: 'right' });
  
  // Add specifications text with proper Arabic formatting
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const specs = data.vehicleSpecifications || data.detailedSpecs || 'مواصفات السيارة التفصيلية';
  
  // Split specifications into lines for better display
  const specLines = specs.split('\n').slice(0, 6);
  let specY = currentY + 25;
  
  specLines.forEach((line: string) => {
    if (line.trim()) {
      doc.text(line.trim(), pageWidth - 15, specY, { align: 'right' });
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
  
  currentY += 80;
  
  // Offer Summary Section - reduced margins
  doc.setFillColor(250, 250, 250);
  doc.rect(5, currentY, pageWidth - 10, 65, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(5, currentY, pageWidth - 10, 65, 'S');
  
  doc.setTextColor(...darkTeal);
  doc.setFontSize(12);
  doc.text('ملخص العرض', pageWidth - 15, currentY + 15, { align: 'right' });
  
  // Calculate pricing
  const basePrice = parseFloat(data.basePrice || '0');
  const quantity = parseInt(data.quantity || '1');
  const platePrice = parseFloat(data.platePrice || '0');
  const subtotal = basePrice * quantity;
  const tax = subtotal * 0.15;
  const total = subtotal + tax + platePrice;
  
  // Create pricing table - optimized for A4
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  let tableY = currentY + 25;
  
  // Table headers
  doc.text('البيان', pageWidth - 15, tableY, { align: 'right' });
  doc.text('المبلغ (ريال)', pageWidth - 70, tableY, { align: 'right' });
  
  // Table rows
  tableY += 8;
  doc.text(`السعر الإفرادي`, pageWidth - 15, tableY, { align: 'right' });
  doc.text(`${basePrice.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  
  tableY += 6;
  doc.text(`الكمية`, pageWidth - 15, tableY, { align: 'right' });
  doc.text(`${quantity}`, pageWidth - 70, tableY, { align: 'right' });
  
  tableY += 6;
  doc.text(`الإجمالي قبل الضريبة`, pageWidth - 15, tableY, { align: 'right' });
  doc.text(`${subtotal.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  
  tableY += 6;
  doc.text(`الضريبة المضافة (%15)`, pageWidth - 15, tableY, { align: 'right' });
  doc.text(`${tax.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  
  if (platePrice > 0) {
    tableY += 6;
    doc.text(`اللوحات والرسوم`, pageWidth - 15, tableY, { align: 'right' });
    doc.text(`${platePrice.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  }
  
  tableY += 6;
  doc.text(`المجموع النهائي`, pageWidth - 15, tableY, { align: 'right' });
  doc.text(`${total.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  
  // Amount in words
  doc.setTextColor(...gold);
  doc.setFontSize(11);
  doc.text(`المبلغ كتابة: ${total.toLocaleString()} ريال سعودي فقط لا غير`, pageWidth - 15, tableY + 12, { align: 'right' });
  
  currentY += 70;
  
  // Single centered section: QR Code and Signature - optimized for A4
  const bottomY = currentY;
  const sectionWidth = (pageWidth - 20) / 2;
  const centerX = pageWidth / 2 - sectionWidth / 2;
  
  // QR Code and Signature (centered section)
  doc.setFillColor(240, 245, 255);
  doc.rect(centerX, bottomY, sectionWidth, 45, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(centerX, bottomY, sectionWidth, 45, 'S');
  
  // Section title
  doc.setTextColor(...darkTeal);
  doc.setFontSize(10);
  doc.text('QR Code والتوقيع', centerX + sectionWidth - 5, bottomY + 10, { align: 'right' });
  
  // QR Code placeholder (larger)
  doc.setFillColor(255, 255, 255);
  doc.rect(centerX + 10, bottomY + 15, 30, 30, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(centerX + 10, bottomY + 15, 30, 30, 'S');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('QR Code', centerX + 25, bottomY + 32, { align: 'center' });
  
  // Company stamp (larger size)
  if (data.companyStamp) {
    try {
      doc.addImage(data.companyStamp, 'JPEG', centerX + sectionWidth - 45, bottomY + 15, 40, 30);
    } catch (error) {
      console.warn('Could not add company stamp to PDF');
    }
  }
  
  // Signature area
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text('ختم وتوقيع الشركة', centerX + sectionWidth - 5, bottomY + 35, { align: 'right' });
  
  // Footer with Gold background
  doc.setFillColor(...gold);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`${data.companyName || 'شركة البريمي'}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
  doc.text(`الهاتف: ${data.companyPhone || 'غير محدد'}`, pageWidth/2, pageHeight - 10, { align: 'center' });
  doc.text(`البريد: ${data.companyEmail || 'غير محدد'}`, 15, pageHeight - 10);
  
  return doc;
}