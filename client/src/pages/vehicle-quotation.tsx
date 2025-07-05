import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getVehicleSpecifications, getAvailableMakes, getModelsForMake, getYearsForMakeAndModel } from "@/data/vehicle-specifications";
import { generateQuotationPDF, generateQuotationPDFFromHTML } from "@/lib/pdf-generator";
import { formatPriceWithWords } from "@/lib/number-to-words";
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
  Database,

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

  // Fetch sales representatives from database
  const { data: salesRepresentatives = [] } = useQuery<any[]>({
    queryKey: ['/api/sales-representatives'],
    queryFn: async () => {
      const response = await fetch('/api/sales-representatives');
      if (!response.ok) throw new Error('Failed to fetch sales representatives');
      return response.json();
    }
  });

  // Fetch terms and conditions from database
  const { data: termsAndConditions = [] } = useQuery<any[]>({
    queryKey: ['/api/terms-and-conditions'],
    queryFn: async () => {
      const response = await fetch('/api/terms-and-conditions');
      if (!response.ok) throw new Error('Failed to fetch terms and conditions');
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
    vinNumber: "",
    quantity: 1,
    basePrice: 0,
    vatRate: 15,
    issueDate: format(new Date(), "yyyy-MM-dd"),
    deadlineDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    validityPeriod: 15, // مدة صلاحية العرض بالأيام
    platePrice: 0,
    specifications: "",
    includeTax: false,
    salesRepName: "",
    salesRepPhone: "",
    salesRepEmail: "",
    salesRepresentativeId: null as number | null,

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
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);


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

  // Save vehicle specifications mutation
  const saveVehicleSpecMutation = useMutation({
    mutationFn: async (specData: any) => {
      const response = await fetch("/api/vehicle-specs", {
        method: "POST",
        body: JSON.stringify(specData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to save vehicle specification");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicle-specs'] });
      toast({
        title: "تم الحفظ",
        description: "تم حفظ المواصفات التفصيلية تلقائياً",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ المواصفات التفصيلية",
        variant: "destructive",
      });
    },
  });



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

  // Calculate deadline date when issue date or validity period changes
  useEffect(() => {
    if (formData.issueDate && formData.validityPeriod) {
      const issueDate = new Date(formData.issueDate);
      const deadlineDate = new Date(issueDate.getTime() + formData.validityPeriod * 24 * 60 * 60 * 1000);
      const formattedDeadlineDate = format(deadlineDate, "yyyy-MM-dd");
      
      setFormData(prev => ({
        ...prev,
        deadlineDate: formattedDeadlineDate
      }));
    }
  }, [formData.issueDate, formData.validityPeriod]);

  // Load quotation data for editing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
      const savedQuotation = localStorage.getItem('editingQuotation');
      if (savedQuotation) {
        try {
          const quotationData = JSON.parse(savedQuotation);
          
          // Load customer data
          setFormData(prev => ({
            ...prev,
            customerTitle: quotationData.customer?.title || prev.customerTitle,
            customerName: quotationData.customer?.name || '',
            customerPhone: quotationData.customer?.phone || '',
            customerEmail: quotationData.customer?.email || '',
            
            // Load vehicle data
            carMaker: quotationData.vehicle?.maker || '',
            carModel: quotationData.vehicle?.model || '',
            carYear: quotationData.carYear || '',
            exteriorColor: quotationData.vehicle?.exteriorColor || '',
            interiorColor: quotationData.vehicle?.interiorColor || '',
            vinNumber: quotationData.vehicle?.vinNumber || '',
            detailedSpecs: quotationData.vehicleSpecifications || '',
            
            // Load pricing data
            basePrice: parseFloat(quotationData.basePrice) || 0,
            vatRate: parseFloat(quotationData.vatRate) || 15,
            platePrice: parseFloat(quotationData.platePrice) || 0,
            quantity: quotationData.quantity || 1,
            
            // Load dates and other data
            issueDate: quotationData.issueDate ? format(new Date(quotationData.issueDate), "yyyy-MM-dd") : '',
            deadlineDate: quotationData.deadlineDate ? format(new Date(quotationData.deadlineDate), "yyyy-MM-dd") : '',
            validityPeriod: quotationData.validityPeriod || 30,
            
            // Load boolean flags
            includesPlatesAndTax: quotationData.includesPlatesAndTax || false,
            isWarrantied: quotationData.isWarrantied || false,
            isRiyadhDelivery: quotationData.isRiyadhDelivery || false,
            
            // Load company and sales rep data
            selectedCompanyId: quotationData.companyId?.toString() || '',
            salesRepresentativeId: quotationData.salesRepresentativeId || null,
          }));
          
          // Clear the localStorage after loading
          localStorage.removeItem('editingQuotation');
          
          toast({
            title: "تم تحميل البيانات",
            description: `تم تحميل بيانات عرض السعر ${quotationData.quotationNumber} للتحرير`,
          });
          
          // Remove edit parameter from URL
          window.history.replaceState({}, '', window.location.pathname);
          
        } catch (error) {
          console.error('Error loading quotation data:', error);
          toast({
            title: "خطأ في التحميل",
            description: "فشل في تحميل بيانات عرض السعر",
            variant: "destructive",
          });
        }
      }
    }
  }, []);  // Run only once on component mount

  // Handlers
  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name !== 'carMaker') {
      validateField(name, value);
    }
    
    // Auto-save detailed specs when updated with debounce
    if (name === 'detailedSpecs' && value && formData.carMaker && formData.carModel && formData.carYear) {
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      // Set new timeout for debounced saving
      const newTimeout = setTimeout(() => {
        // Double-check that we still have the required data
        const currentFormData = formData;
        if (!currentFormData.carMaker || !currentFormData.carModel || !currentFormData.carYear) {
          return;
        }
        
        const existingSpec = databaseSpecs.find(spec => 
          spec.make === currentFormData.carMaker && 
          spec.model === currentFormData.carModel && 
          spec.year === parseInt(currentFormData.carYear)
        );
        
        // Only save if it doesn't exist or the specs have changed and value is not empty
        if (value.trim() && (!existingSpec || existingSpec.specifications !== value)) {
          const specData = {
            make: currentFormData.carMaker,
            model: currentFormData.carModel,
            year: parseInt(currentFormData.carYear),
            engine: existingSpec?.engine || "غير محدد",
            specifications: value
          };
          
          saveVehicleSpecMutation.mutate(specData);
        }
      }, 2000); // Wait 2 seconds after user stops typing
      
      setSaveTimeout(newTimeout);
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

  // Handle sales representative selection
  const handleSalesRepresentativeChange = (representativeId: string) => {
    const selectedRep = salesRepresentatives.find(rep => rep.id === parseInt(representativeId));
    if (selectedRep) {
      setFormData(prev => ({
        ...prev,
        salesRepresentativeId: selectedRep.id,
        salesRepName: selectedRep.name,
        salesRepPhone: selectedRep.phone || "",
        salesRepEmail: selectedRep.email || ""
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
    const dbModels = Array.from(new Set(
      databaseSpecs
        .filter(spec => spec.make === maker)
        .map(spec => spec.model)
    ));
    if (dbModels.length > 0) {
      setAvailableModels(dbModels);
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
    const dbYears = Array.from(new Set(
      databaseSpecs
        .filter(spec => spec.make === formData.carMaker && spec.model === model)
        .map(spec => spec.year)
    )).sort((a, b) => b - a);
    if (dbYears.length > 0) {
      setAvailableYears(dbYears);
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
    const dbSpec = databaseSpecs.find(spec => 
      spec.make === formData.carMaker && 
      spec.model === formData.carModel && 
      spec.year === parseInt(year)
    );
    
    if (dbSpec) {
      // Use database specifications
      setVehicleSpecs(dbSpec);
      setFormData(prev => ({
        ...prev,
        specifications: dbSpec.specifications || "",
        detailedSpecs: dbSpec.specifications || ""
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
    if (name === 'salesRepresentativeId') {
      if (!value) {
        newErrors[name] = "هذا الحقل مطلوب";
      } else {
        delete newErrors[name];
      }
    } else if (String(value).trim() === "") {
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
        vinNumber: formData.vinNumber || null,
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
        issueDate: formData.issueDate,
        deadlineDate: formData.deadlineDate,
        includesPlatesAndTax: formData.includesPlatesAndTax,
        isWarrantied: formData.isWarrantied,
        isRiyadhDelivery: formData.isRiyadhDelivery,
        salesRepName: formData.salesRepName || null,
        salesRepPhone: formData.salesRepPhone || null,
        salesRepEmail: formData.salesRepEmail || null,
        salesRepresentativeId: formData.salesRepresentativeId,
        vehicleSpecifications: vehicleSpecs?.specifications || formData.detailedSpecs || null,

        status: "draft",
      },
    };

    saveQuotationMutation.mutate(quotationData);
  };

  const handleExportPDF = async () => {

    try {
      // Prepare data for PDF generation
      const selectedComp = companies?.find(c => c.id === parseInt(String(formData.selectedCompanyId || '0')));
      const selectedSalesRep = salesRepresentatives?.find(r => r.id === parseInt(String(formData.salesRepresentativeId || '0')));
      
      const pdfData = {
        ...formData,
        customerName: formData.customerName || 'عميل غير محدد',
        customerPhone: formData.customerPhone || 'غير محدد',
        customerIdNumber: formData.customerPhone || 'غير محدد',
        carMaker: formData.carMaker || 'غير محدد',
        carModel: formData.carModel || 'غير محدد',
        carYear: formData.carYear || new Date().getFullYear().toString(),
        basePrice: formData.basePrice || '0',
        quantity: formData.quantity || '1',
        platePrice: formData.platePrice || '0',
        companyLogo: selectedComp?.logo || null,
        vehicleSpecifications: vehicleSpecs?.specifications || formData.detailedSpecs || 'مواصفات غير محددة',
        quotationNumber: `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,

        companyName: selectedComp?.name || 'شركة البريمي',
        companyPhone: selectedComp?.phone || 'غير محدد',
        companyEmail: selectedComp?.email || 'غير محدد',
        companyStamp: selectedComp?.stamp || null,
        
        // Include terms and conditions from database
        termsAndConditions: termsAndConditions.filter(term => term.isActive).sort((a, b) => a.displayOrder - b.displayOrder),
        validityPeriod: formData.validityPeriod,
        deadlineDate: formData.deadlineDate,
      };

      // Try HTML to PDF approach for better Arabic support
      const quotationElement = document.getElementById('quotation-preview');
      let pdf;
      
      if (quotationElement) {
        // Generate PDF from HTML element (better Arabic support)
        pdf = await generateQuotationPDFFromHTML(quotationElement);
      } else {
        // Fallback to improved text-based PDF with Arabic support
        pdf = generateQuotationPDF(pdfData);
      }
      
      // Save the PDF with A4 format
      pdf.save(`عرض-سعر-${formData.customerName || 'عميل'}.pdf`);
      
      toast({
        title: "تم تصدير PDF بنجاح",
        description: "تم إنشاء عرض السعر بدعم كامل للغة العربية ومقاس A4",
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({
        title: "فشل في تصدير PDF",
        description: "حدث خطأ أثناء إنشاء ملف PDF",
        variant: "destructive",
      });
    }
  };

  const handlePreviewPDF = () => {
    try {
      // Use export PDF function for preview
      handleExportPDF();
      
      toast({
        title: "معاينة PDF",
        description: "تم إنشاء معاينة PDF",
      });
    } catch (error) {
      console.error("PDF preview failed:", error);
      toast({
        title: "فشل في معاينة PDF",
        description: "حدث خطأ أثناء إنشاء معاينة PDF",
        variant: "destructive",
      });
    }
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

  // Get selected company for dynamic display
  const selectedCompany = companies?.find(c => c.id === parseInt(formData.selectedCompanyId || '0'));

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
              <Link href="/saved-quotations">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <FaSave className="h-4 w-4" />
                  عروض السعر المحفوظة
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
                  <Label htmlFor="customerName">اسم العميل</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="أدخل اسم العميل"
                  />
                  {errors.customerName && <span className="text-destructive text-sm">{errors.customerName}</span>}
                </div>
                <div>
                  <Label htmlFor="customerPhone">رقم الهاتف</Label>
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
                <div>
                  <Label htmlFor="salesRepresentative">المندوب</Label>
                  <Select value={formData.salesRepresentativeId?.toString() || ""} onValueChange={handleSalesRepresentativeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المندوب" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesRepresentatives.map(rep => (
                        <SelectItem key={rep.id} value={rep.id.toString()}>
                          {rep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.salesRepresentativeId && <span className="text-destructive text-sm">{errors.salesRepresentativeId}</span>}
                </div>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle className="text-lg">بيانات المركبة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="carMaker">ماركة السيارة</Label>
                  <Select value={formData.carMaker} onValueChange={handleMakerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الماركة" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const dbMakes = Array.from(new Set(databaseSpecs.map(spec => spec.make)));
                        const makes = dbMakes.length > 0 ? dbMakes : carMakers;
                        return makes.map((maker: string) => (
                          <SelectItem key={maker} value={maker}>{maker}</SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="carModel">موديل السيارة</Label>
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
                  <Label htmlFor="carYear">سنة الصنع</Label>
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
                <div>
                  <Label htmlFor="vinNumber">رقم الهيكل (VIN)</Label>
                  <Input
                    id="vinNumber"
                    type="text"
                    value={formData.vinNumber}
                    onChange={(e) => handleInputChange('vinNumber', e.target.value)}
                    placeholder="أدخل رقم الهيكل"
                    className="text-center"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="detailedSpecs">المواصفات التفصيلية</Label>
                  <Textarea
                    id="detailedSpecs"
                    value={formData.detailedSpecs}
                    onChange={(e) => handleInputChange('detailedSpecs', e.target.value)}
                    placeholder="ستظهر المواصفات التفصيلية تلقائياً عند اختيار الماركة والموديل وسنة الصنع، أو يمكنك تحريرها يدوياً"
                    rows={15}
                    className="text-sm leading-relaxed"
                    style={{ direction: 'rtl' }}
                  />
                  {saveVehicleSpecMutation.isPending && (
                    <p className="text-xs text-blue-600 mt-1 text-right">جاري حفظ المواصفات في قاعدة البيانات...</p>
                  )}
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
                  <div>
                    <Label htmlFor="validityPeriod">مدة صلاحية العرض (بالأيام)</Label>
                    <Input
                      id="validityPeriod"
                      type="number"
                      min="1"
                      max="365"
                      value={formData.validityPeriod}
                      onChange={(e) => {
                        const days = parseInt(e.target.value) || 15;
                        handleInputChange('validityPeriod', days);
                        // تحديث تاريخ انتهاء العرض تلقائياً
                        const newDeadline = format(new Date(Date.now() + days * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
                        handleInputChange('deadlineDate', newDeadline);
                      }}
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
                  <Label htmlFor="deadlineDate">تاريخ انتهاء العرض (محسوب تلقائياً)</Label>
                  <Input
                    id="deadlineDate"
                    type="date"
                    value={formData.deadlineDate}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    يتم حساب تاريخ الانتهاء تلقائياً بناءً على تاريخ الإصدار ومدة الصلاحية
                  </p>
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

        {/* Quotation Sheet - ALBARIMI Style */}
        <Card id="quotation-preview" className="mt-8 print:shadow-none print:bg-white">
          <CardContent className="p-0">
            {/* Header Section with Dynamic Company Colors */}
            <div 
              className="bg-slate-800 text-white p-6 relative" 
              style={{ 
                backgroundColor: (selectedCompany as any)?.primaryColor || '#00627F',
                color: (selectedCompany as any)?.textColor || '#FFFFFF'
              }}
            >
              <div className="flex justify-between items-start">
                {/* Company Logo on Left */}
                <div className="flex-shrink-0">
                  {selectedCompany?.logo ? (
                    <img src={selectedCompany.logo} alt="لوجو الشركة" className="h-16 w-auto" />
                  ) : (
                    <div 
                      className="text-yellow-400 font-bold text-lg" 
                      style={{ color: (selectedCompany as any)?.secondaryColor || '#C79C45' }}
                    >
                      {selectedCompany?.name || 'ALBARIMI'}
                    </div>
                  )}
                </div>
                
                {/* Header Metadata on Right */}
                <div className="text-right">
                  <h1 className="text-xl font-bold mb-2">عرض سعر</h1>
                  <div className="text-sm space-y-1">
                    <p>تاريخ الإصدار: {format(new Date(formData.issueDate), "dd/MM/yyyy")}</p>
                    <p>تاريخ الانتهاء: {format(new Date(formData.deadlineDate), "dd/MM/yyyy")}</p>
                    <p>رقم العرض: {Date.now().toString().slice(-4)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Bar with Company Details */}
            <div className="bg-gray-100 px-6 py-3 border-b">
              <div className="flex justify-around text-sm text-gray-700">
                <div className="text-center">
                  <div className="font-medium">السجل التجاري</div>
                  <div className="text-xs">{selectedCompany?.registrationNumber || 'غير محدد'}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">رقم الرخصة</div>
                  <div className="text-xs">{(selectedCompany as any)?.licenseNumber || 'غير محدد'}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">الرقم الضريبي</div>
                  <div className="text-xs">{selectedCompany?.taxNumber || 'غير محدد'}</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Customer and Vehicle Data (Two Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Customer Info (Right Column) */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3 text-right">بيانات العميل</h3>
                  <div className="space-y-2 text-right text-sm">
                    <p><span className="font-medium">الاسم:</span> {formData.customerName || 'غير محدد'}</p>
                    <p><span className="font-medium">رقم الهوية:</span> غير محدد</p>
                    <p><span className="font-medium">رقم الهاتف:</span> {formData.customerPhone || 'غير محدد'}</p>
                  </div>
                </div>

                {/* Vehicle Info (Left Column) */}
                <div className="bg-gray-50 p-4 rounded-lg border relative">
                  <h3 className="font-semibold text-lg mb-3 text-right">بيانات المركبة</h3>
                  <div className="space-y-2 text-right text-sm">
                    <p><span className="font-medium">الماركة:</span> {formData.carMaker || 'غير محدد'}</p>
                    <p><span className="font-medium">الموديل:</span> {formData.carModel || 'غير محدد'}</p>
                    <p><span className="font-medium">السنة:</span> {formData.carYear || 'غير محدد'}</p>
                    {formData.vinNumber && <p><span className="font-medium">رقم الهيكل:</span> {formData.vinNumber}</p>}
                    {formData.exteriorColor && <p><span className="font-medium">اللون الخارجي:</span> {formData.exteriorColor}</p>}
                    {formData.interiorColor && <p><span className="font-medium">اللون الداخلي:</span> {formData.interiorColor}</p>}
                  </div>
                  
                  {/* Brand Logo if available */}
                  {(vehicleSpecs?.brandLogo || (vehicleSpecs as any)?.brandLogo) && (
                    <div className="absolute top-4 left-4">
                      <img 
                        src={(vehicleSpecs?.brandLogo || (vehicleSpecs as any)?.brandLogo)} 
                        alt={`شعار ${formData.carMaker}`} 
                        className="h-12 w-auto opacity-80"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Specifications Section */}
              <div className="bg-gray-50 border border-slate-600 rounded-lg p-6 mb-8 relative">
                <h3 className="font-semibold text-lg mb-4 text-right" style={{ color: '#00627F' }}>
                  المواصفات التفصيلية
                </h3>
                
                {/* Mercedes logo placeholder if Mercedes */}
                {(formData.carMaker?.toLowerCase().includes('مرسيدس') || formData.carMaker?.toLowerCase().includes('mercedes')) && (
                  <div className="absolute top-4 left-4 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs">★</span>
                  </div>
                )}
                
                {/* Large watermark logo in background */}
                {formData.companyLogo && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <img 
                      src={formData.companyLogo} 
                      alt="ختم الشركة" 
                      className="max-w-40 max-h-40"
                    />
                  </div>
                )}
                
                <div className="text-right text-sm leading-relaxed">
                  {vehicleSpecs?.specifications || formData.detailedSpecs || 'مواصفات السيارة التفصيلية'}
                </div>
              </div>

              {/* Offer Summary Section */}
              <div className="bg-gray-50 border border-slate-600 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-lg mb-4 text-right" style={{ color: '#00627F' }}>
                  ملخص العرض
                </h3>
                
                <div className="text-right space-y-2 text-sm">
                  <p><span className="font-medium">تفاصيل السعر:</span></p>
                  <p><span className="font-medium">السعر الإفرادي:</span> {parseFloat(formData.basePrice || '0').toLocaleString()} ريال</p>
                  <p><span className="font-medium">الكمية:</span> {formData.quantity || '1'}</p>
                  <p><span className="font-medium">الإجمالي قبل الضريبة:</span> {(parseFloat(formData.basePrice || '0') * parseInt(formData.quantity || '1')).toLocaleString()} ريال</p>
                  <p><span className="font-medium">الضريبة (%15):</span> {(parseFloat(formData.basePrice || '0') * 0.15).toLocaleString()} ريال</p>
                  {parseFloat(formData.platePrice || '0') > 0 && (
                    <p><span className="font-medium">اللوحات والرسوم:</span> {parseFloat(formData.platePrice || '0').toLocaleString()} ريال</p>
                  )}
                  <p><span className="font-medium">سعر النهائي:</span> {(parseFloat(formData.basePrice || '0') * parseInt(formData.quantity || '1') * 1.15 + parseFloat(formData.platePrice || '0')).toLocaleString()} ريال</p>
                  
                  <div className="mt-4 text-lg font-bold" style={{ color: '#C79C45' }}>
                    المبلغ كتابة: {formatPriceWithWords(parseFloat(formData.basePrice || '0') * parseInt(formData.quantity || '1') * 1.15 + parseFloat(formData.platePrice || '0'), 'ريال سعودي')} فقط لا غير
                  </div>
                </div>
              </div>

              {/* Bottom Section with Representative Info, QR Code and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Representative Info */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2 text-right">بيانات مندوب</h4>
                  <div className="text-right text-sm space-y-1">
                    <p>{formData.salesRepName || 'غير محدد'}</p>
                    <p>{formData.salesRepPhone || 'غير محدد'}</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-gray-200 p-2 rounded">
                    <img 
                      src={generateQRCode(`عرض سعر مركبة - العميل: ${formData.customerName} - السيارة: ${formData.carMaker} ${formData.carModel} - السعر: ${(parseFloat(formData.basePrice || '0') * parseInt(formData.quantity || '1') * 1.15 + parseFloat(formData.platePrice || '0')).toLocaleString()} ريال`)}
                      alt="QR Code"
                      className="w-16 h-16"
                    />
                  </div>
                  <p className="text-xs mt-1">QR Code</p>
                </div>

                {/* Notes from Database Terms */}
                <div className="text-right text-xs text-gray-600 space-y-1">
                  {termsAndConditions && termsAndConditions.filter(term => term.isActive).length > 0 ? (
                    termsAndConditions
                      .filter(term => term.isActive)
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((term, index) => {
                        // Special formatting for validity period
                        if (term.title === 'مدة صلاحية العرض') {
                          return (
                            <p key={term.id}>• مدة صلاحية العرض: {formData.validityPeriod} يوم (ينتهي في: {format(new Date(formData.deadlineDate), "dd/MM/yyyy")})</p>
                          );
                        }
                        return (
                          <p key={term.id}>• {term.content}</p>
                        );
                      })
                  ) : (
                    // Fallback to default terms if none in database
                    <>
                      <p>• مدة صلاحية العرض: {formData.validityPeriod} يوم (ينتهي في: {format(new Date(formData.deadlineDate), "dd/MM/yyyy")})</p>
                      <p>• السعر لا يشمل رسوم التسجيل والتأمين</p>
                      <p>• يجب التأكد من التحويل البنكي</p>
                      <p>• جميع البيانات خاضعة للمراجعة والتأكيد</p>
                    </>
                  )}
                </div>
              </div>





              {/* Signature Area with Company Stamp */}
              <div className="mt-8 flex justify-between items-end">
                <div className="text-right">
                  <p className="font-medium text-sm">ختم وتوقيع الشركة</p>
                  <div className="mt-2">
                    {(selectedCompany as any)?.stamp ? (
                      <img 
                        src={(selectedCompany as any).stamp} 
                        alt="ختم الشركة" 
                        className="h-20 w-auto"
                      />
                    ) : (
                      <div className="bg-gray-100 p-4 rounded border text-center w-32">
                        <p className="text-xs text-gray-500">ختم الشركة</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-left">
                  <p className="font-medium text-sm">{selectedCompany?.name || 'اسم الشركة'}</p>
                  <p className="text-xs text-gray-600 mt-1">المدير العام</p>
                </div>
              </div>
            </div>

            {/* Footer with Dynamic Company Information */}
            <div 
              className="text-white text-center py-3 text-sm" 
              style={{ 
                backgroundColor: (selectedCompany as any)?.secondaryColor || '#C79C45',
                color: (selectedCompany as any)?.textColor || '#FFFFFF'
              }}
            >
              <div className="flex justify-center space-x-8 space-x-reverse">
                <span>العنوان: {selectedCompany?.address || 'عنوان الشركة'}</span>
                <span>الإيميل: {selectedCompany?.email || 'البريد الإلكتروني'}</span>
                <span>الهاتف: {selectedCompany?.phone || 'رقم الهاتف'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleQuotation;
