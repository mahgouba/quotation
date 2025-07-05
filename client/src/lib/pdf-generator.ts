import jsPDF from 'jspdf';

export function generateQuotationPDF(data: any): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 20;
  
  // Add modern header with black background
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Add company logo on left
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'JPEG', 15, 10, 40, 40);
    } catch (error) {
      console.warn('Could not add logo to PDF');
    }
  }
  
  // Add header text in gold
  doc.setTextColor(255, 215, 0);
  doc.setFontSize(16);
  doc.text('عرض سعر', pageWidth - 20, 20, { align: 'right' });
  
  doc.setFontSize(12);
  doc.text('الرقم الضريبي', pageWidth - 20, 35, { align: 'right' });
  
  // Add date in white
  const currentDate = new Date().toLocaleDateString('ar-SA');
  doc.setTextColor(255, 255, 255);
  doc.text(`التاريخ: ${currentDate}`, pageWidth - 20, 50, { align: 'right' });
  
  currentY = 70;
  
  // Customer details section (right side)
  doc.setFillColor(240, 240, 240);
  doc.rect(pageWidth/2 + 5, currentY, pageWidth/2 - 15, 60, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text('بيانات العميل', pageWidth - 20, currentY + 15, { align: 'right' });
  
  doc.setFontSize(10);
  doc.text(`الاسم: ${data.customerName || 'غير محدد'}`, pageWidth - 20, currentY + 30, { align: 'right' });
  doc.text(`الهاتف: ${data.customerPhone || 'غير محدد'}`, pageWidth - 20, currentY + 40, { align: 'right' });
  doc.text(`البريد: ${data.customerEmail || 'غير محدد'}`, pageWidth - 20, currentY + 50, { align: 'right' });
  
  // Vehicle details section (left side)
  doc.setFillColor(240, 240, 240);
  doc.rect(10, currentY, pageWidth/2 - 15, 60, 'F');
  
  doc.setFontSize(12);
  doc.text('بيانات المركبة', pageWidth/2 - 20, currentY + 15, { align: 'right' });
  
  doc.setFontSize(10);
  doc.text(`الماركة: ${data.carMaker || 'غير محدد'}`, pageWidth/2 - 20, currentY + 30, { align: 'right' });
  doc.text(`الموديل: ${data.carModel || 'غير محدد'}`, pageWidth/2 - 20, currentY + 40, { align: 'right' });
  doc.text(`السنة: ${data.carYear || 'غير محدد'}`, pageWidth/2 - 20, currentY + 50, { align: 'right' });
  
  currentY += 80;
  
  // Company logo watermark in center
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'JPEG', pageWidth/2 - 50, currentY, 100, 100);
    } catch (error) {
      console.warn('Could not add watermark logo to PDF');
    }
  }
  
  currentY += 120;
  
  // Pricing summary box
  doc.setFillColor(255, 255, 255);
  doc.rect(10, currentY, pageWidth - 20, 80, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.rect(10, currentY, pageWidth - 20, 80, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text('ملخص العرض', pageWidth - 20, currentY + 15, { align: 'right' });
  
  // Calculate prices
  const basePrice = parseFloat(data.basePrice || '0');
  const platePrice = parseFloat(data.platePrice || '900');
  const tax = basePrice * 0.15;
  const total = basePrice + tax + platePrice;
  
  doc.setFontSize(10);
  doc.text(`تفاصيل السعر:`, pageWidth - 20, currentY + 30, { align: 'right' });
  doc.text(`السعر الأساسي: ${basePrice.toLocaleString()} ريال`, pageWidth - 20, currentY + 40, { align: 'right' });
  doc.text(`الضريبة (%15): ${tax.toLocaleString()} ريال`, pageWidth - 20, currentY + 50, { align: 'right' });
  doc.text(`اللوحات والاستمارة: ${platePrice.toLocaleString()} ريال`, pageWidth - 20, currentY + 60, { align: 'right' });
  
  // Total in gold
  doc.setTextColor(255, 215, 0);
  doc.setFontSize(12);
  doc.text(`الإجمالي النهائي: ${total.toLocaleString()} ريال`, pageWidth - 20, currentY + 70, { align: 'right' });
  
  currentY += 100;
  
  // QR code placeholder on the left
  const qrCodeSize = 40;
  doc.setFillColor(200, 200, 200);
  doc.rect(15, currentY, qrCodeSize, qrCodeSize, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text('QR Code', 15 + qrCodeSize/2, currentY + qrCodeSize + 10, { align: 'center' });
  
  // Contact information
  doc.setFontSize(10);
  doc.text('للاستفسار:', pageWidth - 20, currentY + 10, { align: 'right' });
  doc.text(`${data.salesRepName || 'غير محدد'}`, pageWidth - 20, currentY + 20, { align: 'right' });
  doc.text(`${data.salesRepPhone || 'غير محدد'}`, pageWidth - 20, currentY + 30, { align: 'right' });
  
  // Black footer
  doc.setFillColor(0, 0, 0);
  doc.rect(0, pageHeight - 40, pageWidth, 40, 'F');
  
  // Company name in gold
  doc.setTextColor(255, 215, 0);
  doc.setFontSize(14);
  doc.text(data.companyName || 'اسم الشركة', pageWidth/2, pageHeight - 20, { align: 'center' });
  
  // Company details in white
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(`${data.companyAddress || ''} | ${data.companyPhone || ''} | ${data.companyEmail || ''}`, pageWidth/2, pageHeight - 10, { align: 'center' });
  
  return doc;
}