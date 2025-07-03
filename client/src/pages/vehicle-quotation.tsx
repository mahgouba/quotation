import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Car, 
  User, 
  Calculator, 
  UserCheck, 
  Upload, 
  Calendar,
  FileText,
  Printer,
  FileDown,
  MessageCircle,
  Save,
  QrCode,
  Edit
} from "lucide-react";

// SVG Icons
const FaWhatsapp = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.5-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6z"/>
  </svg>
);

const FaPrint = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5z"/>
  </svg>
);

const FaFilePdf = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M128 0C92.7 0 64 28.7 64 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H128zM384 0V128h128L384 0z"/>
  </svg>
);

const FaSave = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941z"/>
  </svg>
);

const FaEdit = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9z"/>
  </svg>
);

const FaUpload = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24z"/>
  </svg>
);

const VehicleQuotation = () => {
  // Static Data
  const carMakers = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi"];
  const carModelsByMaker: { [key: string]: string[] } = {
    Toyota: ["Camry", "Corolla", "Land Cruiser", "Hilux", "RAV4"],
    Honda: ["Accord", "Civic", "CR-V", "Pilot"],
    Ford: ["Mustang", "F-150", "Explorer", "Focus"],
    BMW: ["3 Series", "5 Series", "X5", "X7"],
    Mercedes: ["C-Class", "E-Class", "S-Class", "GLE"],
    Audi: ["A4", "A6", "Q5", "Q7"],
  };
  const exteriorColors = ["أبيض", "أسود", "فضي", "رمادي", "أحمر", "أزرق"];
  const interiorColors = ["أسود", "بيج", "بني", "رمادي"];

  // State Management
  const [formData, setFormData] = useState({
    customerTitle: "السادة/ ",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    carMaker: "",
    carModel: "",
    exteriorColor: "",
    interiorColor: "",
    quantity: 1,
    basePrice: 0,
    vatRate: 15,
    issueDate: format(new Date(), "yyyy-MM-dd"),
    deadlineDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    platePrice: 0,
    specifications: "",
    includeTax: false,
    salesRepName: "",
    salesRepPhone: "",
    salesRepEmail: "",
    stampImage: null as string | null,
    signatureImage: null as string | null,
    isWarrantied: false,
    isRiyadhDelivery: false,
    includesPlatesAndTax: false,
    totalPrice: 0,
    _display: { subTotal: 0, vat: 0 }
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Effects
  useEffect(() => {
    const calculateTotal = () => {
      const basePriceInput = parseFloat(String(formData.basePrice)) || 0;
      const quantity = parseInt(String(formData.quantity)) || 1;
      const platePrice = parseFloat(String(formData.platePrice)) || 0;
      const vatRate = parseFloat(String(formData.vatRate)) || 15;

      let priceBeforeTax = basePriceInput;

      if (formData.includesPlatesAndTax) {
        priceBeforeTax = basePriceInput / (1 + vatRate / 100);
      }

      const subTotal = priceBeforeTax * quantity;
      const vatAmount = subTotal * (vatRate / 100);
      const finalTotal = subTotal + vatAmount + platePrice;

      setFormData(prev => ({
        ...prev,
        totalPrice: finalTotal,
        _display: { subTotal: subTotal, vat: vatAmount }
      }));
    };
    calculateTotal();
  }, [formData.basePrice, formData.quantity, formData.platePrice, formData.includesPlatesAndTax, formData.vatRate]);

  // Handlers
  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name !== 'carMaker') {
      validateField(name, value);
    }
  };

  const handleMakerChange = (maker: string) => {
    setFormData(prev => ({
      ...prev,
      carMaker: maker,
      carModel: ""
    }));
    setAvailableModels(carModelsByMaker[maker] || []);
  };

  const validateField = (name: string, value: any) => {
    let newErrors = { ...errors };
    if (String(value).trim() === "") {
      newErrors[name] = "هذا الحقل مطلوب";
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Action Functions
  const handlePrint = () => window.print();
  
  const handleSave = () => console.log("Saving data:", formData);

  const handleExportPDF = () => {
    if (typeof (window as any).jspdf === 'undefined' || typeof (window as any).html2canvas === 'undefined') {
      console.error("PDF generation libraries not loaded!");
      return;
    }
    const { jsPDF } = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;

    const input = document.getElementById('quotation-sheet');
    if (!input) return;

    const elementsToHide = input.querySelectorAll('.print-hidden');
    elementsToHide.forEach((el: any) => el.style.visibility = 'hidden');

    html2canvas(input, { scale: 2, useCORS: true, logging: false })
      .then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgRatio = canvas.width / canvas.height;
        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth / imgRatio;

        if (imgHeight > pdfHeight) {
          imgHeight = pdfHeight;
          imgWidth = imgHeight * imgRatio;
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`quotation-${formData.customerName || 'quote'}.pdf`);
        
        elementsToHide.forEach((el: any) => el.style.visibility = 'visible');
      }).catch((err: any) => {
        console.error("PDF generation failed:", err);
        elementsToHide.forEach((el: any) => el.style.visibility = 'visible');
      });
  };

  const handleWhatsAppShare = () => {
    const message = `عرض سعر مركبة\nالعميل: ${formData.customerName}\nالسيارة: ${formData.carMaker} ${formData.carModel}\nالسعر الإجمالي: ${formData.totalPrice.toFixed(2)} ريال سعودي`;
    const whatsappUrl = `https://wa.me/${formData.salesRepPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Arabic Number to Words
  const numberToArabicWords = (number: number | null) => {
    if (number === null || isNaN(number)) return "";
    let num = parseInt(String(number), 10);
    if (num === 0) return "صفر ريال سعودي فقط لا غير";

    const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
    const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
    const hundreds = ["", "مئة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];

    let words = [];
    let remaining = num;

    if (remaining >= 1000000) {
      const millions = Math.floor(remaining / 1000000);
      words.push(millions === 1 ? "مليون" : millions === 2 ? "مليونان" : millions + " ملايين");
      remaining %= 1000000;
    }

    if (remaining >= 1000) {
      const thousands = Math.floor(remaining / 1000);
      words.push(thousands === 1 ? "ألف" : thousands === 2 ? "ألفان" : thousands + " آلاف");
      remaining %= 1000;
    }

    if (remaining >= 100) {
      words.push(hundreds[Math.floor(remaining / 100)]);
      remaining %= 100;
    }

    if (remaining >= 10) {
      if (remaining >= 11 && remaining <= 19) {
        if (remaining === 11) words.push("أحد عشر");
        else if (remaining === 12) words.push("اثنا عشر");
        else words.push(ones[remaining % 10] + " عشر");
      } else {
        const unit = ones[remaining % 10];
        const ten = tens[Math.floor(remaining / 10)];
        if (unit && ten) words.push(unit + " و" + ten);
        else if (unit) words.push(unit);
        else if (ten) words.push(ten);
      }
    } else if (remaining > 0) {
      words.push(ones[remaining]);
    }

    return words.join(" ") + " ريال سعودي فقط لا غير";
  };

  return (
    <div className="bg-background min-h-screen" dir="rtl">
      {/* Action Buttons Section */}
      <div className="no-print bg-card shadow-md mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center items-center space-x-4 space-x-reverse">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
              <FaSave className="ml-2" />
              <span>حفظ</span>
            </Button>
            <Button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700 text-white">
              <FaFilePdf className="ml-2" />
              <span>تصدير PDF</span>
            </Button>
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
              <FaPrint className="ml-2" />
              <span>طباعة</span>
            </Button>
            <Button onClick={handleWhatsAppShare} className="bg-green-500 hover:bg-green-600 text-white">
              <FaWhatsapp className="ml-2" />
              <span>واتساب</span>
            </Button>
          </div>
        </div>
      </div>

      {/* A4 Quotation Sheet */}
      <div className="container mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Controls */}
          <div className="no-print space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">بيانات العميل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerTitle">اللقب</Label>
                  <Select value={formData.customerTitle} onValueChange={(value) => handleInputChange('customerTitle', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="السادة/ ">السادة/</SelectItem>
                      <SelectItem value="السيد/ ">السيد/</SelectItem>
                      <SelectItem value="الأستاذ/ ">الأستاذ/</SelectItem>
                      <SelectItem value="الدكتور/ ">الدكتور/</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="customerName">اسم العميل *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="أدخل اسم العميل"
                  />
                  {errors.customerName && <span className="text-destructive text-sm">{errors.customerName}</span>}
                </div>
                <div>
                  <Label htmlFor="customerPhone">رقم الهاتف *</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="05xxxxxxxx"
                  />
                  {errors.customerPhone && <span className="text-destructive text-sm">{errors.customerPhone}</span>}
                </div>
                <div>
                  <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="example@email.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">بيانات المركبة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="carMaker">ماركة السيارة *</Label>
                  <Select value={formData.carMaker} onValueChange={handleMakerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الماركة" />
                    </SelectTrigger>
                    <SelectContent>
                      {carMakers.map(maker => (
                        <SelectItem key={maker} value={maker}>{maker}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="carModel">موديل السيارة *</Label>
                  <Select value={formData.carModel} onValueChange={(value) => handleInputChange('carModel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الموديل" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exteriorColor">اللون الخارجي</Label>
                  <Select value={formData.exteriorColor} onValueChange={(value) => handleInputChange('exteriorColor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر اللون" />
                    </SelectTrigger>
                    <SelectContent>
                      {exteriorColors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="interiorColor">اللون الداخلي</Label>
                  <Select value={formData.interiorColor} onValueChange={(value) => handleInputChange('interiorColor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر اللون" />
                    </SelectTrigger>
                    <SelectContent>
                      {interiorColors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">الكمية</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label htmlFor="basePrice">السعر الأساسي (ريال)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="specifications">المواصفات الإضافية</Label>
                  <Textarea
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => handleInputChange('specifications', e.target.value)}
                    placeholder="أدخل المواصفات والملحقات الإضافية"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-3 h-5 w-5 text-primary" />
                  تفاصيل السعر
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vatRate">نسبة الضريبة (%)</Label>
                  <Input
                    id="vatRate"
                    type="number"
                    step="0.01"
                    value={formData.vatRate}
                    onChange={(e) => handleInputChange('vatRate', parseFloat(e.target.value) || 15)}
                  />
                </div>
                <div>
                  <Label htmlFor="platePrice">سعر اللوحة (ريال)</Label>
                  <Input
                    id="platePrice"
                    type="number"
                    step="0.01"
                    value={formData.platePrice}
                    onChange={(e) => handleInputChange('platePrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="includesTax"
                      checked={formData.includesPlatesAndTax}
                      onCheckedChange={(checked) => handleInputChange('includesPlatesAndTax', checked)}
                    />
                    <Label htmlFor="includesTax">السعر المدخل شامل الضريبة</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="warrantyIncluded"
                      checked={formData.isWarrantied}
                      onCheckedChange={(checked) => handleInputChange('isWarrantied', checked)}
                    />
                    <Label htmlFor="warrantyIncluded">يشمل الضمان</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="riyadhDelivery"
                      checked={formData.isRiyadhDelivery}
                      onCheckedChange={(checked) => handleInputChange('isRiyadhDelivery', checked)}
                    />
                    <Label htmlFor="riyadhDelivery">التوصيل داخل الرياض</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sales Representative */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-3 h-5 w-5 text-primary" />
                  بيانات مندوب المبيعات
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salesRepName">اسم المندوب</Label>
                  <Input
                    id="salesRepName"
                    value={formData.salesRepName}
                    onChange={(e) => handleInputChange('salesRepName', e.target.value)}
                    placeholder="أدخل اسم المندوب"
                  />
                </div>
                <div>
                  <Label htmlFor="salesRepPhone">رقم الهاتف</Label>
                  <Input
                    id="salesRepPhone"
                    type="tel"
                    value={formData.salesRepPhone}
                    onChange={(e) => handleInputChange('salesRepPhone', e.target.value)}
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="salesRepEmail">البريد الإلكتروني</Label>
                  <Input
                    id="salesRepEmail"
                    type="email"
                    value={formData.salesRepEmail}
                    onChange={(e) => handleInputChange('salesRepEmail', e.target.value)}
                    placeholder="sales@company.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-3 h-5 w-5 text-primary" />
                  الختم والتوقيع
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stampUpload">ختم الشركة</Label>
                  <div className="border-2 border-dashed border-input rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">اسحب الملف هنا أو انقر للتحديد</p>
                    <input
                      id="stampUpload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'stampImage')}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signatureUpload">توقيع المندوب</Label>
                  <div className="border-2 border-dashed border-input rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">اسحب الملف هنا أو انقر للتحديد</p>
                    <input
                      id="signatureUpload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'signatureImage')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 text-primary" />
                  تواريخ مهمة
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">تاريخ إصدار العرض</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="deadlineDate">تاريخ انتهاء العرض</Label>
                  <Input
                    id="deadlineDate"
                    type="date"
                    value={formData.deadlineDate}
                    onChange={(e) => handleInputChange('deadlineDate', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  ملخص العرض
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">تفاصيل السعر</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">السعر الأساسي:</span>
                        <span className="font-medium">{formData.basePrice.toFixed(2)} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الكمية:</span>
                        <span className="font-medium">{formData.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الإجمالي قبل الضريبة:</span>
                        <span className="font-medium">{formData._display.subTotal.toFixed(2)} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الضريبة المضافة ({formData.vatRate}%):</span>
                        <span className="font-medium">{formData._display.vat.toFixed(2)} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">سعر اللوحة:</span>
                        <span className="font-medium">{formData.platePrice.toFixed(2)} ريال</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">الإجمالي النهائي:</span>
                        <span className="font-bold text-primary text-lg">{formData.totalPrice.toFixed(2)} ريال</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">المبلغ بالكلمات</h3>
                    <p className="text-sm text-muted-foreground">{numberToArabicWords(formData.totalPrice)}</p>
                  </div>

                  <div className="space-y-3">
                    <Button onClick={handlePrint} className="w-full print-hidden">
                      <Printer className="mr-2 h-4 w-4" />
                      طباعة العرض
                    </Button>
                    <Button onClick={handleExportPDF} className="w-full accent-green print-hidden">
                      <FileDown className="mr-2 h-4 w-4" />
                      تصدير PDF
                    </Button>
                    <Button onClick={handleWhatsAppShare} className="w-full bg-green-500 hover:bg-green-600 text-white print-hidden">
                      <FaWhatsapp />
                      <span className="mr-2">مشاركة واتساب</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quotation Sheet */}
        <Card id="quotation-sheet" className="mt-8 print:shadow-none print:bg-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">عرض سعر مركبة</h1>
              <p className="text-muted-foreground">Vehicle Quotation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">بيانات العميل</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-24 text-muted-foreground">الاسم:</span>
                    <span className="font-medium">{formData.customerTitle}{formData.customerName || "غير محدد"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-muted-foreground">الهاتف:</span>
                    <span className="font-medium">{formData.customerPhone || "غير محدد"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-muted-foreground">البريد:</span>
                    <span className="font-medium">{formData.customerEmail || "غير محدد"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">بيانات المركبة</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-24 text-muted-foreground">الماركة:</span>
                    <span className="font-medium">{formData.carMaker || "غير محدد"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-muted-foreground">الموديل:</span>
                    <span className="font-medium">{formData.carModel || "غير محدد"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-muted-foreground">اللون:</span>
                    <span className="font-medium">{formData.exteriorColor || "غير محدد"} / {formData.interiorColor || "غير محدد"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">تفاصيل الأسعار</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-4 py-2 text-right">البيان</th>
                      <th className="border border-border px-4 py-2 text-right">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2">سعر السيارة</td>
                      <td className="border border-border px-4 py-2 font-medium">{formData.basePrice.toFixed(2)} ريال</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">الكمية</td>
                      <td className="border border-border px-4 py-2 font-medium">{formData.quantity}</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">الإجمالي قبل الضريبة</td>
                      <td className="border border-border px-4 py-2 font-medium">{formData._display.subTotal.toFixed(2)} ريال</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">الضريبة المضافة ({formData.vatRate}%)</td>
                      <td className="border border-border px-4 py-2 font-medium">{formData._display.vat.toFixed(2)} ريال</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">سعر اللوحة</td>
                      <td className="border border-border px-4 py-2 font-medium">{formData.platePrice.toFixed(2)} ريال</td>
                    </tr>
                    <tr className="bg-primary-50">
                      <td className="border border-border px-4 py-2 font-semibold">الإجمالي النهائي</td>
                      <td className="border border-border px-4 py-2 font-bold text-primary">{formData.totalPrice.toFixed(2)} ريال</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">الشروط والأحكام</h3>
              <div className="bg-muted p-4 rounded-lg">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• هذا العرض ساري لمدة 15 يوماً من تاريخ الإصدار</li>
                  <li>• الأسعار شاملة الضريبة المضافة</li>
                  <li>• يتم التسليم خلال 30 يوماً من تاريخ تأكيد الطلب</li>
                  <li>• الضمان وفقاً لشروط الوكيل المعتمد</li>
                  <li>• الدفع نقداً أو بالتقسيط حسب الاتفاق</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <div className="border-b-2 border-border pb-2 mb-2 h-20 flex items-center justify-center">
                  {formData.signatureImage && (
                    <img src={formData.signatureImage} alt="توقيع المندوب" className="max-h-16" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">توقيع العميل</p>
              </div>
              <div className="text-center">
                <div className="border-b-2 border-border pb-2 mb-2 h-20 flex items-center justify-center">
                  {formData.stampImage && (
                    <img src={formData.stampImage} alt="ختم الشركة" className="max-h-16" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">ختم وتوقيع الشركة</p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>تم إنشاء هذا العرض بواسطة نظام عروض الأسعار الإلكتروني</p>
              <p>تاريخ الإصدار: {formData.issueDate} | انتهاء العرض: {formData.deadlineDate}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleQuotation;
