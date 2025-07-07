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

// Helper function to create PDF from HTML element with explicit A4 formatting
export async function generateQuotationPDFFromHTML(element: HTMLElement): Promise<jsPDF> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 794, // A4 width in pixels at 96 DPI (210mm = 794px)
    height: 1123, // A4 height in pixels at 96 DPI (297mm = 1123px)
    foreignObjectRendering: true,
    logging: false
  });
  
  const imgData = canvas.toDataURL('image/png');
  
  // Create PDF with explicit A4 dimensions
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });
  
  // A4 dimensions in mm
  const pageWidth = 210;
  const pageHeight = 297;
  
  // Calculate image dimensions to fit A4 with minimal margins (5mm each side)
  const imgWidth = pageWidth - 10; // 5mm margins on each side
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  // Ensure content fits within A4 page height
  if (imgHeight > pageHeight - 10) {
    const scaleFactor = (pageHeight - 10) / imgHeight;
    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;
    
    // Center the scaled image
    const xOffset = (pageWidth - scaledWidth) / 2;
    pdf.addImage(imgData, 'PNG', xOffset, 5, scaledWidth, scaledHeight);
  } else {
    // Add image to PDF with 5mm margins
    pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
  }
  
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
// Async PDF generator that uses customization settings with explicit A4 formatting
export async function generateCustomizedQuotationPDF(data: any): Promise<jsPDF> {
  const customization = await fetchPdfCustomization();
  
  // Create PDF with explicit A4 configuration for consistent output across devices
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true,
    userUnit: 1.0
  });
  
  // Explicit A4 dimensions in mm to ensure consistency
  const pageWidth = 210;
  const pageHeight = 297;
  
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

// Keep the original function for backward compatibility with enhanced A4 formatting
export function generateQuotationPDF(data: any): jsPDF {
  // Create PDF with explicit A4 configuration for consistent output across devices
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true,
    userUnit: 1.0
  });

  // Add Arabic font support for better Arabic text rendering
  try {
    // Set default font that supports Arabic (if available)
    doc.setFont('helvetica');
    // Enable better Unicode and RTL support
    doc.setLanguage('ar');
  } catch (error) {
    console.warn('Could not set Arabic language support');
  }
  
  // Explicit A4 dimensions in mm to ensure consistency
  const pageWidth = 210;
  const pageHeight = 297;
  
  // Colors - Dark Teal and Gold
  const darkTeal: [number, number, number] = [0, 98, 127]; // #00627F
  const gold: [number, number, number] = [199, 156, 69]; // #C79C45
  
  // Reduced margins for A4 printing - start from 5mm
  let currentY = 5;
  
  // Header Section with Dark Teal Background - proper size
  doc.setFillColor(...darkTeal);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Company logo on right (Arabic RTL) - proper size
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'JPEG', pageWidth - 50, 5, 40, 30);
    } catch (error) {
      console.warn('Could not add logo to PDF');
    }
  }
  
  // Header text in Arabic - optimized size for clarity
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const documentTitle = data.documentType === 'invoice' ? 'فاتورة' : 'عرض سعر';
  doc.text(documentTitle, pageWidth - 8, 25, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  // Company name in center - optimized size
  doc.setTextColor(199, 156, 69);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(data.companyName || 'شركة البريمي للسيارات', pageWidth / 2, 35, { 
    align: 'center',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  // Issue date and quotation number - readable size
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const quotationNumber = data.quotationNumber || `Q${Date.now()}`.slice(-6);
  doc.text(`تاريخ الإصدار: ${currentDate}`, pageWidth - 8, 50, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  const documentNumber = data.documentType === 'invoice' ? 'رقم الفاتورة' : 'رقم العرض';
  doc.text(`${documentNumber}: ${quotationNumber}`, 8, 50, {
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  currentY = 70;
  
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
  
  // Greeting section - proper size
  doc.setFillColor(250, 250, 250);
  doc.rect(5, currentY, pageWidth - 10, 15, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('تحية طيبة وبعد،', pageWidth - 15, currentY + 10, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  currentY += 20;
  
  // Customer and Vehicle Data (Two columns) - reduced margins
  const colWidth = (pageWidth - 15) / 2;
  
  // Customer Info (Right column)
  doc.setFillColor(248, 248, 248);
  doc.rect(pageWidth/2 + 2.5, currentY, colWidth, 45, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(pageWidth/2 + 2.5, currentY, colWidth, 45, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('بيانات العميل', pageWidth - 10, currentY + 8, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let customerInfoY = currentY + 15;
  
  if (data.customerName) {
    doc.text(`الاسم: ${data.customerName}`, pageWidth - 10, customerInfoY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    customerInfoY += 5;
  }
  if (data.customerIdNumber) {
    doc.text(`رقم الهوية: ${data.customerIdNumber}`, pageWidth - 10, customerInfoY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    customerInfoY += 5;
  }
  if (data.customerPhone) {
    doc.text(`رقم الهاتف: ${data.customerPhone}`, pageWidth - 10, customerInfoY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    customerInfoY += 5;
  }
  
  // Vehicle Info (Left column)
  doc.setFillColor(248, 248, 248);
  doc.rect(5, currentY, colWidth, 45, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(5, currentY, colWidth, 45, 'S');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('بيانات المركبة', pageWidth/2 - 5, currentY + 8, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let vehicleInfoY = currentY + 15;
  
  if (data.carMaker) {
    doc.text(`الماركة: ${data.carMaker}`, pageWidth/2 - 5, vehicleInfoY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    vehicleInfoY += 5;
  }
  if (data.carModel) {
    doc.text(`الموديل: ${data.carModel}`, pageWidth/2 - 5, vehicleInfoY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    vehicleInfoY += 5;
  }
  if (data.carYear) {
    doc.text(`السنة: ${data.carYear}`, pageWidth/2 - 5, vehicleInfoY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    vehicleInfoY += 5;
  }
  if (data.vinNumber) {
    doc.text(`رقم الهيكل: ${data.vinNumber}`, pageWidth/2 - 5, vehicleInfoY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    vehicleInfoY += 5;
  }
  if (data.exteriorColor) {
    doc.text(`اللون الخارجي: ${data.exteriorColor}`, pageWidth/2 - 5, vehicleInfoY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    vehicleInfoY += 5;
  }
  if (data.interiorColor) {
    doc.text(`اللون الداخلي: ${data.interiorColor}`, pageWidth/2 - 5, vehicleInfoY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    vehicleInfoY += 5;
  }
  
  currentY += 50;
  
  // Vehicle Specifications Section - reduced margins
  doc.setFillColor(252, 252, 252);
  doc.rect(5, currentY, pageWidth - 10, 75, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(5, currentY, pageWidth - 10, 75, 'S');
  
  doc.setTextColor(...darkTeal);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('المواصفات التفصيلية', pageWidth - 15, currentY + 12, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  // Add specifications text with proper Arabic formatting
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const specs = data.vehicleSpecifications || data.detailedSpecs || 'مواصفات السيارة التفصيلية';
  
  // Split specifications into lines for better display
  const specLines = specs.split('\n').slice(0, 8);
  let specY = currentY + 20;
  
  specLines.forEach((line: string) => {
    if (line.trim()) {
      doc.text(line.trim(), pageWidth - 15, specY, { 
        align: 'right',
        lang: 'ar',
        renderingMode: 'fill'
      });
      specY += 4;
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
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ملخص العرض', pageWidth - 15, currentY + 12, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  // Calculate pricing
  const basePrice = parseFloat(data.basePrice || '0');
  const quantity = parseInt(data.quantity || '1');
  const platePrice = parseFloat(data.platePrice || '0');
  const subtotal = basePrice * quantity;
  const tax = subtotal * 0.15;
  const total = subtotal + tax + platePrice;
  
  // Create pricing table - optimized for readability
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  let tableY = currentY + 20;
  
  // Table headers
  doc.text('البيان', pageWidth - 15, tableY, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  doc.text('المبلغ (ريال)', pageWidth - 70, tableY, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  // Table rows
  tableY += 5;
  doc.text(`السعر الإفرادي`, pageWidth - 15, tableY, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  doc.text(`${basePrice.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  
  tableY += 4;
  doc.text(`الكمية`, pageWidth - 15, tableY, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  doc.text(`${quantity}`, pageWidth - 70, tableY, { align: 'right' });
  
  tableY += 4;
  doc.text(`الإجمالي قبل الضريبة`, pageWidth - 15, tableY, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  doc.text(`${subtotal.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  
  tableY += 4;
  doc.text(`الضريبة المضافة (%15)`, pageWidth - 15, tableY, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  doc.text(`${tax.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  
  if (platePrice > 0) {
    tableY += 4;
    doc.text(`اللوحات والرسوم`, pageWidth - 15, tableY, { 
      align: 'right',
      lang: 'ar',
      renderingMode: 'fill'
    });
    doc.text(`${platePrice.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  }
  
  tableY += 4;
  doc.text(`المجموع النهائي`, pageWidth - 15, tableY, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  doc.text(`${total.toLocaleString()}`, pageWidth - 70, tableY, { align: 'right' });
  
  // Amount in words - readable font
  doc.setTextColor(...gold);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const amountInWords = formatPriceWithWords(total, 'ريال سعودي');
  doc.text(`المبلغ كتابة: ${amountInWords} فقط لا غير`, pageWidth - 15, tableY + 8, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  currentY += 50;
  
  // Single centered section: QR Code and Signature - made taller for larger stamp
  const bottomY = currentY;
  const sectionWidth = (pageWidth - 20) / 2;
  const centerX = pageWidth / 2 - sectionWidth / 2;
  
  // QR Code and Signature (centered section) - proper size
  doc.setFillColor(240, 245, 255);
  doc.rect(centerX, bottomY, sectionWidth, 40, 'F');
  doc.setDrawColor(...darkTeal);
  doc.rect(centerX, bottomY, sectionWidth, 40, 'S');
  
  // Section title - readable font
  doc.setTextColor(...darkTeal);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('QR Code والتوقيع', centerX + sectionWidth - 5, bottomY + 8, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  // QR Code placeholder
  doc.setFillColor(255, 255, 255);
  doc.rect(centerX + 10, bottomY + 12, 20, 20, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(centerX + 10, bottomY + 12, 20, 20, 'S');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(6);
  doc.text('QR Code', centerX + 20, bottomY + 24, { align: 'center' });
  
  // Company stamp (proper size)
  if (data.companyStamp) {
    try {
      doc.addImage(data.companyStamp, 'JPEG', centerX + sectionWidth - 35, bottomY + 12, 25, 20);
    } catch (error) {
      console.warn('Could not add company stamp to PDF');
    }
  }
  
  // Signature area - readable font
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ختم وتوقيع الشركة', centerX + sectionWidth - 5, bottomY + 35, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  // Footer with Gold background
  doc.setFillColor(...gold);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.companyName || 'شركة البريمي للسيارات'}`, pageWidth - 8, pageHeight - 8, { 
    align: 'right',
    lang: 'ar',
    renderingMode: 'fill'
  });
  doc.text(`الهاتف: ${data.companyPhone || '0112345678'}`, pageWidth/2, pageHeight - 8, { 
    align: 'center',
    lang: 'ar',
    renderingMode: 'fill'
  });
  doc.text(`البريد: ${data.companyEmail || 'info@albarimi.com'}`, 8, pageHeight - 8, {
    lang: 'ar',
    renderingMode: 'fill'
  });
  
  return doc;
}