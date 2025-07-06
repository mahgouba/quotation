import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatPriceWithWords } from './number-to-words';

// Function to fetch PDF customization settings
async function fetchPdfCustomization() {
  try {
    const response = await fetch('/api/pdf-customizations/default');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Could not fetch PDF customization, using defaults');
  }
  
  // Default settings if no customization found
  return {
    headerFontSize: 108,
    companyNameFontSize: 162,
    dateFontSize: 66,
    greetingFontSize: 72,
    sectionTitleFontSize: 66,
    contentFontSize: 54,
    specificationsTitleFontSize: 72,
    specificationsContentFontSize: 57,
    pricingTitleFontSize: 72,
    pricingContentFontSize: 57,
    amountWordsFontSize: 66,
    signatureFontSize: 60,
    footerFontSize: 42,
    headerBackgroundColor: '#00627F',
    headerTextColor: '#FFFFFF',
    companyNameColor: '#C79C45',
    contentTextColor: '#000000',
    sectionTitleColor: '#00627F',
    amountWordsColor: '#C79C45',
    footerBackgroundColor: '#C79C45',
    footerTextColor: '#000000',
    logoWidth: 600,
    logoHeight: 408,
    logoPositionX: -300,
    logoPositionY: 3,
    showWatermark: true,
    watermarkOpacity: '0.08',
    stampWidth: 113,
    stampHeight: 71,
    stampPositionX: -125,
    stampPositionY: 15,
    headerHeight: 200,
    sectionSpacing: 20,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    datePositionX: -8,
    datePositionY: 175,
    quotationNumberPositionX: 8,
    quotationNumberPositionY: 175,
    greetingPositionY: 14,
  };
}

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

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

// Alternative text-based PDF generator with better Arabic support
// Async PDF generator that uses customization settings
export async function generateCustomizedQuotationPDF(data: any): Promise<jsPDF> {
  const customization = await fetchPdfCustomization();
  
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Convert colors from customization
  const headerBgColor = hexToRgb(customization.headerBackgroundColor);
  const headerTextColor = hexToRgb(customization.headerTextColor);
  const companyNameColor = hexToRgb(customization.companyNameColor);
  const contentTextColor = hexToRgb(customization.contentTextColor);
  const sectionTitleColor = hexToRgb(customization.sectionTitleColor);
  const amountWordsColor = hexToRgb(customization.amountWordsColor);
  const footerBgColor = hexToRgb(customization.footerBackgroundColor);
  const footerTextColor = hexToRgb(customization.footerTextColor);
  
  // Start from customizable margins
  let currentY = customization.marginTop;
  
  // Header Section with customizable height and colors
  doc.setFillColor(...headerBgColor);
  doc.rect(0, 0, pageWidth, customization.headerHeight, 'F');
  
  // Company logo with customizable size and position
  if (data.companyLogo) {
    try {
      doc.addImage(
        data.companyLogo, 
        'JPEG', 
        pageWidth + customization.logoPositionX, 
        customization.logoPositionY, 
        customization.logoWidth / 3, 
        customization.logoHeight / 3
      );
    } catch (error) {
      console.warn('Could not add logo to PDF');
    }
  }
  
  // Header text with customizable font size
  doc.setTextColor(...headerTextColor);
  doc.setFontSize(customization.headerFontSize / 3); // Scale down for reasonable size
  const documentTitle = data.documentType === 'invoice' ? 'فاتورة' : 'عرض سعر';
  doc.text(documentTitle, pageWidth + customization.datePositionX, 22, { align: 'right' });
  
  // Company name with customizable color and size
  doc.setTextColor(...companyNameColor);
  doc.setFontSize(customization.companyNameFontSize / 5); // Scale down
  doc.text(data.companyName || 'شركة البريمي', pageWidth / 2, 60, { align: 'center' });
  
  // Date and quotation number with customizable positioning
  doc.setTextColor(...headerTextColor);
  doc.setFontSize(customization.dateFontSize / 3); // Scale down
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const quotationNumber = data.quotationNumber || `Q${Date.now()}`.slice(-6);
  doc.text(`تاريخ الإصدار: ${currentDate}`, pageWidth + customization.datePositionX, customization.datePositionY, { align: 'right' });
  const documentNumber = data.documentType === 'invoice' ? 'رقم الفاتورة' : 'رقم العرض';
  doc.text(`${documentNumber}: ${quotationNumber}`, customization.quotationNumberPositionX, customization.quotationNumberPositionY);
  
  currentY = customization.headerHeight + customization.sectionSpacing;
  
  // Add watermark if enabled
  if (customization.showWatermark && data.companyLogo) {
    try {
      const watermarkX = pageWidth / 2 - 100;
      const watermarkY = pageHeight / 2 - 100;
      doc.setGState(doc.GState({opacity: parseFloat(customization.watermarkOpacity)}));
      doc.addImage(data.companyLogo, 'JPEG', watermarkX, watermarkY, 200, 200);
      doc.setGState(doc.GState({opacity: 1}));
    } catch (error) {
      console.warn('Could not add watermark logo to PDF');
    }
  }
  
  // Greeting section with customizable font size
  doc.setFillColor(250, 250, 250);
  doc.rect(customization.marginLeft, currentY, pageWidth - customization.marginLeft - customization.marginRight, 22, 'F');
  doc.setTextColor(...contentTextColor);
  doc.setFontSize(customization.greetingFontSize / 3); // Scale down
  doc.text('تحية طيبة وبعد،', pageWidth - 15, currentY + customization.greetingPositionY, { align: 'right' });
  
  currentY += customization.sectionSpacing;
  
  // Continue with remaining sections using customization settings...
  // [Rest of the PDF generation code would follow similar pattern]
  
  // For now, return the PDF with basic customization applied
  return doc;
}

// Keep the original function for backward compatibility
export function generateQuotationPDF(data: any): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors - Dark Teal and Gold
  const darkTeal: [number, number, number] = [0, 98, 127]; // #00627F
  const gold: [number, number, number] = [199, 156, 69]; // #C79C45
  
  // Reduced margins for A4 printing - start from 5mm
  let currentY = 5;
  
  // Header Section with Dark Teal Background - made even taller for much larger logo
  doc.setFillColor(...darkTeal);
  doc.rect(0, 0, pageWidth, 200, 'F');
  
  // Company logo on right (Arabic RTL) - Made 3 times larger
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'JPEG', pageWidth - 300, 3, 600, 408);
    } catch (error) {
      console.warn('Could not add logo to PDF');
    }
  }
  
  // Header text in Arabic - made even larger
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(108);
  const documentTitle = data.documentType === 'invoice' ? 'فاتورة' : 'عرض سعر';
  doc.text(documentTitle, pageWidth - 8, 22, { align: 'right' });
  
  // Company name in center - Made much larger
  doc.setTextColor(199, 156, 69);
  doc.setFontSize(162);
  doc.text(data.companyName || 'شركة البريمي', pageWidth / 2, 100, { align: 'center' });
  
  // Issue date and quotation number only - made larger
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(66);
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const quotationNumber = data.quotationNumber || `Q${Date.now()}`.slice(-6);
  doc.text(`تاريخ الإصدار: ${currentDate}`, pageWidth - 8, 175, { align: 'right' });
  const documentNumber = data.documentType === 'invoice' ? 'رقم الفاتورة' : 'رقم العرض';
  doc.text(`${documentNumber}: ${quotationNumber}`, 8, 175);
  
  currentY = 205;
  
  // Add company logo as watermark in background
  if (data.companyLogo) {
    try {
      // Semi-transparent watermark in center of page
      const watermarkX = pageWidth / 2 - 100;
      const watermarkY = pageHeight / 2 - 100;
      
      // Add watermark with reduced opacity
      doc.setGState(doc.GState({opacity: 0.08}));
      doc.addImage(data.companyLogo, 'JPEG', watermarkX, watermarkY, 200, 200);
      doc.setGState(doc.GState({opacity: 1}));
    } catch (error) {
      console.warn('Could not add watermark logo to PDF');
    }
  }
  
  // Greeting section - reduced margins with much larger font
  doc.setFillColor(250, 250, 250);
  doc.rect(5, currentY, pageWidth - 10, 22, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(72);
  doc.text('تحية طيبة وبعد،', pageWidth - 15, currentY + 14, { align: 'right' });
  
  currentY += 20;
  
  // Customer and Vehicle Data (Two columns) - reduced margins
  const colWidth = (pageWidth - 15) / 2;
  
  // Customer Info (Right column)
  doc.setFillColor(248, 248, 248);
  doc.rect(pageWidth/2 + 2.5, currentY, colWidth, 45, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(pageWidth/2 + 2.5, currentY, colWidth, 45, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(66);
  doc.text('بيانات العميل', pageWidth - 10, currentY + 10, { align: 'right' });
  
  doc.setFontSize(54);
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
  
  doc.setFontSize(66);
  doc.text('بيانات المركبة', pageWidth/2 - 5, currentY + 10, { align: 'right' });
  
  doc.setFontSize(54);
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
  doc.setFontSize(72);
  doc.text('المواصفات التفصيلية', pageWidth - 15, currentY + 15, { align: 'right' });
  
  // Add specifications text with proper Arabic formatting - much larger font
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(57);
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
  doc.setFontSize(72);
  doc.text('ملخص العرض', pageWidth - 15, currentY + 15, { align: 'right' });
  
  // Calculate pricing
  const basePrice = parseFloat(data.basePrice || '0');
  const quantity = parseInt(data.quantity || '1');
  const platePrice = parseFloat(data.platePrice || '0');
  const subtotal = basePrice * quantity;
  const tax = subtotal * 0.15;
  const total = subtotal + tax + platePrice;
  
  // Create pricing table - optimized for A4 with much larger fonts
  doc.setFontSize(57);
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
  
  // Amount in words - much larger font
  doc.setTextColor(...gold);
  doc.setFontSize(66);
  const amountInWords = formatPriceWithWords(total, 'ريال سعودي');
  doc.text(`المبلغ كتابة: ${amountInWords} فقط لا غير`, pageWidth - 15, tableY + 12, { align: 'right' });
  
  currentY += 70;
  
  // Single centered section: QR Code and Signature - made taller for larger stamp
  const bottomY = currentY;
  const sectionWidth = (pageWidth - 20) / 2;
  const centerX = pageWidth / 2 - sectionWidth / 2;
  
  // QR Code and Signature (centered section) - increased height for larger stamp
  doc.setFillColor(240, 245, 255);
  doc.rect(centerX, bottomY, sectionWidth, 110, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(centerX, bottomY, sectionWidth, 110, 'S');
  
  // Section title - much larger font
  doc.setTextColor(...darkTeal);
  doc.setFontSize(66);
  doc.text('QR Code والتوقيع', centerX + sectionWidth - 5, bottomY + 10, { align: 'right' });
  
  // QR Code placeholder (larger)
  doc.setFillColor(255, 255, 255);
  doc.rect(centerX + 10, bottomY + 15, 30, 30, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(centerX + 10, bottomY + 15, 30, 30, 'S');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('QR Code', centerX + 25, bottomY + 32, { align: 'center' });
  
  // Company stamp (4cm width, 2.5cm height)
  if (data.companyStamp) {
    try {
      doc.addImage(data.companyStamp, 'JPEG', centerX + sectionWidth - 125, bottomY + 15, 113, 71);
    } catch (error) {
      console.warn('Could not add company stamp to PDF');
    }
  }
  
  // Signature area - adjusted for larger stamp with much bigger font
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(60);
  doc.text('ختم وتوقيع الشركة', centerX + sectionWidth - 5, bottomY + 100, { align: 'right' });
  
  // Footer with Gold background
  doc.setFillColor(...gold);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(42);
  doc.text(`${data.companyName || 'شركة البريمي'}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
  doc.text(`الهاتف: ${data.companyPhone || 'غير محدد'}`, pageWidth/2, pageHeight - 10, { align: 'center' });
  doc.text(`البريد: ${data.companyEmail || 'غير محدد'}`, 15, pageHeight - 10);
  
  return doc;
}