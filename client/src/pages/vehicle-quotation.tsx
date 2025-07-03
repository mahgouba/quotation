import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getVehicleSpecifications, getAvailableMakes, getModelsForMake, getYearsForMakeAndModel } from "@/data/vehicle-specifications";
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
  Edit,
  Search,
  Home,
  Database
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

// Interface for database vehicle specifications
interface DatabaseVehicleSpec {
  id: number;
  make: string;
  model: string;
  year: number;
  engine: string;
  specifications: string;
}

const VehicleQuotation = () => {
  // Static Data - Using Arabic names from vehicle specifications database
  const carMakers = getAvailableMakes();
  const exteriorColors = ["أبيض", "أسود", "فضي", "رمادي", "أحمر", "أزرق"];
  const interiorColors = ["أسود", "بيج", "بني", "رمادي"];

  // Fetch vehicle specifications from database
  const { data: databaseSpecs = [] } = useQuery<DatabaseVehicleSpec[]>({
    queryKey: ['/api/vehicle-specs'],
    queryFn: async () => {
      const response = await fetch('/api/vehicle-specs');
      if (!response.ok) throw new Error('Failed to fetch vehicle specs');
      return response.json();
    }
  });

  // Fetch companies from database
  const { data: companies = [] } = useQuery<any[]>({
    queryKey: ['/api/companies'],
    queryFn: async () => {
      const response = await fetch('/api/companies');
      if (!response.ok) throw new Error('Failed to fetch companies');
      return response.json();
    }
  });

  // State Management
  const [formData, setFormData] = useState({
    customerTitle: "السادة/ ",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    carMaker: "",
    carModel: "",
    carYear: "",
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

    companyLogo: null as string | null,
    isWarrantied: false,
    isRiyadhDelivery: false,
    includesPlatesAndTax: false,
    totalPrice: 0,
    whatsappNumber: "",
    selectedCompanyId: "",
    companyName: "اسم الشركة",
    companyAddress: "عنوان الشركة",
    companyPhone: "رقم هاتف الشركة",
    companyEmail: "البريد الإلكتروني للشركة",
    companyStamp: null,
    companyPrimaryColor: "#3b82f6",
    companySecondaryColor: "#1e40af", 
    companyTextColor: "#1f2937",
    companyBackgroundColor: "#ffffff",
    detailedSpecs: "",
    _display: { subTotal: 0, vat: 0 }
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [vehicleSpecs, setVehicleSpecs] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Save quotation mutation
  const saveQuotationMutation = useMutation({
    mutationFn: async (quotationData: any) => {
      const response = await fetch("/api/quotations/complete", {
        method: "POST",
        body: JSON.stringify(quotationData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to save quotation");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ عرض السعر في قاعدة البيانات",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
    },
    onError: () => {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ عرض السعر",
        variant: "destructive",
      });
    },
  });

  // Helper functions for database specs
  const getAvailableMakesFromDB = () => {
    const makes = Array.from(new Set(databaseSpecs.map(spec => spec.make)));
    return makes.length > 0 ? makes : carMakers;
  };
  
  const getModelsForMakeFromDB = (make: string) => {
    const models = databaseSpecs
      .filter(spec => spec.make === make)
      .map(spec => spec.model);
    return Array.from(new Set(models));
  };
  
  const getYearsForMakeAndModelFromDB = (make: string, model: string) => {
    const years = databaseSpecs
      .filter(spec => spec.make === make && spec.model === model)
      .map(spec => spec.year);
    return Array.from(new Set(years));
  };
  
  const getSpecificationsFromDB = (make: string, model: string, year: number) => {
    return databaseSpecs.find(spec => 
      spec.make === make && spec.model === model && spec.year === year
    );
  };

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

  // Update company data when company is selected
  const handleCompanyChange = (companyId: string) => {
    const selectedCompany = companies.find(c => c.id === parseInt(companyId));
    if (selectedCompany) {
      setFormData(prev => ({
        ...prev,
        selectedCompanyId: companyId,
        companyName: selectedCompany.name,
        companyAddress: selectedCompany.address || "عنوان الشركة",
        companyPhone: selectedCompany.phone || "رقم هاتف الشركة",
        companyEmail: selectedCompany.email || "البريد الإلكتروني للشركة",
        companyLogo: selectedCompany.logo || null,
        companyStamp: selectedCompany.stamp || null,
        companyPrimaryColor: selectedCompany.primaryColor || "#3b82f6",
        companySecondaryColor: selectedCompany.secondaryColor || "#1e40af",
        companyTextColor: selectedCompany.textColor || "#1f2937",
        companyBackgroundColor: selectedCompany.backgroundColor || "#ffffff"
      }));
    }
  };

  const handleMakerChange = (maker: string) => {
    setFormData(prev => ({
      ...prev,
      carMaker: maker,
      carModel: "",
      carYear: "",
      specifications: ""
    }));
    
    // Use database specs first, fallback to static data
    const models = getModelsForMakeFromDB(maker);
    if (models.length > 0) {
      setAvailableModels(models);
    } else {
      setAvailableModels(getModelsForMake(maker));
    }
    
    setAvailableYears([]);
    setVehicleSpecs(null);
  };

  const handleModelChange = (model: string) => {
    setFormData(prev => ({
      ...prev,
      carModel: model,
      carYear: "",
      specifications: ""
    }));
    
    // Use database specs first, fallback to static data
    const years = getYearsForMakeAndModelFromDB(formData.carMaker, model);
    if (years.length > 0) {
      setAvailableYears(years);
    } else {
      setAvailableYears(getYearsForMakeAndModel(formData.carMaker, model));
    }
    
    setVehicleSpecs(null);
  };

  const handleYearChange = (year: string) => {
    setFormData(prev => ({
      ...prev,
      carYear: year
    }));
    
    // First try to get specifications from database
    const dbSpecs = getSpecificationsFromDB(formData.carMaker, formData.carModel, parseInt(year));
    
    if (dbSpecs) {
      // Use database specifications
      setVehicleSpecs(dbSpecs);
      setFormData(prev => ({
        ...prev,
        specifications: dbSpecs.specifications
      }));
    } else {
      // Fallback to static specifications
      const specs = getVehicleSpecifications(formData.carMaker, formData.carModel, parseInt(year));
      setVehicleSpecs(specs);
      
      if (specs) {
        const specsText = `المحرك: ${specs.specifications.engine}
القوة: ${specs.specifications.horsepower}
العزم: ${specs.specifications.torque}
ناقل الحركة: ${specs.specifications.transmission}
نوع الدفع: ${specs.specifications.driveType}
نوع الوقود: ${specs.specifications.fuelType}
استهلاك الوقود: ${specs.specifications.fuelConsumption}
السرعة القصوى: ${specs.specifications.topSpeed}
التسارع: ${specs.specifications.acceleration}
الأبعاد: ${specs.specifications.dimensions.length} x ${specs.specifications.dimensions.width} x ${specs.specifications.dimensions.height}
الوزن: ${specs.specifications.weight}
سعة الركاب: ${specs.specifications.seatingCapacity}
سعة الشنطة: ${specs.specifications.trunkCapacity}`;
        
        const detailedSpecsText = `المحرك: ${specs.specifications.engine}
القوة: ${specs.specifications.horsepower}
عزم الدوران: ${specs.specifications.torque}
ناقل الحركة: ${specs.specifications.transmission}
نوع الدفع: ${specs.specifications.driveType}
نوع الوقود: ${specs.specifications.fuelType}
سعة خزان الوقود: ${specs.specifications.fuelCapacity}
استهلاك الوقود: ${specs.specifications.fuelConsumption}
السرعة القصوى: ${specs.specifications.topSpeed}
التسارع: ${specs.specifications.acceleration}

الأبعاد:
- الطول: ${specs.specifications.dimensions.length}
- العرض: ${specs.specifications.dimensions.width}
- الارتفاع: ${specs.specifications.dimensions.height}
- قاعدة العجلات: ${specs.specifications.dimensions.wheelbase}

الوزن: ${specs.specifications.weight}
عدد المقاعد: ${specs.specifications.seatingCapacity}
سعة الصندوق: ${specs.specifications.trunkCapacity}

ميزات السلامة: ${specs.specifications.safetyFeatures.join(', ')}
المميزات التقنية: ${specs.specifications.techFeatures.join(', ')}
المظهر الخارجي: ${specs.specifications.exteriorFeatures.join(', ')}
المظهر الداخلي: ${specs.specifications.interiorFeatures.join(', ')}`;
        
        setFormData(prev => ({
          ...prev,
          specifications: specsText,
          detailedSpecs: detailedSpecsText
        }));
      }
    }
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

  // QR Code generation function
  const generateQRCode = (text: string) => {
    // Simple QR code using a web service (you could replace with a proper QR library)
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(text)}`;
  };

  // Action Functions
  const handlePrint = () => {
    // Generate PDF first, then print it
    handleExportPDF();
  };
  
  const handleSave = () => {
    // Validate required fields
    if (!formData.customerName) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم العميل",
        variant: "destructive",
      });
      return;
    }

    if (!formData.carMaker || !formData.carModel) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال بيانات المركبة",
        variant: "destructive",
      });
      return;
    }

    if (!formData.basePrice || formData.basePrice <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال سعر صحيح",
        variant: "destructive",
      });
      return;
    }

    // Prepare data for API
    const quotationData = {
      customer: {
        title: formData.customerTitle,
        name: formData.customerName,
        email: formData.customerEmail || null,
        phone: formData.customerPhone || null,
      },
      vehicle: {
        maker: formData.carMaker,
        model: formData.carModel,
        exteriorColor: formData.exteriorColor || null,
        interiorColor: formData.interiorColor || null,
        specifications: formData.specifications || null,
        detailedSpecs: formData.detailedSpecs || null,
      },
      company: {
        name: formData.companyName,
        address: formData.companyAddress || null,
        phone: formData.companyPhone || null,
        email: formData.companyEmail || null,
        logo: formData.companyLogo || null,
      },
      quotation: {
        quantity: formData.quantity,
        basePrice: formData.basePrice.toString(),
        vatRate: formData.vatRate.toString(),
        platePrice: formData.platePrice.toString(),
        totalPrice: formData.totalPrice.toString(),
        issueDate: new Date(formData.issueDate),
        deadlineDate: new Date(formData.deadlineDate),
        includesPlatesAndTax: formData.includesPlatesAndTax,
        isWarrantied: formData.isWarrantied,
        isRiyadhDelivery: formData.isRiyadhDelivery,
        salesRepName: formData.salesRepName || null,
        salesRepPhone: formData.salesRepPhone || null,
        salesRepEmail: formData.salesRepEmail || null,

        status: "draft",
      },
    };

    saveQuotationMutation.mutate(quotationData);
  };

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
    if (!formData.whatsappNumber) {
      alert("يرجى إدخال رقم الواتساب أولاً");
      return;
    }

    // First generate and download PDF
    handleExportPDF();
    
    // Then prepare WhatsApp message
    const message = `عرض سعر مركبة\n\nالعميل: ${formData.customerName}\nالسيارة: ${formData.carMaker} ${formData.carModel}\nالسعر الإجمالي: ${formData.totalPrice.toFixed(2)} ريال سعودي\n\nتم إرفاق ملف PDF مع التفاصيل الكاملة.`;
    
    const cleanNumber = formData.whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    // Show instructions to user
    setTimeout(() => {
      const confirmed = confirm(`سيتم فتح الواتساب. يرجى إرفاق ملف PDF الذي تم تنزيله مع الرسالة.\n\nالرقم المرسل إليه: ${cleanNumber}\n\nهل تريد المتابعة؟`);
      if (confirmed) {
        window.open(whatsappUrl, "_blank");
      }
    }, 1000);
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
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b no-print">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">نظام عروض أسعار المركبات</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  الرئيسية
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  البحث
                </Button>
              </Link>
              <Link href="/data-management">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  إدارة البيانات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Company Selection Section */}
      <div className="no-print bg-gradient-to-r from-blue-50 to-indigo-50 border-b mb-6">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">اختر الشركة لتخصيص عرض السعر</h2>
              <p className="text-sm text-gray-600">بيانات الشركة المختارة ستظهر في ترويسة عرض السعر وملف PDF</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Select value={formData.selectedCompanyId} onValueChange={handleCompanyChange}>
                  <SelectTrigger className="w-full h-12 text-lg">
                    <SelectValue placeholder="اختر الشركة لتخصيص التصميم" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        <div className="flex items-center gap-3 py-2">
                          {company.logo && (
                            <img 
                              src={company.logo} 
                              alt={company.name}
                              className="w-8 h-8 object-contain rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium">{company.name}</div>
                            <div className="text-xs text-gray-500">{company.phone || 'لا يوجد هاتف'}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.selectedCompanyId && (
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                  {formData.companyLogo && (
                    <img 
                      src={formData.companyLogo} 
                      alt={formData.companyName}
                      className="w-10 h-10 object-contain rounded"
                    />
                  )}
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{formData.companyName}</div>
                    <div className="text-gray-600">{formData.companyPhone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
                      {getAvailableMakesFromDB().map(maker => (
                        <SelectItem key={maker} value={maker}>{maker}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="carModel">موديل السيارة *</Label>
                  <Select value={formData.carModel} onValueChange={handleModelChange}>
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
                  <Label htmlFor="carYear">سنة الصنع *</Label>
                  <Select value={formData.carYear} onValueChange={handleYearChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
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
                <div className="md:col-span-2">
                  <Label htmlFor="detailedSpecs">المواصفات التفصيلية</Label>
                  <Textarea
                    id="detailedSpecs"
                    value={formData.detailedSpecs}
                    placeholder="ستظهر المواصفات التفصيلية تلقائياً عند اختيار الماركة والموديل وسنة الصنع"
                    rows={15}
                    readOnly
                    className="text-sm leading-relaxed bg-gray-50 border-gray-200"
                  />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>

              </CardContent>
            </Card>

            {/* Price Options */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="includesTax"
                    checked={formData.includesPlatesAndTax}
                    onCheckedChange={(checked) => handleInputChange('includesPlatesAndTax', checked)}
                  />
                  <Label htmlFor="includesTax">السعر شامل الضريبة</Label>
                </div>
              </CardContent>
            </Card>







            {/* WhatsApp Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaWhatsapp className="mr-3 h-5 w-5 text-green-500" />
                  إعدادات الواتساب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="whatsappNumber">رقم الواتساب للإرسال</Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    placeholder="966xxxxxxxxx (بدون +)"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    أدخل رقم الواتساب الذي تريد إرسال عرض السعر إليه (مع رمز الدولة)
                  </p>
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
                    <h3 className="font-semibold text-foreground mb-2">المبلغ كتاباً</h3>
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
            {/* Header with Company Info, Logo and QR Code */}
            <div 
              className="flex justify-between items-start mb-8 pb-6 border-b-2" 
              style={{ 
                backgroundColor: formData.companyBackgroundColor,
                color: formData.companyTextColor,
                borderColor: formData.companyPrimaryColor
              }}
            >
              {/* Company Logo */}
              <div className="flex-shrink-0">
                {formData.companyLogo ? (
                  <img src={formData.companyLogo} alt="لوجو الشركة" className="h-20 w-auto" />
                ) : (
                  <div 
                    className="h-20 w-20 border-2 border-dashed rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: formData.companyBackgroundColor,
                      borderColor: formData.companyPrimaryColor
                    }}
                  >
                    <span 
                      className="text-xs"
                      style={{ color: formData.companyPrimaryColor }}
                    >
                      لوجو الشركة
                    </span>
                  </div>
                )}
              </div>

              {/* Company Information */}
              <div className="text-center flex-grow mx-8 relative">
                <h1 
                  className="text-3xl font-bold mb-2"
                  style={{ color: formData.companyPrimaryColor }}
                >
                  {formData.companyName}
                </h1>
                <div className="space-y-1" style={{ color: formData.companyTextColor }}>
                  <p>{formData.companyAddress}</p>
                  <p>هاتف: {formData.companyPhone} | بريد: {formData.companyEmail}</p>
                </div>
                <div className="mt-4">
                  <h2 
                    className="text-2xl font-bold"
                    style={{ color: formData.companySecondaryColor }}
                  >
                    عرض سعر مركبة
                  </h2>
                  <p style={{ color: formData.companyTextColor }}>Vehicle Quotation</p>
                </div>
                
                {/* Company Stamp in Header (watermark style) */}
                {formData.companyStamp && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <img 
                      src={formData.companyStamp} 
                      alt="ختم الشركة" 
                      className="max-w-32 max-h-32"
                    />
                  </div>
                )}
              </div>

              {/* QR Code */}
              <div className="flex-shrink-0 text-center">
                <div 
                  className="border-2 p-2 rounded-lg"
                  style={{ borderColor: formData.companySecondaryColor }}
                >
                  <img 
                    src={generateQRCode(`عرض سعر مركبة - العميل: ${formData.customerName} - السيارة: ${formData.carMaker} ${formData.carModel} - السعر: ${formData.totalPrice.toFixed(2)} ريال`)}
                    alt="QR Code"
                    className="w-20 h-20"
                  />
                </div>
                <p 
                  className="text-xs mt-1"
                  style={{ color: formData.companyTextColor }}
                >
                  رمز QR
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 
                  className="text-lg font-semibold mb-4 border-b pb-2"
                  style={{ 
                    color: formData.companyPrimaryColor,
                    borderColor: formData.companySecondaryColor
                  }}
                >
                  بيانات العميل
                </h3>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-24" style={{ color: formData.companyTextColor }}>الاسم:</span>
                    <span className="font-medium" style={{ color: formData.companyTextColor }}>{formData.customerTitle}{formData.customerName || "غير محدد"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24" style={{ color: formData.companyTextColor }}>الهاتف:</span>
                    <span className="font-medium" style={{ color: formData.companyTextColor }}>{formData.customerPhone || "غير محدد"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24" style={{ color: formData.companyTextColor }}>البريد:</span>
                    <span className="font-medium" style={{ color: formData.companyTextColor }}>{formData.customerEmail || "غير محدد"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 
                  className="text-lg font-semibold mb-4 border-b pb-2"
                  style={{ 
                    color: formData.companyPrimaryColor,
                    borderColor: formData.companySecondaryColor
                  }}
                >
                  بيانات المركبة
                </h3>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-24" style={{ color: formData.companyTextColor }}>الماركة:</span>
                    <span className="font-medium" style={{ color: formData.companyTextColor }}>{formData.carMaker || "غير محدد"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24" style={{ color: formData.companyTextColor }}>الموديل:</span>
                    <span className="font-medium" style={{ color: formData.companyTextColor }}>{formData.carModel || "غير محدد"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24" style={{ color: formData.companyTextColor }}>اللون:</span>
                    <span className="font-medium" style={{ color: formData.companyTextColor }}>{formData.exteriorColor || "غير محدد"} / {formData.interiorColor || "غير محدد"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: formData.companyPrimaryColor }}
              >
                تفاصيل الأسعار
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border" style={{ borderColor: formData.companySecondaryColor }}>
                  <thead>
                    <tr style={{ backgroundColor: formData.companySecondaryColor }}>
                      <th 
                        className="border px-4 py-2 text-right text-white"
                        style={{ borderColor: formData.companySecondaryColor }}
                      >
                        البيان
                      </th>
                      <th 
                        className="border px-4 py-2 text-right text-white"
                        style={{ borderColor: formData.companySecondaryColor }}
                      >
                        المبلغ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td 
                        className="border px-4 py-2"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        سعر السيارة
                      </td>
                      <td 
                        className="border px-4 py-2 font-medium"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        {formData.basePrice.toFixed(2)} ريال
                      </td>
                    </tr>
                    <tr>
                      <td 
                        className="border px-4 py-2"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        الكمية
                      </td>
                      <td 
                        className="border px-4 py-2 font-medium"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        {formData.quantity}
                      </td>
                    </tr>
                    <tr>
                      <td 
                        className="border px-4 py-2"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        الإجمالي قبل الضريبة
                      </td>
                      <td 
                        className="border px-4 py-2 font-medium"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        {formData._display.subTotal.toFixed(2)} ريال
                      </td>
                    </tr>
                    <tr>
                      <td 
                        className="border px-4 py-2"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        الضريبة المضافة ({formData.vatRate}%)
                      </td>
                      <td 
                        className="border px-4 py-2 font-medium"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        {formData._display.vat.toFixed(2)} ريال
                      </td>
                    </tr>
                    <tr>
                      <td 
                        className="border px-4 py-2"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        سعر اللوحة
                      </td>
                      <td 
                        className="border px-4 py-2 font-medium"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        {formData.platePrice.toFixed(2)} ريال
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: formData.companyPrimaryColor + '20' }}>
                      <td 
                        className="border px-4 py-2 font-semibold"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyTextColor
                        }}
                      >
                        الإجمالي النهائي
                      </td>
                      <td 
                        className="border px-4 py-2 font-bold"
                        style={{ 
                          borderColor: formData.companySecondaryColor,
                          color: formData.companyPrimaryColor
                        }}
                      >
                        {formData.totalPrice.toFixed(2)} ريال
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-8">
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: formData.companyPrimaryColor }}
              >
                الشروط والأحكام
              </h3>
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: formData.companyBackgroundColor,
                  borderColor: formData.companySecondaryColor
                }}
              >
                <ul className="space-y-2 text-sm" style={{ color: formData.companyTextColor }}>
                  <li>• هذا العرض ساري لمدة 15 يوماً من تاريخ الإصدار</li>
                  <li>• الأسعار شاملة الضريبة المضافة</li>
                  <li>• سعر اللوحات خاضع للكمة وغير خاضع للضريبة</li>
                  <li>• يتم التسليم خلال 30 يوماً من تاريخ تأكيد الطلب</li>
                  <li>• الضمان وفقاً لشروط الوكيل المعتمد</li>
                  <li>• الدفع نقداً أو بالتقسيط حسب الاتفاق</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <div 
                  className="border-b-2 pb-2 mb-2 h-20 flex items-center justify-center"
                  style={{ borderColor: formData.companySecondaryColor }}
                >

                </div>
                <p className="text-sm" style={{ color: formData.companyTextColor }}>توقيع العميل</p>
              </div>
              <div className="text-center">
                <div 
                  className="border-b-2 pb-2 mb-2 h-20 flex items-center justify-center"
                  style={{ borderColor: formData.companySecondaryColor }}
                >
                  {formData.companyStamp && (
                    <img src={formData.companyStamp} alt="ختم الشركة" className="max-h-16" />
                  )}
                </div>
                <p className="text-sm" style={{ color: formData.companyTextColor }}>ختم الشركة</p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm" style={{ color: formData.companyTextColor }}>
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
