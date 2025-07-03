import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Car, Settings, Database, Home, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface VehicleSpec {
  id: number;
  make: string;
  model: string;
  year: number;
  engine: string;
  horsepower: string;
  torque: string;
  transmission: string;
  driveType: string;
  fuelType: string;
  fuelCapacity: string;
  fuelConsumption: string;
  topSpeed: string;
  acceleration: string;
  length: string;
  width: string;
  height: string;
  wheelbase: string;
  weight: string;
  seatingCapacity: string;
  trunkCapacity: string;
  safetyFeatures: string;
  techFeatures: string;
  exteriorFeatures: string;
  interiorFeatures: string;
}

interface Make {
  id: number;
  name: string;
  modelsCount: number;
}

interface Model {
  id: number;
  name: string;
  makeId: number;
  makeName: string;
  yearsCount: number;
}

export default function VehicleManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isAddingSpec, setIsAddingSpec] = useState(false);
  const [editingSpec, setEditingSpec] = useState<VehicleSpec | null>(null);
  
  const [newSpec, setNewSpec] = useState<Partial<VehicleSpec>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    engine: "",
    horsepower: "",
    torque: "",
    transmission: "",
    driveType: "",
    fuelType: "",
    fuelCapacity: "",
    fuelConsumption: "",
    topSpeed: "",
    acceleration: "",
    length: "",
    width: "",
    height: "",
    wheelbase: "",
    weight: "",
    seatingCapacity: "",
    trunkCapacity: "",
    safetyFeatures: "",
    techFeatures: "",
    exteriorFeatures: "",
    interiorFeatures: ""
  });

  // Fetch vehicle specifications
  const { data: vehicleSpecs = [], refetch: refetchSpecs } = useQuery({
    queryKey: ['/api/vehicle-specs'],
    queryFn: async () => {
      const response = await fetch('/api/vehicle-specs');
      if (!response.ok) throw new Error('Failed to fetch vehicle specs');
      return response.json();
    }
  });

  // Fetch makes
  const { data: makes = [] } = useQuery({
    queryKey: ['/api/makes'],
    queryFn: async () => {
      const response = await fetch('/api/makes');
      if (!response.ok) throw new Error('Failed to fetch makes');
      return response.json();
    }
  });

  // Fetch models for selected make
  const { data: models = [] } = useQuery({
    queryKey: ['/api/models', selectedMake],
    queryFn: async () => {
      if (!selectedMake) return [];
      const response = await fetch(`/api/models?make=${selectedMake}`);
      if (!response.ok) throw new Error('Failed to fetch models');
      return response.json();
    },
    enabled: !!selectedMake
  });

  // Add specification mutation
  const addSpecMutation = useMutation({
    mutationFn: async (specData: Partial<VehicleSpec>) => {
      const response = await fetch('/api/vehicle-specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specData)
      });
      if (!response.ok) throw new Error('Failed to add specification');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم إضافة المواصفات بنجاح",
      });
      setIsAddingSpec(false);
      setNewSpec({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        engine: "",
        horsepower: "",
        torque: "",
        transmission: "",
        driveType: "",
        fuelType: "",
        fuelCapacity: "",
        fuelConsumption: "",
        topSpeed: "",
        acceleration: "",
        length: "",
        width: "",
        height: "",
        wheelbase: "",
        weight: "",
        seatingCapacity: "",
        trunkCapacity: "",
        safetyFeatures: "",
        techFeatures: "",
        exteriorFeatures: "",
        interiorFeatures: ""
      });
      refetchSpecs();
    },
    onError: (error) => {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المواصفات",
        variant: "destructive",
      });
    }
  });

  // Update specification mutation
  const updateSpecMutation = useMutation({
    mutationFn: async (specData: VehicleSpec) => {
      const response = await fetch(`/api/vehicle-specs/${specData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specData)
      });
      if (!response.ok) throw new Error('Failed to update specification');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث المواصفات بنجاح",
      });
      setEditingSpec(null);
      refetchSpecs();
    },
    onError: (error) => {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث المواصفات",
        variant: "destructive",
      });
    }
  });

  // Delete specification mutation
  const deleteSpecMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/vehicle-specs/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete specification');
    },
    onSuccess: () => {
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المواصفات بنجاح",
      });
      refetchSpecs();
    },
    onError: (error) => {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف المواصفات",
        variant: "destructive",
      });
    }
  });

  const handleAddSpec = () => {
    if (!newSpec.make || !newSpec.model || !newSpec.year) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال الماركة والموديل والسنة",
        variant: "destructive",
      });
      return;
    }

    addSpecMutation.mutate(newSpec);
  };

  const handleUpdateSpec = () => {
    if (!editingSpec) return;
    updateSpecMutation.mutate(editingSpec);
  };

  const handleDeleteSpec = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المواصفات؟")) {
      deleteSpecMutation.mutate(id);
    }
  };

  const filteredSpecs = vehicleSpecs.filter((spec: VehicleSpec) => {
    if (selectedMake && selectedMake !== "all" && spec.make !== selectedMake) return false;
    if (selectedModel && selectedModel !== "all" && spec.model !== selectedModel) return false;
    if (selectedYear && selectedYear !== "all" && spec.year.toString() !== selectedYear) return false;
    return true;
  });

  const availableYears = Array.from(
    new Set(vehicleSpecs.map((spec: VehicleSpec) => spec.year))
  ).sort((a: number, b: number) => b - a);

  return (
    <div className="bg-background min-h-screen" dir="rtl">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Database className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-gray-900">إدارة بيانات المركبات</h1>
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">إدارة مواصفات المركبات</h2>
          <p className="text-gray-600">إضافة وتعديل مواصفات المركبات حسب الماركة والموديل والسنة</p>
        </div>

        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specifications">المواصفات</TabsTrigger>
            <TabsTrigger value="summary">الملخص</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  تصفية البيانات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>الماركة</Label>
                    <Select value={selectedMake} onValueChange={setSelectedMake}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الماركة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الماركات</SelectItem>
                        {Array.from(new Set(vehicleSpecs.map((spec: VehicleSpec) => spec.make))).map((make: string) => (
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
                            .filter((spec: VehicleSpec) => !selectedMake || spec.make === selectedMake)
                            .map((spec: VehicleSpec) => spec.model)
                        )).map((model: string) => (
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
                  <div className="flex items-end">
                    <Dialog open={isAddingSpec} onOpenChange={setIsAddingSpec}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة مواصفات جديدة
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>إضافة مواصفات جديدة</DialogTitle>
                          <DialogDescription>
                            أدخل المواصفات التفصيلية للمركبة
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>الماركة</Label>
                            <Input
                              value={newSpec.make}
                              onChange={(e) => setNewSpec({...newSpec, make: e.target.value})}
                              placeholder="أدخل الماركة"
                            />
                          </div>
                          <div>
                            <Label>الموديل</Label>
                            <Input
                              value={newSpec.model}
                              onChange={(e) => setNewSpec({...newSpec, model: e.target.value})}
                              placeholder="أدخل الموديل"
                            />
                          </div>
                          <div>
                            <Label>السنة</Label>
                            <Input
                              type="number"
                              value={newSpec.year}
                              onChange={(e) => setNewSpec({...newSpec, year: parseInt(e.target.value)})}
                              placeholder="أدخل السنة"
                            />
                          </div>
                          <div>
                            <Label>المحرك</Label>
                            <Input
                              value={newSpec.engine}
                              onChange={(e) => setNewSpec({...newSpec, engine: e.target.value})}
                              placeholder="مثال: 3.5L V6"
                            />
                          </div>
                          <div>
                            <Label>القوة</Label>
                            <Input
                              value={newSpec.horsepower}
                              onChange={(e) => setNewSpec({...newSpec, horsepower: e.target.value})}
                              placeholder="مثال: 290 حصان"
                            />
                          </div>
                          <div>
                            <Label>عزم الدوران</Label>
                            <Input
                              value={newSpec.torque}
                              onChange={(e) => setNewSpec({...newSpec, torque: e.target.value})}
                              placeholder="مثال: 350 نيوتن متر"
                            />
                          </div>
                          <div>
                            <Label>ناقل الحركة</Label>
                            <Input
                              value={newSpec.transmission}
                              onChange={(e) => setNewSpec({...newSpec, transmission: e.target.value})}
                              placeholder="مثال: أوتوماتيك 8 سرعات"
                            />
                          </div>
                          <div>
                            <Label>نوع الدفع</Label>
                            <Input
                              value={newSpec.driveType}
                              onChange={(e) => setNewSpec({...newSpec, driveType: e.target.value})}
                              placeholder="مثال: دفع أمامي"
                            />
                          </div>
                          <div>
                            <Label>نوع الوقود</Label>
                            <Input
                              value={newSpec.fuelType}
                              onChange={(e) => setNewSpec({...newSpec, fuelType: e.target.value})}
                              placeholder="مثال: بنزين"
                            />
                          </div>
                          <div>
                            <Label>سعة خزان الوقود</Label>
                            <Input
                              value={newSpec.fuelCapacity}
                              onChange={(e) => setNewSpec({...newSpec, fuelCapacity: e.target.value})}
                              placeholder="مثال: 60 لتر"
                            />
                          </div>
                          <div>
                            <Label>استهلاك الوقود</Label>
                            <Input
                              value={newSpec.fuelConsumption}
                              onChange={(e) => setNewSpec({...newSpec, fuelConsumption: e.target.value})}
                              placeholder="مثال: 8.5 لتر/100 كم"
                            />
                          </div>
                          <div>
                            <Label>السرعة القصوى</Label>
                            <Input
                              value={newSpec.topSpeed}
                              onChange={(e) => setNewSpec({...newSpec, topSpeed: e.target.value})}
                              placeholder="مثال: 200 كم/ساعة"
                            />
                          </div>
                          <div>
                            <Label>التسارع</Label>
                            <Input
                              value={newSpec.acceleration}
                              onChange={(e) => setNewSpec({...newSpec, acceleration: e.target.value})}
                              placeholder="مثال: 0-100 كم/ساعة في 7.5 ثانية"
                            />
                          </div>
                          <div>
                            <Label>الطول</Label>
                            <Input
                              value={newSpec.length}
                              onChange={(e) => setNewSpec({...newSpec, length: e.target.value})}
                              placeholder="مثال: 4850 مم"
                            />
                          </div>
                          <div>
                            <Label>العرض</Label>
                            <Input
                              value={newSpec.width}
                              onChange={(e) => setNewSpec({...newSpec, width: e.target.value})}
                              placeholder="مثال: 1850 مم"
                            />
                          </div>
                          <div>
                            <Label>الارتفاع</Label>
                            <Input
                              value={newSpec.height}
                              onChange={(e) => setNewSpec({...newSpec, height: e.target.value})}
                              placeholder="مثال: 1680 مم"
                            />
                          </div>
                          <div>
                            <Label>قاعدة العجلات</Label>
                            <Input
                              value={newSpec.wheelbase}
                              onChange={(e) => setNewSpec({...newSpec, wheelbase: e.target.value})}
                              placeholder="مثال: 2750 مم"
                            />
                          </div>
                          <div>
                            <Label>الوزن</Label>
                            <Input
                              value={newSpec.weight}
                              onChange={(e) => setNewSpec({...newSpec, weight: e.target.value})}
                              placeholder="مثال: 1650 كجم"
                            />
                          </div>
                          <div>
                            <Label>عدد المقاعد</Label>
                            <Input
                              value={newSpec.seatingCapacity}
                              onChange={(e) => setNewSpec({...newSpec, seatingCapacity: e.target.value})}
                              placeholder="مثال: 5 مقاعد"
                            />
                          </div>
                          <div>
                            <Label>سعة الصندوق</Label>
                            <Input
                              value={newSpec.trunkCapacity}
                              onChange={(e) => setNewSpec({...newSpec, trunkCapacity: e.target.value})}
                              placeholder="مثال: 520 لتر"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>ميزات السلامة</Label>
                            <Textarea
                              value={newSpec.safetyFeatures}
                              onChange={(e) => setNewSpec({...newSpec, safetyFeatures: e.target.value})}
                              placeholder="مثال: نظام فرامل مانع للانغلاق، وسائد هوائية متعددة، نظام مراقبة ضغط الإطارات"
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>المميزات التقنية</Label>
                            <Textarea
                              value={newSpec.techFeatures}
                              onChange={(e) => setNewSpec({...newSpec, techFeatures: e.target.value})}
                              placeholder="مثال: شاشة تعمل باللمس، نظام ملاحة، اتصال لاسلكي، نظام صوتي متقدم"
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>المظهر الخارجي</Label>
                            <Textarea
                              value={newSpec.exteriorFeatures}
                              onChange={(e) => setNewSpec({...newSpec, exteriorFeatures: e.target.value})}
                              placeholder="مثال: مصابيح LED، مرايا قابلة للطي كهربائياً، جنوط سبيكة"
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>المظهر الداخلي</Label>
                            <Textarea
                              value={newSpec.interiorFeatures}
                              onChange={(e) => setNewSpec({...newSpec, interiorFeatures: e.target.value})}
                              placeholder="مثال: مقاعد جلدية، تكييف أوتوماتيك، نوافذ كهربائية"
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button onClick={handleAddSpec} disabled={addSpecMutation.isPending}>
                            {addSpecMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                          </Button>
                          <Button variant="outline" onClick={() => setIsAddingSpec(false)}>
                            إلغاء
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  المواصفات المتاحة
                  <Badge variant="secondary">{filteredSpecs.length}</Badge>
                </CardTitle>
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
                        <TableHead>القوة</TableHead>
                        <TableHead>نوع الوقود</TableHead>
                        <TableHead>العمليات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSpecs.map((spec: VehicleSpec) => (
                        <TableRow key={spec.id}>
                          <TableCell className="font-medium">{spec.make}</TableCell>
                          <TableCell>{spec.model}</TableCell>
                          <TableCell>{spec.year}</TableCell>
                          <TableCell>{spec.engine}</TableCell>
                          <TableCell>{spec.horsepower}</TableCell>
                          <TableCell>{spec.fuelType}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingSpec(spec)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSpec(spec.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredSpecs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            لا توجد مواصفات متاحة
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>إجمالي الماركات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Array.from(new Set(vehicleSpecs.map((spec: VehicleSpec) => spec.make))).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>إجمالي الموديلات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Array.from(new Set(vehicleSpecs.map((spec: VehicleSpec) => `${spec.make}-${spec.model}`))).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>إجمالي المواصفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{vehicleSpecs.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={!!editingSpec} onOpenChange={() => setEditingSpec(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل المواصفات</DialogTitle>
              <DialogDescription>
                تعديل المواصفات التفصيلية للمركبة
              </DialogDescription>
            </DialogHeader>
            {editingSpec && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>الماركة</Label>
                  <Input
                    value={editingSpec.make}
                    onChange={(e) => setEditingSpec({...editingSpec, make: e.target.value})}
                  />
                </div>
                <div>
                  <Label>الموديل</Label>
                  <Input
                    value={editingSpec.model}
                    onChange={(e) => setEditingSpec({...editingSpec, model: e.target.value})}
                  />
                </div>
                <div>
                  <Label>السنة</Label>
                  <Input
                    type="number"
                    value={editingSpec.year}
                    onChange={(e) => setEditingSpec({...editingSpec, year: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>المحرك</Label>
                  <Input
                    value={editingSpec.engine}
                    onChange={(e) => setEditingSpec({...editingSpec, engine: e.target.value})}
                  />
                </div>
                <div>
                  <Label>القوة</Label>
                  <Input
                    value={editingSpec.horsepower}
                    onChange={(e) => setEditingSpec({...editingSpec, horsepower: e.target.value})}
                  />
                </div>
                <div>
                  <Label>عزم الدوران</Label>
                  <Input
                    value={editingSpec.torque}
                    onChange={(e) => setEditingSpec({...editingSpec, torque: e.target.value})}
                  />
                </div>
                <div>
                  <Label>ناقل الحركة</Label>
                  <Input
                    value={editingSpec.transmission}
                    onChange={(e) => setEditingSpec({...editingSpec, transmission: e.target.value})}
                  />
                </div>
                <div>
                  <Label>نوع الدفع</Label>
                  <Input
                    value={editingSpec.driveType}
                    onChange={(e) => setEditingSpec({...editingSpec, driveType: e.target.value})}
                  />
                </div>
                <div>
                  <Label>نوع الوقود</Label>
                  <Input
                    value={editingSpec.fuelType}
                    onChange={(e) => setEditingSpec({...editingSpec, fuelType: e.target.value})}
                  />
                </div>
                <div>
                  <Label>سعة خزان الوقود</Label>
                  <Input
                    value={editingSpec.fuelCapacity}
                    onChange={(e) => setEditingSpec({...editingSpec, fuelCapacity: e.target.value})}
                  />
                </div>
                <div>
                  <Label>استهلاك الوقود</Label>
                  <Input
                    value={editingSpec.fuelConsumption}
                    onChange={(e) => setEditingSpec({...editingSpec, fuelConsumption: e.target.value})}
                  />
                </div>
                <div>
                  <Label>السرعة القصوى</Label>
                  <Input
                    value={editingSpec.topSpeed}
                    onChange={(e) => setEditingSpec({...editingSpec, topSpeed: e.target.value})}
                  />
                </div>
                <div>
                  <Label>التسارع</Label>
                  <Input
                    value={editingSpec.acceleration}
                    onChange={(e) => setEditingSpec({...editingSpec, acceleration: e.target.value})}
                  />
                </div>
                <div>
                  <Label>الطول</Label>
                  <Input
                    value={editingSpec.length}
                    onChange={(e) => setEditingSpec({...editingSpec, length: e.target.value})}
                  />
                </div>
                <div>
                  <Label>العرض</Label>
                  <Input
                    value={editingSpec.width}
                    onChange={(e) => setEditingSpec({...editingSpec, width: e.target.value})}
                  />
                </div>
                <div>
                  <Label>الارتفاع</Label>
                  <Input
                    value={editingSpec.height}
                    onChange={(e) => setEditingSpec({...editingSpec, height: e.target.value})}
                  />
                </div>
                <div>
                  <Label>قاعدة العجلات</Label>
                  <Input
                    value={editingSpec.wheelbase}
                    onChange={(e) => setEditingSpec({...editingSpec, wheelbase: e.target.value})}
                  />
                </div>
                <div>
                  <Label>الوزن</Label>
                  <Input
                    value={editingSpec.weight}
                    onChange={(e) => setEditingSpec({...editingSpec, weight: e.target.value})}
                  />
                </div>
                <div>
                  <Label>عدد المقاعد</Label>
                  <Input
                    value={editingSpec.seatingCapacity}
                    onChange={(e) => setEditingSpec({...editingSpec, seatingCapacity: e.target.value})}
                  />
                </div>
                <div>
                  <Label>سعة الصندوق</Label>
                  <Input
                    value={editingSpec.trunkCapacity}
                    onChange={(e) => setEditingSpec({...editingSpec, trunkCapacity: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>ميزات السلامة</Label>
                  <Textarea
                    value={editingSpec.safetyFeatures}
                    onChange={(e) => setEditingSpec({...editingSpec, safetyFeatures: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>المميزات التقنية</Label>
                  <Textarea
                    value={editingSpec.techFeatures}
                    onChange={(e) => setEditingSpec({...editingSpec, techFeatures: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>المظهر الخارجي</Label>
                  <Textarea
                    value={editingSpec.exteriorFeatures}
                    onChange={(e) => setEditingSpec({...editingSpec, exteriorFeatures: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>المظهر الداخلي</Label>
                  <Textarea
                    value={editingSpec.interiorFeatures}
                    onChange={(e) => setEditingSpec({...editingSpec, interiorFeatures: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button onClick={handleUpdateSpec} disabled={updateSpecMutation.isPending}>
                {updateSpecMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
              <Button variant="outline" onClick={() => setEditingSpec(null)}>
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}