import jsPDF from 'jspdf';

export function generateQuotationPDF(data: any): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 15;
  
  // Colors - Dark Teal and Gold
  const darkTeal: [number, number, number] = [0, 98, 127]; // #00627F
  const gold: [number, number, number] = [199, 156, 69]; // #C79C45
  
  // Header Section with Dark Teal Background
  doc.setFillColor(...darkTeal);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Company logo on left (ALBARIMI style)
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'JPEG', 15, 8, 30, 30);
    } catch (error) {
      console.warn('Could not add logo to PDF');
    }
  } else {
    // Add ALBARIMI text as fallback
    doc.setTextColor(199, 156, 69);
    doc.setFontSize(16);
    doc.text('ALBARIMI', 15, 25);
  }
  
  // Header metadata on right
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('عرض سعر', pageWidth - 15, 15, { align: 'right' });
  
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const quotationNumber = data.quotationNumber || `${Date.now()}`.slice(-4);
  doc.text(`تاريخ ${currentDate}`, pageWidth - 15, 25, { align: 'right' });
  doc.text(`رقم ${quotationNumber}`, pageWidth - 15, 35, { align: 'right' });
  
  // Top bar with labels (light background)
  currentY = 45;
  doc.setFillColor(245, 245, 245);
  doc.rect(0, currentY, pageWidth, 15, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text('السجل', pageWidth - 140, currentY + 10, { align: 'center' });
  doc.text('الرخصة', pageWidth - 85, currentY + 10, { align: 'center' });
  doc.text('الرقم الضريبي', pageWidth - 30, currentY + 10, { align: 'center' });
  
  currentY += 25;
  
  // Customer and Vehicle Data (Two columns)
  const colWidth = (pageWidth - 30) / 2;
  
  // Customer Info (Right column)
  doc.setFillColor(248, 248, 248);
  doc.rect(pageWidth/2 + 5, currentY, colWidth - 5, 50, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(pageWidth/2 + 5, currentY, colWidth - 5, 50, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text('بيانات العميل', pageWidth - 15, currentY + 12, { align: 'right' });
  
  doc.setFontSize(9);
  doc.text(`الاسم: ${data.customerName || 'غير محدد'}`, pageWidth - 15, currentY + 22, { align: 'right' });
  doc.text(`رقم الهوية: ${data.customerIdNumber || 'غير محدد'}`, pageWidth - 15, currentY + 30, { align: 'right' });
  doc.text(`رقم الهاتف: ${data.customerPhone || 'غير محدد'}`, pageWidth - 15, currentY + 38, { align: 'right' });
  
  // Vehicle Info (Left column)
  doc.setFillColor(248, 248, 248);
  doc.rect(15, currentY, colWidth - 5, 50, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15, currentY, colWidth - 5, 50, 'S');
  
  doc.setFontSize(11);
  doc.text('بيانات المركبة', pageWidth/2 - 15, currentY + 12, { align: 'right' });
  
  doc.setFontSize(9);
  doc.text(`الماركة: ${data.carMaker || 'غير محدد'}`, pageWidth/2 - 15, currentY + 22, { align: 'right' });
  doc.text(`الموديل: ${data.carModel || 'غير محدد'}`, pageWidth/2 - 15, currentY + 30, { align: 'right' });
  doc.text(`السنة: ${data.carYear || 'غير محدد'}`, pageWidth/2 - 15, currentY + 38, { align: 'right' });
  doc.text(`رقم الهيكل: ${data.vinNumber || 'غير محدد'}`, pageWidth/2 - 15, currentY + 46, { align: 'right' });
  
  currentY += 70;
  
  // Detailed Specifications Section
  doc.setFillColor(252, 252, 252);
  doc.rect(15, currentY, pageWidth - 30, 80, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(15, currentY, pageWidth - 30, 80, 'S');
  
  doc.setTextColor(...darkTeal);
  doc.setFontSize(12);
  doc.text('المواصفات التفصيلية', pageWidth - 25, currentY + 15, { align: 'right' });
  
  // Add Mercedes logo placeholder if vehicle brand is Mercedes
  if (data.carMaker?.toLowerCase().includes('مرسيدس') || data.carMaker?.toLowerCase().includes('mercedes')) {
    doc.setFillColor(200, 200, 200);
    doc.circle(35, currentY + 25, 12, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('★', 35, currentY + 27, { align: 'center' });
  }
  
  // Add specifications text
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const specs = data.vehicleSpecifications || data.detailedSpecs || 'مواصفات السيارة التفصيلية';
  const specLines = doc.splitTextToSize(specs, pageWidth - 60);
  let specY = currentY + 35;
  specLines.slice(0, 4).forEach((line: string) => {
    doc.text(line, pageWidth - 25, specY, { align: 'right' });
    specY += 8;
  });
  
  // Add large watermark/logo in background
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'JPEG', pageWidth/2 - 25, currentY + 20, 50, 50);
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
  
  // Pricing table
  const basePrice = parseFloat(data.basePrice || '0');
  const quantity = parseInt(data.quantity || '1');
  const platePrice = parseFloat(data.platePrice || '0');
  const subtotal = basePrice * quantity;
  const tax = subtotal * 0.15;
  const total = subtotal + tax + platePrice;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  let tableY = currentY + 25;
  
  doc.text('تفاصيل السعر', pageWidth - 25, tableY, { align: 'right' });
  tableY += 8;
  doc.text(`السعر الإفرادي: ${basePrice.toLocaleString()} ريال`, pageWidth - 25, tableY, { align: 'right' });
  tableY += 6;
  doc.text(`الكمية: ${quantity}`, pageWidth - 25, tableY, { align: 'right' });
  tableY += 6;
  doc.text(`الإجمالي قبل الضريبة: ${subtotal.toLocaleString()} ريال`, pageWidth - 25, tableY, { align: 'right' });
  tableY += 6;
  doc.text(`الضريبة (%15): ${tax.toLocaleString()} ريال`, pageWidth - 25, tableY, { align: 'right' });
  tableY += 6;
  doc.text(`سعر النهائي: ${total.toLocaleString()} ريال`, pageWidth - 25, tableY, { align: 'right' });
  
  // Amount in words
  doc.setTextColor(...gold);
  doc.setFontSize(11);
  const totalInWords = data.totalInWords || `${total.toLocaleString()} ريال سعودي فقط لا غير`;
  doc.text(`المبلغ كتابة: ${totalInWords}`, pageWidth - 25, tableY + 12, { align: 'right' });
  
  currentY += 90;
  
  // Representative info section (right side)
  doc.setFillColor(248, 248, 248);
  doc.rect(pageWidth/2 + 5, currentY, colWidth - 5, 35, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(pageWidth/2 + 5, currentY, colWidth - 5, 35, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text('بيانات مندوب', pageWidth - 15, currentY + 12, { align: 'right' });
  doc.setFontSize(9);
  doc.text(`${data.salesRepName || 'غير محدد'}`, pageWidth - 15, currentY + 20, { align: 'right' });
  doc.text(`${data.salesRepPhone || 'غير محدد'}`, pageWidth - 15, currentY + 28, { align: 'right' });
  
  // QR Code (bottom left)
  doc.setFillColor(200, 200, 200);
  doc.rect(15, currentY, 25, 25, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(7);
  doc.text('QR Code', 27.5, currentY + 30, { align: 'center' });
  
  // Notes section (right side)
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  let notesY = currentY + 45;
  const notes = [
    '• مدة صلاحية العرض: 15 يوم',
    '• السعر لا يشمل رسوم التسجيل والتأمين',
    '• يجب التأكد من التحويل البنكي',
    '• الشروط خاضعة للموافقة'
  ];
  
  notes.forEach(note => {
    doc.text(note, pageWidth - 15, notesY, { align: 'right' });
    notesY += 6;
  });
  
  // Signature area
  doc.setFillColor(245, 245, 245);
  doc.rect(15, currentY + 40, 60, 20, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text('الختم', 45, currentY + 52, { align: 'center' });
  
  // Footer with Gold background
  doc.setFillColor(...gold);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('العنوان', pageWidth - 40, pageHeight - 8, { align: 'center' });
  doc.text('الإيميل', 40, pageHeight - 8, { align: 'center' });
  
  return doc;
}