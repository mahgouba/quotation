import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Car, Users, Building, UserCheck, Filter, ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

// Interfaces
interface VehicleSpec {
  id: number;
  make: string;
  model: string;
  year: number;
  engine: string;
  specifications: string;
}

interface SalesRepresentative {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  companyId: number | null;
}

interface Company {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
  registrationNumber: string | null;
  taxNumber: string | null;
}

export default function DataManagement() {
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [activeTab, setActiveTab] = useState("vehicles");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const queryClient = useQueryClient();

  // Vehicle Specifications
  const { data: vehicleSpecs = [] as VehicleSpec[], isLoading: isLoadingSpecs } = useQuery<VehicleSpec[]>({
    queryKey: ['/api/vehicle-specs'],
  });

  // Sales Representatives
  const { data: salesReps = [] as SalesRepresentative[], isLoading: isLoadingSalesReps } = useQuery<SalesRepresentative[]>({
    queryKey: ['/api/sales-representatives'],
  });

  // Companies
  const { data: companies = [] as Company[], isLoading: isLoadingCompanies } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  // Vehicle Spec Form
  const [specForm, setSpecForm] = useState({
    make: "",
    model: "",
    year: "",
    engine: "",
    specifications: "",
    brandLogo: ""
  });
  const [editingSpec, setEditingSpec] = useState<VehicleSpec | null>(null);

  // Sales Rep Form
  const [salesRepForm, setSalesRepForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Company Form
  const [companyForm, setCompanyForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    registrationNumber: "",
    taxNumber: "",
    licenseNumber: "",
    logo: "",
    stamp: "",
    primaryColor: "#00627F",
    secondaryColor: "#C79C45",
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
    termsAndConditions: "• يجب على العميل دفع مقدم بنسبة 50% من إجمالي السعر\n• الباقي يُدفع عند استلام المركبة\n• مدة التسليم: 2-4 أسابيع من تاريخ تأكيد الطلب\n• ضمان الوكيل لمدة 3 سنوات أو 100,000 كم أيهما أقل\n• العرض لا يشمل التأمين ورسوم النقل\n• الشركة غير مسؤولة عن التأخير الناجم عن ظروف خارجة عن إرادتها"
  });
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Mutations
  const addSpecMutation = useMutation({
    mutationFn: async (specData: VehicleSpec) => {
      return await apiRequest('POST', '/api/vehicle-specs', specData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicle-specs'] });
      setSpecForm({ make: "", model: "", year: "", engine: "", specifications: "", brandLogo: "" });
      toast({ title: "تم إضافة المواصفات بنجاح" });
    },
  });

  const addSalesRepMutation = useMutation({
    mutationFn: async (salesRepData: any) => {
      return await apiRequest('POST', '/api/sales-representatives', salesRepData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sales-representatives'] });
      setSalesRepForm({ name: "", email: "", phone: "" });
      toast({ title: "تم إضافة المندوب بنجاح" });
    },
  });

  const addCompanyMutation = useMutation({
    mutationFn: async (companyData: any) => {
      return await apiRequest('POST', '/api/companies', companyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      setCompanyForm({ 
        name: "", 
        address: "", 
        phone: "", 
        email: "", 
        registrationNumber: "", 
        taxNumber: "", 
        licenseNumber: "",
        logo: "",
        stamp: "",
        primaryColor: "#00627F",
        secondaryColor: "#C79C45", 
        textColor: "#000000",
        backgroundColor: "#FFFFFF",
        termsAndConditions: "• يجب على العميل دفع مقدم بنسبة 50% من إجمالي السعر\n• الباقي يُدفع عند استلام المركبة\n• مدة التسليم: 2-4 أسابيع من تاريخ تأكيد الطلب\n• ضمان الوكيل لمدة 3 سنوات أو 100,000 كم أيهما أقل\n• العرض لا يشمل التأمين ورسوم النقل\n• الشركة غير مسؤولة عن التأخير الناجم عن ظروف خارجة عن إرادتها"
      });
      toast({ title: "تم إضافة الشركة بنجاح" });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (companyData: any) => {
      const { id, ...data } = companyData;
      return await apiRequest('PATCH', `/api/companies/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      toast({ title: "تم تحديث الشركة بنجاح" });
    },
  });

  const deleteSalesRepMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/sales-representatives/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sales-representatives'] });
      toast({ title: "تم حذف المندوب بنجاح" });
    },
  });

  // Filter logic
  const filteredSpecs = vehicleSpecs.filter((spec: VehicleSpec) => {
    if (selectedMake && selectedMake !== "all" && spec.make !== selectedMake) return false;
    if (selectedModel && selectedModel !== "all" && spec.model !== selectedModel) return false;
    if (selectedYear && selectedYear !== "all" && spec.year.toString() !== selectedYear) return false;
    return true;
  });

  const availableYears = Array.from(new Set(vehicleSpecs.map((spec: VehicleSpec) => spec.year)))
    .sort((a: number, b: number) => b - a);

  const handleSpecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specForm.make || !specForm.model || !specForm.year || !specForm.engine) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    addSpecMutation.mutate({
      ...specForm,
      year: parseInt(specForm.year),
      id: 0
    });
  };

  const handleSalesRepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesRepForm.name) {
      toast({ title: "يرجى إدخال اسم المندوب", variant: "destructive" });
      return;
    }
    addSalesRepMutation.mutate({
      ...salesRepForm,
      companyId: null
    });
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name) {
      toast({ title: "يرجى إدخال اسم الشركة", variant: "destructive" });
      return;
    }
    addCompanyMutation.mutate(companyForm);
  };

  const handleDeleteSalesRep = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المندوب؟")) {
      deleteSalesRepMutation.mutate(id);
    }
  };

  const handleDeleteSpec = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المواصفات؟")) {
      fetch(`/api/vehicle-specs/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['/api/vehicle-specs'] });
          toast({ title: "تم حذف المواصفات بنجاح" });
        })
        .catch(() => {
          toast({ title: "خطأ في الحذف", variant: "destructive" });
        });
    }
  };

  const handleEditSpec = (spec: VehicleSpec) => {
    setEditingSpec(spec);
    setSpecForm({
      make: spec.make,
      model: spec.model,
      year: spec.year.toString(),
      engine: spec.engine,
      specifications: spec.specifications || "",
      brandLogo: (spec as any).brandLogo || ""
    });
  };

  const handleUpdateSpec = () => {
    if (!editingSpec) return;
    
    const updatedSpec = {
      make: specForm.make,
      model: specForm.model,
      year: parseInt(specForm.year),
      engine: specForm.engine,
      specifications: specForm.specifications,
      brandLogo: specForm.brandLogo
    };

    fetch(`/api/vehicle-specs/${editingSpec.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSpec)
    })
    .then(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicle-specs'] });
      toast({ title: "تم تحديث المواصفات بنجاح" });
      setEditingSpec(null);
      setSpecForm({ make: "", model: "", year: "", engine: "", specifications: "", brandLogo: "" });
    })
    .catch(() => {
      toast({ title: "خطأ في التحديث", variant: "destructive" });
    });
  };

  const handleCancelEdit = () => {
    setEditingSpec(null);
    setSpecForm({ make: "", model: "", year: "", engine: "", specifications: "", brandLogo: "" });
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setCompanyForm({
      name: company.name,
      address: company.address || "",
      phone: company.phone || "",
      email: company.email || "",
      registrationNumber: company.registrationNumber || "",
      taxNumber: company.taxNumber || "",
      licenseNumber: (company as any).licenseNumber || "",
      logo: company.logo || "",
      stamp: (company as any).stamp || "",
      primaryColor: (company as any).primaryColor || "#00627F",
      secondaryColor: (company as any).secondaryColor || "#C79C45",
      textColor: (company as any).textColor || "#000000",
      backgroundColor: (company as any).backgroundColor || "#FFFFFF",
      termsAndConditions: (company as any).termsAndConditions || ""
    });
  };

  const handleDeleteCompany = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الشركة؟")) {
      fetch(`/api/companies/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
          toast({ title: "تم حذف الشركة بنجاح" });
        })
        .catch(() => {
          toast({ title: "خطأ في الحذف", variant: "destructive" });
        });
    }
  };

  if (isLoadingSpecs || isLoadingSalesReps || isLoadingCompanies) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                العودة للقائمة الرئيسية
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة البيانات</h1>
          <p className="text-gray-600">إدارة شاملة لجميع بيانات النظام</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              مواصفات المركبات
            </TabsTrigger>
            <TabsTrigger value="sales-reps" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              المندوبين
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              الشركات
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              الشروط والأحكام
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Vehicle Spec Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {editingSpec ? (
                      <>
                        <Edit className="w-5 h-5" />
                        تعديل المواصفات
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        إضافة مواصفات جديدة
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingSpec ? (e) => e.preventDefault() : handleSpecSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="make">الماركة *</Label>
                        <Input
                          id="make"
                          value={specForm.make}
                          onChange={(e) => setSpecForm({...specForm, make: e.target.value})}
                          placeholder="تويوتا، نيسان، هيونداي..."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">الموديل *</Label>
                        <Input
                          id="model"
                          value={specForm.model}
                          onChange={(e) => setSpecForm({...specForm, model: e.target.value})}
                          placeholder="كامري، سنترا، النترا..."
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="year">السنة *</Label>
                        <Input
                          id="year"
                          type="number"
                          value={specForm.year}
                          onChange={(e) => setSpecForm({...specForm, year: e.target.value})}
                          placeholder="2024"
                          min="1980"
                          max="2030"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="engine">المحرك *</Label>
                        <Input
                          id="engine"
                          value={specForm.engine}
                          onChange={(e) => setSpecForm({...specForm, engine: e.target.value})}
                          placeholder="2.5L 4-سلندر"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="brandLogo">شعار الماركة</Label>
                      <Input
                        id="brandLogo"
                        value={specForm.brandLogo}
                        onChange={(e) => setSpecForm({...specForm, brandLogo: e.target.value})}
                        placeholder="رابط شعار الماركة (URL)"
                        type="url"
                      />
                    </div>
                    <div>
                      <Label htmlFor="specifications">المواصفات الإضافية</Label>
                      <Textarea
                        id="specifications"
                        value={specForm.specifications}
                        onChange={(e) => setSpecForm({...specForm, specifications: e.target.value})}
                        placeholder="أدخل المواصفات التفصيلية مثل القوة، العزم، نوع الوقود، الأبعاد، المميزات..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      {editingSpec ? (
                        <>
                          <Button 
                            type="button" 
                            onClick={handleUpdateSpec}
                            className="flex-1"
                          >
                            تحديث المواصفات
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="flex-1"
                          >
                            إلغاء
                          </Button>
                        </>
                      ) : (
                        <Button type="submit" className="w-full" disabled={addSpecMutation.isPending}>
                          {addSpecMutation.isPending ? "جاري الإضافة..." : "إضافة المواصفات"}
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    تصفية المواصفات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>الماركة</Label>
                    <Select value={selectedMake} onValueChange={setSelectedMake}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الماركة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الماركات</SelectItem>
                        {Array.from(new Set(vehicleSpecs.map(spec => spec.make))).map(make => (
                          <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>الموديل</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الموديل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الموديلات</SelectItem>
                        {Array.from(new Set(
                          vehicleSpecs
                            .filter(spec => !selectedMake || selectedMake === "all" || spec.make === selectedMake)
                            .map(spec => spec.model)
                        )).map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>السنة</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر السنة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع السنوات</SelectItem>
                        {availableYears.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {Array.from(new Set(vehicleSpecs.map(spec => spec.make))).length}
                        </div>
                        <div className="text-sm text-gray-600">ماركة</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {Array.from(new Set(vehicleSpecs.map(spec => `${spec.make}-${spec.model}`))).length}
                        </div>
                        <div className="text-sm text-gray-600">موديل</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {filteredSpecs.length}
                        </div>
                        <div className="text-sm text-gray-600">مواصفات</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Specifications Table */}
            <Card>
              <CardHeader>
                <CardTitle>المواصفات المتاحة ({filteredSpecs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الماركة</TableHead>
                        <TableHead>الموديل</TableHead>
                        <TableHead>السنة</TableHead>
                        <TableHead>المحرك</TableHead>
                        <TableHead>المواصفات</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSpecs.map((spec: VehicleSpec) => (
                        <TableRow key={spec.id}>
                          <TableCell className="font-medium">{spec.make}</TableCell>
                          <TableCell>{spec.model}</TableCell>
                          <TableCell>{spec.year}</TableCell>
                          <TableCell>{spec.engine}</TableCell>
                          <TableCell className="max-w-xs truncate">{spec.specifications || "لا توجد مواصفات إضافية"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditSpec(spec)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteSpec(spec.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales-reps" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Sales Rep Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة مندوب جديد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSalesRepSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="rep-name">اسم المندوب *</Label>
                      <Input
                        id="rep-name"
                        value={salesRepForm.name}
                        onChange={(e) => setSalesRepForm({...salesRepForm, name: e.target.value})}
                        placeholder="أحمد محمد"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rep-email">البريد الإلكتروني</Label>
                      <Input
                        id="rep-email"
                        type="email"
                        value={salesRepForm.email}
                        onChange={(e) => setSalesRepForm({...salesRepForm, email: e.target.value})}
                        placeholder="ahmed@company.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rep-phone">رقم الهاتف</Label>
                      <Input
                        id="rep-phone"
                        value={salesRepForm.phone}
                        onChange={(e) => setSalesRepForm({...salesRepForm, phone: e.target.value})}
                        placeholder="01234567890"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={addSalesRepMutation.isPending}>
                      {addSalesRepMutation.isPending ? "جاري الإضافة..." : "إضافة المندوب"}
                    </Button>
                  </form>
                </CardContent>
              </Card>


            </div>

            {/* Sales Reps Table */}
            <Card>
              <CardHeader>
                <CardTitle>المندوبين ({salesReps.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>الهاتف</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesReps.map(rep => (
                        <TableRow key={rep.id}>
                          <TableCell className="font-medium">{rep.name}</TableCell>
                          <TableCell>{rep.email || "غير محدد"}</TableCell>
                          <TableCell>{rep.phone || "غير محدد"}</TableCell>

                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteSalesRep(rep.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Company Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة شركة جديدة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCompanySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">اسم الشركة *</Label>
                      <Input
                        id="company-name"
                        value={companyForm.name}
                        onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                        placeholder="شركة السيارات المتحدة"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-address">العنوان</Label>
                      <Input
                        id="company-address"
                        value={companyForm.address}
                        onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
                        placeholder="الرياض، المملكة العربية السعودية"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company-phone">رقم الهاتف</Label>
                        <Input
                          id="company-phone"
                          value={companyForm.phone}
                          onChange={(e) => setCompanyForm({...companyForm, phone: e.target.value})}
                          placeholder="01234567890"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company-email">البريد الإلكتروني</Label>
                        <Input
                          id="company-email"
                          type="email"
                          value={companyForm.email}
                          onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                          placeholder="info@company.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company-logo">شعار الشركة</Label>
                      <Input
                        id="company-logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const result = e.target?.result as string;
                              setCompanyForm({...companyForm, logo: result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="mb-2"
                      />
                      {companyForm.logo && (
                        <div className="mt-2">
                          <img 
                            src={companyForm.logo} 
                            alt="معاينة الشعار" 
                            className="w-20 h-20 object-contain border rounded"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="company-stamp">ختم الشركة</Label>
                      <Input
                        id="company-stamp"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const result = e.target?.result as string;
                              setCompanyForm({...companyForm, stamp: result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="mb-2"
                      />
                      {companyForm.stamp && (
                        <div className="mt-2">
                          <img 
                            src={companyForm.stamp} 
                            alt="معاينة الختم" 
                            className="w-20 h-20 object-contain border rounded"
                          />
                        </div>
                      )}
                    </div>
                    

                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="registration-number">رقم السجل التجاري</Label>
                        <Input
                          id="registration-number"
                          value={companyForm.registrationNumber}
                          onChange={(e) => setCompanyForm({...companyForm, registrationNumber: e.target.value})}
                          placeholder="1234567890"
                        />
                      </div>
                      <div>
                        <Label htmlFor="license-number">رقم الرخصة</Label>
                        <Input
                          id="license-number"
                          value={companyForm.licenseNumber}
                          onChange={(e) => setCompanyForm({...companyForm, licenseNumber: e.target.value})}
                          placeholder="LIC-123456"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tax-number">الرقم الضريبي</Label>
                        <Input
                          id="tax-number"
                          value={companyForm.taxNumber}
                          onChange={(e) => setCompanyForm({...companyForm, taxNumber: e.target.value})}
                          placeholder="300123456700003"
                        />
                      </div>
                    </div>
                    
                    {/* Company Colors Section */}
                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-3">ألوان الشركة لتخصيص التصميم</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="primary-color">اللون الأساسي</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="primary-color"
                              type="color"
                              value={companyForm.primaryColor}
                              onChange={(e) => setCompanyForm({...companyForm, primaryColor: e.target.value})}
                              className="w-12 h-10 p-1 rounded"
                            />
                            <Input
                              type="text"
                              value={companyForm.primaryColor}
                              onChange={(e) => setCompanyForm({...companyForm, primaryColor: e.target.value})}
                              placeholder="#3b82f6"
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="secondary-color">اللون الثانوي</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="secondary-color"
                              type="color"
                              value={companyForm.secondaryColor}
                              onChange={(e) => setCompanyForm({...companyForm, secondaryColor: e.target.value})}
                              className="w-12 h-10 p-1 rounded"
                            />
                            <Input
                              type="text"
                              value={companyForm.secondaryColor}
                              onChange={(e) => setCompanyForm({...companyForm, secondaryColor: e.target.value})}
                              placeholder="#1e40af"
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="text-color">لون النص</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="text-color"
                              type="color"
                              value={companyForm.textColor}
                              onChange={(e) => setCompanyForm({...companyForm, textColor: e.target.value})}
                              className="w-12 h-10 p-1 rounded"
                            />
                            <Input
                              type="text"
                              value={companyForm.textColor}
                              onChange={(e) => setCompanyForm({...companyForm, textColor: e.target.value})}
                              placeholder="#1f2937"
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="background-color">لون الخلفية</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="background-color"
                              type="color"
                              value={companyForm.backgroundColor}
                              onChange={(e) => setCompanyForm({...companyForm, backgroundColor: e.target.value})}
                              className="w-12 h-10 p-1 rounded"
                            />
                            <Input
                              type="text"
                              value={companyForm.backgroundColor}
                              onChange={(e) => setCompanyForm({...companyForm, backgroundColor: e.target.value})}
                              placeholder="#ffffff"
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Color Preview */}
                      <div className="mt-4 p-4 rounded-lg border" style={{
                        backgroundColor: companyForm.backgroundColor,
                        color: companyForm.textColor,
                        borderColor: companyForm.primaryColor
                      }}>
                        <div className="text-center">
                          <h5 style={{ color: companyForm.primaryColor }} className="font-bold text-lg mb-2">
                            {companyForm.name || "اسم الشركة"}
                          </h5>
                          <div style={{ color: companyForm.secondaryColor }} className="text-sm">
                            معاينة تصميم الشركة
                          </div>
                          <div className="text-xs mt-1">هذا مثال على كيفية ظهور الألوان في عرض السعر</div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div>
                      <Label htmlFor="terms">الشروط والأحكام</Label>
                      <Textarea
                        id="terms"
                        value={companyForm.termsAndConditions}
                        onChange={(e) => setCompanyForm({...companyForm, termsAndConditions: e.target.value})}
                        placeholder="أدخل الشروط والأحكام الخاصة بالشركة"
                        rows={8}
                        className="resize-none"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={addCompanyMutation.isPending}>
                      {addCompanyMutation.isPending ? "جاري الإضافة..." : "إضافة الشركة"}
                    </Button>
                  </form>
                </CardContent>
              </Card>


            </div>

            {/* Companies Table */}
            <Card>
              <CardHeader>
                <CardTitle>الشركات ({companies.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الشعار</TableHead>
                        <TableHead>الختم</TableHead>
                        <TableHead>اسم الشركة</TableHead>
                        <TableHead>العنوان</TableHead>
                        <TableHead>الهاتف</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>رقم السجل</TableHead>
                        <TableHead>رقم الرخصة</TableHead>
                        <TableHead>الرقم الضريبي</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map(company => (
                        <TableRow key={company.id}>
                          <TableCell>
                            {company.logo ? (
                              <img 
                                src={company.logo} 
                                alt={`شعار ${company.name}`}
                                className="w-8 h-8 object-contain rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                <Building className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {(company as any).stamp ? (
                              <img 
                                src={(company as any).stamp} 
                                alt={`ختم ${company.name}`}
                                className="w-8 h-8 object-contain rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                <FileText className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.address || "غير محدد"}</TableCell>
                          <TableCell>{company.phone || "غير محدد"}</TableCell>
                          <TableCell>{company.email || "غير محدد"}</TableCell>
                          <TableCell>{company.registrationNumber || "غير محدد"}</TableCell>
                          <TableCell>{(company as any).licenseNumber || "غير محدد"}</TableCell>
                          <TableCell>{company.taxNumber || "غير محدد"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditCompany(company)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteCompany(company.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  إدارة الشروط والأحكام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company-select">اختر الشركة</Label>
                      <Select 
                        value={selectedCompanyId} 
                        onValueChange={(value) => {
                          setSelectedCompanyId(value);
                          const company = companies.find(c => c.id === parseInt(value));
                          if (company) {
                            setCompanyForm({
                              ...companyForm,
                              termsAndConditions: (company as any).termsAndConditions || ""
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر الشركة لتحرير الشروط والأحكام" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="terms-editor">الشروط والأحكام</Label>
                      <Textarea
                        id="terms-editor"
                        value={companyForm.termsAndConditions}
                        onChange={(e) => setCompanyForm({...companyForm, termsAndConditions: e.target.value})}
                        placeholder="أدخل الشروط والأحكام الخاصة بالشركة"
                        rows={15}
                        className="resize-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => {
                        if (selectedCompanyId) {
                          const company = companies.find(c => c.id === parseInt(selectedCompanyId));
                          if (company) {
                            updateCompanyMutation.mutate({
                              id: company.id,
                              ...companyForm,
                              termsAndConditions: companyForm.termsAndConditions
                            });
                          }
                        }
                      }}
                      disabled={!selectedCompanyId || updateCompanyMutation.isPending}
                    >
                      {updateCompanyMutation.isPending ? "جاري الحفظ..." : "حفظ الشروط والأحكام"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}