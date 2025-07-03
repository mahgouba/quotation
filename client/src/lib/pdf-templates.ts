import { jsPDF } from 'jspdf';

export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  layout: 'modern' | 'classic' | 'minimal' | 'corporate';
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  fonts: {
    header: { size: number; weight: 'normal' | 'bold' };
    body: { size: number; weight: 'normal' | 'bold' };
    footer: { size: number; weight: 'normal' | 'bold' };
  };
  spacing: {
    margin: number;
    sectionGap: number;
    lineHeight: number;
  };
  elements: {
    showLogo: boolean;
    showQRCode: boolean;
    showWatermark: boolean;
    headerStyle: 'full' | 'compact' | 'banner';
    tableStyle: 'bordered' | 'striped' | 'minimal';
  };
}

export const defaultTemplates: PDFTemplate[] = [
  {
    id: 'modern',
    name: 'عصري',
    description: 'تصميم عصري مع ألوان متدرجة',
    layout: 'modern',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      text: '#1f2937',
      background: '#ffffff'
    },
    fonts: {
      header: { size: 18, weight: 'bold' },
      body: { size: 11, weight: 'normal' },
      footer: { size: 9, weight: 'normal' }
    },
    spacing: {
      margin: 20,
      sectionGap: 15,
      lineHeight: 1.4
    },
    elements: {
      showLogo: true,
      showQRCode: true,
      showWatermark: true,
      headerStyle: 'full',
      tableStyle: 'bordered'
    }
  },
  {
    id: 'classic',
    name: 'كلاسيكي',
    description: 'تصميم كلاسيكي رسمي',
    layout: 'classic',
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      text: '#000000',
      background: '#ffffff'
    },
    fonts: {
      header: { size: 16, weight: 'bold' },
      body: { size: 10, weight: 'normal' },
      footer: { size: 8, weight: 'normal' }
    },
    spacing: {
      margin: 25,
      sectionGap: 12,
      lineHeight: 1.3
    },
    elements: {
      showLogo: true,
      showQRCode: false,
      showWatermark: false,
      headerStyle: 'compact',
      tableStyle: 'minimal'
    }
  },
  {
    id: 'minimal',
    name: 'بسيط',
    description: 'تصميم بسيط ونظيف',
    layout: 'minimal',
    colors: {
      primary: '#059669',
      secondary: '#065f46',
      text: '#374151',
      background: '#ffffff'
    },
    fonts: {
      header: { size: 14, weight: 'bold' },
      body: { size: 10, weight: 'normal' },
      footer: { size: 8, weight: 'normal' }
    },
    spacing: {
      margin: 15,
      sectionGap: 10,
      lineHeight: 1.2
    },
    elements: {
      showLogo: false,
      showQRCode: true,
      showWatermark: false,
      headerStyle: 'banner',
      tableStyle: 'minimal'
    }
  },
  {
    id: 'corporate',
    name: 'مؤسسي',
    description: 'تصميم مؤسسي احترافي',
    layout: 'corporate',
    colors: {
      primary: '#dc2626',
      secondary: '#991b1b',
      text: '#1f2937',
      background: '#ffffff'
    },
    fonts: {
      header: { size: 20, weight: 'bold' },
      body: { size: 12, weight: 'normal' },
      footer: { size: 10, weight: 'normal' }
    },
    spacing: {
      margin: 30,
      sectionGap: 18,
      lineHeight: 1.5
    },
    elements: {
      showLogo: true,
      showQRCode: true,
      showWatermark: true,
      headerStyle: 'full',
      tableStyle: 'striped'
    }
  }
];

export class PDFTemplateEngine {
  private doc: jsPDF;
  private template: PDFTemplate;
  private pageWidth: number;
  private pageHeight: number;
  private currentY: number;

  constructor(template: PDFTemplate) {
    this.template = template;
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.currentY = template.spacing.margin;
    
    // Set up RTL support and fonts
    this.setupDocument();
  }

  private setupDocument() {
    // Set document properties
    this.doc.setLanguage('ar');
    this.doc.setR2L(true);
    
    // Set default text color
    this.doc.setTextColor(this.template.colors.text);
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ]
      : [0, 0, 0];
  }

  private addBackground() {
    if (this.template.elements.showWatermark) {
      // Set background with watermark effect
      this.doc.setFillColor(...this.hexToRgb(this.template.colors.primary));
      this.doc.setGlobalAlpha(0.1);
      this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
      this.doc.setGlobalAlpha(1.0);
    }
  }

  private addHeader(data: any) {
    const startY = this.currentY;
    
    if (this.template.elements.headerStyle === 'full') {
      // Full header with gradient background
      this.doc.setFillColor(...this.hexToRgb(this.template.colors.primary));
      this.doc.rect(0, 0, this.pageWidth, 50, 'F');
      
      // Company logo
      if (this.template.elements.showLogo && data.companyLogo) {
        try {
          this.doc.addImage(data.companyLogo, 'JPEG', this.pageWidth - 50, 10, 30, 30);
        } catch (error) {
          console.warn('Could not add logo to PDF');
        }
      }
      
      // Company name
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(this.template.fonts.header.size);
      this.doc.text(data.companyName || 'اسم الشركة', this.template.spacing.margin, 25, { align: 'left' });
      
      // Company details
      this.doc.setFontSize(this.template.fonts.body.size);
      this.doc.text(data.companyAddress || 'عنوان الشركة', this.template.spacing.margin, 35, { align: 'left' });
      this.doc.text(data.companyPhone || 'رقم الهاتف', this.template.spacing.margin, 42, { align: 'left' });
      
      this.currentY = 60;
    } else if (this.template.elements.headerStyle === 'compact') {
      // Compact header
      this.doc.setTextColor(...this.hexToRgb(this.template.colors.text));
      this.doc.setFontSize(this.template.fonts.header.size);
      this.doc.text(data.companyName || 'اسم الشركة', this.pageWidth - this.template.spacing.margin, this.currentY, { align: 'right' });
      
      if (this.template.elements.showLogo && data.companyLogo) {
        try {
          this.doc.addImage(data.companyLogo, 'JPEG', this.template.spacing.margin, this.currentY - 10, 20, 20);
        } catch (error) {
          console.warn('Could not add logo to PDF');
        }
      }
      
      this.currentY += this.template.spacing.sectionGap;
    } else if (this.template.elements.headerStyle === 'banner') {
      // Banner style header
      this.doc.setDrawColor(...this.hexToRgb(this.template.colors.primary));
      this.doc.setLineWidth(2);
      this.doc.line(this.template.spacing.margin, this.currentY, this.pageWidth - this.template.spacing.margin, this.currentY);
      
      this.currentY += 10;
      this.doc.setTextColor(...this.hexToRgb(this.template.colors.primary));
      this.doc.setFontSize(this.template.fonts.header.size);
      this.doc.text(data.companyName || 'اسم الشركة', this.pageWidth / 2, this.currentY, { align: 'center' });
      
      this.currentY += this.template.spacing.sectionGap;
    }
  }

  private addQuotationTitle() {
    this.doc.setTextColor(...this.hexToRgb(this.template.colors.primary));
    this.doc.setFontSize(this.template.fonts.header.size + 2);
    this.doc.text('عرض سعر', this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += this.template.spacing.sectionGap;
  }

  private addSection(title: string, content: string[]) {
    // Section title
    this.doc.setTextColor(...this.hexToRgb(this.template.colors.primary));
    this.doc.setFontSize(this.template.fonts.body.size + 1);
    this.doc.text(title, this.pageWidth - this.template.spacing.margin, this.currentY, { align: 'right' });
    this.currentY += 8;
    
    // Section content
    this.doc.setTextColor(...this.hexToRgb(this.template.colors.text));
    this.doc.setFontSize(this.template.fonts.body.size);
    
    content.forEach(line => {
      this.doc.text(line, this.pageWidth - this.template.spacing.margin, this.currentY, { align: 'right' });
      this.currentY += this.template.fonts.body.size * this.template.spacing.lineHeight;
    });
    
    this.currentY += this.template.spacing.sectionGap;
  }

  private addPricingTable(data: any) {
    const tableStartY = this.currentY;
    const colWidths = [40, 30, 30, 30, 40];
    const rowHeight = 12;
    
    // Table headers
    const headers = ['المجموع', 'سعر الوحدة', 'الكمية', 'الوصف', 'البند'];
    
    if (this.template.elements.tableStyle === 'bordered') {
      // Draw table borders
      this.doc.setDrawColor(...this.hexToRgb(this.template.colors.primary));
      this.doc.setLineWidth(0.5);
      
      // Header background
      this.doc.setFillColor(...this.hexToRgb(this.template.colors.primary));
      this.doc.rect(this.template.spacing.margin, tableStartY, 170, rowHeight, 'F');
    }
    
    // Header text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(this.template.fonts.body.size);
    
    let currentX = this.pageWidth - this.template.spacing.margin;
    headers.forEach((header, index) => {
      currentX -= colWidths[index];
      this.doc.text(header, currentX + colWidths[index] / 2, tableStartY + 8, { align: 'center' });
    });
    
    this.currentY = tableStartY + rowHeight + 5;
    
    // Table rows
    const rows = [
      ['1', `${data.carMaker} ${data.carModel}`, data.quantity?.toString() || '1', data.basePrice?.toString() || '0', data.basePrice?.toString() || '0'],
      ['2', 'ضريبة القيمة المضافة', '1', data._display?.vat?.toString() || '0', data._display?.vat?.toString() || '0'],
      ['3', 'رسوم اللوحات', data.quantity?.toString() || '1', data.platePrice?.toString() || '0', (data.platePrice * (data.quantity || 1))?.toString() || '0']
    ];
    
    this.doc.setTextColor(...this.hexToRgb(this.template.colors.text));
    
    rows.forEach((row, rowIndex) => {
      if (this.template.elements.tableStyle === 'striped' && rowIndex % 2 === 0) {
        this.doc.setFillColor(245, 245, 245);
        this.doc.rect(this.template.spacing.margin, this.currentY - 5, 170, rowHeight, 'F');
      }
      
      currentX = this.pageWidth - this.template.spacing.margin;
      row.forEach((cell, cellIndex) => {
        currentX -= colWidths[cellIndex];
        this.doc.text(cell, currentX + colWidths[cellIndex] / 2, this.currentY + 3, { align: 'center' });
      });
      
      if (this.template.elements.tableStyle === 'bordered') {
        this.doc.setDrawColor(...this.hexToRgb(this.template.colors.primary));
        this.doc.line(this.template.spacing.margin, this.currentY + rowHeight - 5, this.pageWidth - this.template.spacing.margin, this.currentY + rowHeight - 5);
      }
      
      this.currentY += rowHeight;
    });
    
    // Total row
    this.doc.setFillColor(...this.hexToRgb(this.template.colors.secondary));
    this.doc.rect(this.template.spacing.margin, this.currentY - 5, 170, rowHeight, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('المجموع الإجمالي', this.pageWidth - this.template.spacing.margin - 85, this.currentY + 3, { align: 'center' });
    this.doc.text(`${data.totalPrice || 0} ريال`, this.template.spacing.margin + 20, this.currentY + 3, { align: 'center' });
    
    this.currentY += rowHeight + this.template.spacing.sectionGap;
  }

  private addFooter(data: any) {
    const footerY = this.pageHeight - 40;
    
    // Terms and conditions
    this.doc.setTextColor(...this.hexToRgb(this.template.colors.text));
    this.doc.setFontSize(this.template.fonts.footer.size);
    
    const terms = [
      'الشروط والأحكام:',
      '• عرض السعر صالح لمدة 15 يوماً من تاريخ الإصدار',
      '• الأسعار شاملة ضريبة القيمة المضافة',
      '• سعر اللوحات خاضع للكمية وغير خاضع للضريبة',
      '• يتم التسليم خلال 7-10 أيام عمل من تاريخ التأكيد'
    ];
    
    let currentFooterY = footerY - (terms.length * 8);
    terms.forEach(term => {
      this.doc.text(term, this.pageWidth - this.template.spacing.margin, currentFooterY, { align: 'right' });
      currentFooterY += 8;
    });
    
    // QR Code
    if (this.template.elements.showQRCode) {
      const qrData = `عرض سعر - ${data.customerName} - ${data.carMaker} ${data.carModel} - ${data.totalPrice} ريال`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(qrData)}`;
      
      try {
        this.doc.addImage(qrUrl, 'PNG', this.template.spacing.margin, footerY, 15, 15);
      } catch (error) {
        console.warn('Could not add QR code to PDF');
      }
    }
    
    // Signature area
    this.doc.setDrawColor(...this.hexToRgb(this.template.colors.primary));
    this.doc.line(this.pageWidth - 80, footerY + 10, this.pageWidth - this.template.spacing.margin, footerY + 10);
    this.doc.text('توقيع المندوب', this.pageWidth - 50, footerY + 18, { align: 'center' });
  }

  public generatePDF(data: any): jsPDF {
    // Add background
    this.addBackground();
    
    // Add header
    this.addHeader(data);
    
    // Add quotation title
    this.addQuotationTitle();
    
    // Add customer section
    this.addSection('بيانات العميل', [
      `${data.customerTitle || ''}${data.customerName || 'غير محدد'}`,
      `الهاتف: ${data.customerPhone || 'غير محدد'}`,
      `البريد الإلكتروني: ${data.customerEmail || 'غير محدد'}`
    ]);
    
    // Add vehicle section
    this.addSection('بيانات المركبة', [
      `الماركة: ${data.carMaker || 'غير محدد'}`,
      `الموديل: ${data.carModel || 'غير محدد'}`,
      `السنة: ${data.carYear || 'غير محدد'}`,
      `اللون الخارجي: ${data.exteriorColor || 'غير محدد'}`,
      `اللون الداخلي: ${data.interiorColor || 'غير محدد'}`
    ]);
    
    // Add sales representative section
    if (data.salesRepName) {
      this.addSection('بيانات المندوب', [
        `الاسم: ${data.salesRepName}`,
        `الهاتف: ${data.salesRepPhone || 'غير محدد'}`,
        `البريد الإلكتروني: ${data.salesRepEmail || 'غير محدد'}`
      ]);
    }
    
    // Add pricing table
    this.addPricingTable(data);
    
    // Add total in words
    this.addSection('المبلغ كتاباً', [
      data.totalInWords || 'غير محدد'
    ]);
    
    // Add footer
    this.addFooter(data);
    
    return this.doc;
  }
}

export const generateCustomPDF = (data: any, templateId: string = 'modern'): jsPDF => {
  const template = defaultTemplates.find(t => t.id === templateId) || defaultTemplates[0];
  const engine = new PDFTemplateEngine(template);
  return engine.generatePDF(data);
};