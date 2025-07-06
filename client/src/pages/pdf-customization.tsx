import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Copy, Trash2, Download, Eye, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { PdfCustomization, InsertPdfCustomization } from '@shared/schema';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 p-0 border-0"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

interface PositionControlProps {
  label: string;
  xValue: number;
  yValue: number;
  onXChange: (value: number) => void;
  onYChange: (value: number) => void;
  xRange?: [number, number];
  yRange?: [number, number];
}

function PositionControl({ 
  label, 
  xValue, 
  yValue, 
  onXChange, 
  onYChange, 
  xRange = [-500, 500], 
  yRange = [0, 500] 
}: PositionControlProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">الموضع الأفقي (X)</Label>
          <Slider
            value={[xValue]}
            onValueChange={(value) => onXChange(value[0])}
            min={xRange[0]}
            max={xRange[1]}
            step={1}
            className="w-full"
          />
          <Input
            type="number"
            value={xValue}
            onChange={(e) => onXChange(parseInt(e.target.value) || 0)}
            className="text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">الموضع العمودي (Y)</Label>
          <Slider
            value={[yValue]}
            onValueChange={(value) => onYChange(value[0])}
            min={yRange[0]}
            max={yRange[1]}
            step={1}
            className="w-full"
          />
          <Input
            type="number"
            value={yValue}
            onChange={(e) => onYChange(parseInt(e.target.value) || 0)}
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}

export default function PdfCustomization() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedCustomizationId, setSelectedCustomizationId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<InsertPdfCustomization>>({
    name: 'تخصيص جديد',
    // Font sizes
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
    // Colors
    headerBackgroundColor: '#00627F',
    headerTextColor: '#FFFFFF',
    companyNameColor: '#C79C45',
    contentTextColor: '#000000',
    sectionTitleColor: '#00627F',
    amountWordsColor: '#C79C45',
    footerBackgroundColor: '#C79C45',
    footerTextColor: '#000000',
    // Logo settings
    logoWidth: 600,
    logoHeight: 408,
    logoPositionX: -300,
    logoPositionY: 3,
    showWatermark: true,
    watermarkOpacity: '0.08',
    // Stamp settings
    stampWidth: 113,
    stampHeight: 71,
    stampPositionX: -125,
    stampPositionY: 15,
    // Layout
    headerHeight: 200,
    sectionSpacing: 20,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    // Positions
    datePositionX: -8,
    datePositionY: 175,
    quotationNumberPositionX: 8,
    quotationNumberPositionY: 175,
    greetingPositionY: 14,
    isDefault: false,
  });

  // Fetch all customizations
  const { data: customizations = [] } = useQuery<PdfCustomization[]>({
    queryKey: ['/api/pdf-customizations'],
  });

  // Fetch default customization
  const { data: defaultCustomization } = useQuery({
    queryKey: ['/api/pdf-customizations/default'],
  });

  // Create customization mutation
  const createCustomizationMutation = useMutation({
    mutationFn: async (data: InsertPdfCustomization) => {
      const response = await fetch('/api/pdf-customizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create customization');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pdf-customizations'] });
      toast({
        title: 'تم إنشاء التخصيص',
        description: 'تم حفظ إعدادات التخصيص بنجاح',
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل في إنشاء التخصيص',
        variant: 'destructive',
      });
    },
  });

  // Update customization mutation
  const updateCustomizationMutation = useMutation({
    mutationFn: async (data: { id: number; customization: Partial<InsertPdfCustomization> }) => {
      const response = await fetch(`/api/pdf-customizations/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.customization),
      });
      if (!response.ok) throw new Error('Failed to update customization');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pdf-customizations'] });
      toast({
        title: 'تم تحديث التخصيص',
        description: 'تم حفظ التغييرات بنجاح',
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث التخصيص',
        variant: 'destructive',
      });
    },
  });

  // Delete customization mutation
  const deleteCustomizationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/pdf-customizations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete customization');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pdf-customizations'] });
      setSelectedCustomizationId(null);
      toast({
        title: 'تم حذف التخصيص',
        description: 'تم حذف التخصيص بنجاح',
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف التخصيص',
        variant: 'destructive',
      });
    },
  });

  // Set default customization mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/pdf-customizations/${id}/set-default`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to set default customization');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pdf-customizations'] });
      toast({
        title: 'تم تعيين التخصيص الافتراضي',
        description: 'تم تعيين هذا التخصيص كافتراضي',
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل في تعيين التخصيص الافتراضي',
        variant: 'destructive',
      });
    },
  });

  // Load selected customization
  useEffect(() => {
    if (selectedCustomizationId && customizations) {
      const customization = customizations.find((c: PdfCustomization) => c.id === selectedCustomizationId);
      if (customization) {
        setFormData(customization);
      }
    }
  }, [selectedCustomizationId, customizations]);

  const handleSave = () => {
    if (selectedCustomizationId) {
      updateCustomizationMutation.mutate({
        id: selectedCustomizationId,
        customization: formData,
      });
    } else {
      createCustomizationMutation.mutate(formData as InsertPdfCustomization);
    }
  };

  const handleCreateNew = () => {
    setSelectedCustomizationId(null);
    setFormData({
      name: 'تخصيص جديد',
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
      isDefault: false,
    });
  };

  const handleCopyFromExisting = (customization: PdfCustomization) => {
    setSelectedCustomizationId(null);
    const { id, ...customizationWithoutId } = customization;
    setFormData({
      ...customizationWithoutId,
      name: `نسخة من ${customization.name}`,
      isDefault: false,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">تخصيص عرض السعر</h1>
              <p className="text-muted-foreground">تحكم في ألوان وخطوط وتخطيط عرض السعر</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateNew} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              تخصيص جديد
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={createCustomizationMutation.isPending || updateCustomizationMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              حفظ التخصيص
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Customizations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">التخصيصات المحفوظة</CardTitle>
              <CardDescription>اختر تخصيص لتعديله أو إنشاء جديد</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {customizations.map((customization: PdfCustomization) => (
                <div
                  key={customization.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCustomizationId === customization.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedCustomizationId(customization.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customization.name}</p>
                      {customization.isDefault && (
                        <p className="text-xs text-primary">افتراضي</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyFromExisting(customization);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {!customization.isDefault && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomizationMutation.mutate(customization.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Customization Editor */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedCustomizationId ? 'تعديل التخصيص' : 'تخصيص جديد'}
                  </CardTitle>
                  <CardDescription>
                    تحكم في جميع جوانب مظهر عرض السعر
                  </CardDescription>
                </div>
                {selectedCustomizationId && !formData.isDefault && (
                  <Button
                    variant="outline"
                    onClick={() => setDefaultMutation.mutate(selectedCustomizationId)}
                    disabled={setDefaultMutation.isPending}
                  >
                    تعيين كافتراضي
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Template Name */}
                <div className="space-y-2">
                  <Label>اسم التخصيص</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم التخصيص"
                  />
                </div>

                <Tabs defaultValue="fonts" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="fonts">الخطوط</TabsTrigger>
                    <TabsTrigger value="colors">الألوان</TabsTrigger>
                    <TabsTrigger value="logo">الشعار</TabsTrigger>
                    <TabsTrigger value="layout">التخطيط</TabsTrigger>
                    <TabsTrigger value="positions">المواضع</TabsTrigger>
                  </TabsList>

                  {/* Fonts Tab */}
                  <TabsContent value="fonts" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">خطوط الرأس</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>حجم عنوان المستند: {formData.headerFontSize}pt</Label>
                            <Slider
                              value={[formData.headerFontSize || 108]}
                              onValueChange={(value) => setFormData({ ...formData, headerFontSize: value[0] })}
                              min={20}
                              max={200}
                              step={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>حجم اسم الشركة: {formData.companyNameFontSize}pt</Label>
                            <Slider
                              value={[formData.companyNameFontSize || 162]}
                              onValueChange={(value) => setFormData({ ...formData, companyNameFontSize: value[0] })}
                              min={20}
                              max={250}
                              step={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>حجم التاريخ ورقم العرض: {formData.dateFontSize}pt</Label>
                            <Slider
                              value={[formData.dateFontSize || 66]}
                              onValueChange={(value) => setFormData({ ...formData, dateFontSize: value[0] })}
                              min={10}
                              max={100}
                              step={1}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">خطوط المحتوى</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>حجم التحية: {formData.greetingFontSize}pt</Label>
                            <Slider
                              value={[formData.greetingFontSize || 72]}
                              onValueChange={(value) => setFormData({ ...formData, greetingFontSize: value[0] })}
                              min={10}
                              max={120}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>حجم عناوين الأقسام: {formData.sectionTitleFontSize}pt</Label>
                            <Slider
                              value={[formData.sectionTitleFontSize || 66]}
                              onValueChange={(value) => setFormData({ ...formData, sectionTitleFontSize: value[0] })}
                              min={10}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>حجم نص المحتوى: {formData.contentFontSize}pt</Label>
                            <Slider
                              value={[formData.contentFontSize || 54]}
                              onValueChange={(value) => setFormData({ ...formData, contentFontSize: value[0] })}
                              min={8}
                              max={80}
                              step={1}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">خطوط المواصفات والأسعار</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>حجم عنوان المواصفات: {formData.specificationsTitleFontSize}pt</Label>
                            <Slider
                              value={[formData.specificationsTitleFontSize || 72]}
                              onValueChange={(value) => setFormData({ ...formData, specificationsTitleFontSize: value[0] })}
                              min={10}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>حجم نص المواصفات: {formData.specificationsContentFontSize}pt</Label>
                            <Slider
                              value={[formData.specificationsContentFontSize || 57]}
                              onValueChange={(value) => setFormData({ ...formData, specificationsContentFontSize: value[0] })}
                              min={8}
                              max={80}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>حجم عنوان الأسعار: {formData.pricingTitleFontSize}pt</Label>
                            <Slider
                              value={[formData.pricingTitleFontSize || 72]}
                              onValueChange={(value) => setFormData({ ...formData, pricingTitleFontSize: value[0] })}
                              min={10}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>حجم نص الأسعار: {formData.pricingContentFontSize}pt</Label>
                            <Slider
                              value={[formData.pricingContentFontSize || 57]}
                              onValueChange={(value) => setFormData({ ...formData, pricingContentFontSize: value[0] })}
                              min={8}
                              max={80}
                              step={1}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">خطوط أخرى</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>حجم المبلغ كتابة: {formData.amountWordsFontSize}pt</Label>
                            <Slider
                              value={[formData.amountWordsFontSize || 66]}
                              onValueChange={(value) => setFormData({ ...formData, amountWordsFontSize: value[0] })}
                              min={10}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>حجم التوقيع: {formData.signatureFontSize}pt</Label>
                            <Slider
                              value={[formData.signatureFontSize || 60]}
                              onValueChange={(value) => setFormData({ ...formData, signatureFontSize: value[0] })}
                              min={10}
                              max={100}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>حجم التذييل: {formData.footerFontSize}pt</Label>
                            <Slider
                              value={[formData.footerFontSize || 42]}
                              onValueChange={(value) => setFormData({ ...formData, footerFontSize: value[0] })}
                              min={8}
                              max={60}
                              step={1}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Colors Tab */}
                  <TabsContent value="colors" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">ألوان الرأس</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ColorPicker
                            label="لون خلفية الرأس"
                            value={formData.headerBackgroundColor || '#00627F'}
                            onChange={(value) => setFormData({ ...formData, headerBackgroundColor: value })}
                          />
                          <ColorPicker
                            label="لون نص الرأس"
                            value={formData.headerTextColor || '#FFFFFF'}
                            onChange={(value) => setFormData({ ...formData, headerTextColor: value })}
                          />
                          <ColorPicker
                            label="لون اسم الشركة"
                            value={formData.companyNameColor || '#C79C45'}
                            onChange={(value) => setFormData({ ...formData, companyNameColor: value })}
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">ألوان المحتوى</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ColorPicker
                            label="لون النص الأساسي"
                            value={formData.contentTextColor || '#000000'}
                            onChange={(value) => setFormData({ ...formData, contentTextColor: value })}
                          />
                          <ColorPicker
                            label="لون عناوين الأقسام"
                            value={formData.sectionTitleColor || '#00627F'}
                            onChange={(value) => setFormData({ ...formData, sectionTitleColor: value })}
                          />
                          <ColorPicker
                            label="لون المبلغ كتابة"
                            value={formData.amountWordsColor || '#C79C45'}
                            onChange={(value) => setFormData({ ...formData, amountWordsColor: value })}
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">ألوان التذييل</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ColorPicker
                            label="لون خلفية التذييل"
                            value={formData.footerBackgroundColor || '#C79C45'}
                            onChange={(value) => setFormData({ ...formData, footerBackgroundColor: value })}
                          />
                          <ColorPicker
                            label="لون نص التذييل"
                            value={formData.footerTextColor || '#000000'}
                            onChange={(value) => setFormData({ ...formData, footerTextColor: value })}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Logo Tab */}
                  <TabsContent value="logo" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">إعدادات الشعار</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>عرض الشعار: {formData.logoWidth}px</Label>
                            <Slider
                              value={[formData.logoWidth || 600]}
                              onValueChange={(value) => setFormData({ ...formData, logoWidth: value[0] })}
                              min={50}
                              max={800}
                              step={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>ارتفاع الشعار: {formData.logoHeight}px</Label>
                            <Slider
                              value={[formData.logoHeight || 408]}
                              onValueChange={(value) => setFormData({ ...formData, logoHeight: value[0] })}
                              min={30}
                              max={600}
                              step={5}
                            />
                          </div>
                          <PositionControl
                            label="موضع الشعار"
                            xValue={formData.logoPositionX || -300}
                            yValue={formData.logoPositionY || 3}
                            onXChange={(value) => setFormData({ ...formData, logoPositionX: value })}
                            onYChange={(value) => setFormData({ ...formData, logoPositionY: value })}
                            xRange={[-800, 100]}
                            yRange={[0, 300]}
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">الخلفية المائية</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={formData.showWatermark || false}
                              onCheckedChange={(checked) => setFormData({ ...formData, showWatermark: checked })}
                            />
                            <Label>إظهار الشعار كخلفية مائية</Label>
                          </div>
                          {formData.showWatermark && (
                            <div className="space-y-2">
                              <Label>شفافية الخلفية المائية: {(parseFloat(formData.watermarkOpacity || '0.08') * 100).toFixed(0)}%</Label>
                              <Slider
                                value={[parseFloat(formData.watermarkOpacity || '0.08') * 100]}
                                onValueChange={(value) => setFormData({ ...formData, watermarkOpacity: (value[0] / 100).toFixed(2) })}
                                min={1}
                                max={20}
                                step={1}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">إعدادات الختم</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>عرض الختم: {formData.stampWidth}px</Label>
                            <Slider
                              value={[formData.stampWidth || 113]}
                              onValueChange={(value) => setFormData({ ...formData, stampWidth: value[0] })}
                              min={30}
                              max={200}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>ارتفاع الختم: {formData.stampHeight}px</Label>
                            <Slider
                              value={[formData.stampHeight || 71]}
                              onValueChange={(value) => setFormData({ ...formData, stampHeight: value[0] })}
                              min={20}
                              max={150}
                              step={1}
                            />
                          </div>
                          <PositionControl
                            label="موضع الختم"
                            xValue={formData.stampPositionX || -125}
                            yValue={formData.stampPositionY || 15}
                            onXChange={(value) => setFormData({ ...formData, stampPositionX: value })}
                            onYChange={(value) => setFormData({ ...formData, stampPositionY: value })}
                            xRange={[-300, 100]}
                            yRange={[0, 150]}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Layout Tab */}
                  <TabsContent value="layout" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">أبعاد الصفحة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>ارتفاع الرأس: {formData.headerHeight}px</Label>
                            <Slider
                              value={[formData.headerHeight || 200]}
                              onValueChange={(value) => setFormData({ ...formData, headerHeight: value[0] })}
                              min={100}
                              max={350}
                              step={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>التباعد بين الأقسام: {formData.sectionSpacing}px</Label>
                            <Slider
                              value={[formData.sectionSpacing || 20]}
                              onValueChange={(value) => setFormData({ ...formData, sectionSpacing: value[0] })}
                              min={5}
                              max={50}
                              step={1}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">الهوامش</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>الهامش العلوي: {formData.marginTop}mm</Label>
                            <Slider
                              value={[formData.marginTop || 5]}
                              onValueChange={(value) => setFormData({ ...formData, marginTop: value[0] })}
                              min={0}
                              max={20}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>الهامش الأيسر: {formData.marginLeft}mm</Label>
                            <Slider
                              value={[formData.marginLeft || 5]}
                              onValueChange={(value) => setFormData({ ...formData, marginLeft: value[0] })}
                              min={0}
                              max={20}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>الهامش الأيمن: {formData.marginRight}mm</Label>
                            <Slider
                              value={[formData.marginRight || 5]}
                              onValueChange={(value) => setFormData({ ...formData, marginRight: value[0] })}
                              min={0}
                              max={20}
                              step={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>الهامش السفلي: {formData.marginBottom}mm</Label>
                            <Slider
                              value={[formData.marginBottom || 5]}
                              onValueChange={(value) => setFormData({ ...formData, marginBottom: value[0] })}
                              min={0}
                              max={20}
                              step={1}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Positions Tab */}
                  <TabsContent value="positions" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">مواضع عناصر الرأس</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <PositionControl
                            label="موضع التاريخ"
                            xValue={formData.datePositionX || -8}
                            yValue={formData.datePositionY || 175}
                            onXChange={(value) => setFormData({ ...formData, datePositionX: value })}
                            onYChange={(value) => setFormData({ ...formData, datePositionY: value })}
                            xRange={[-100, 100]}
                            yRange={[50, 250]}
                          />
                          <PositionControl
                            label="موضع رقم العرض"
                            xValue={formData.quotationNumberPositionX || 8}
                            yValue={formData.quotationNumberPositionY || 175}
                            onXChange={(value) => setFormData({ ...formData, quotationNumberPositionX: value })}
                            onYChange={(value) => setFormData({ ...formData, quotationNumberPositionY: value })}
                            xRange={[-100, 100]}
                            yRange={[50, 250]}
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">مواضع عناصر المحتوى</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-2">
                            <Label>موضع التحية العمودي: {formData.greetingPositionY}px</Label>
                            <Slider
                              value={[formData.greetingPositionY || 14]}
                              onValueChange={(value) => setFormData({ ...formData, greetingPositionY: value[0] })}
                              min={5}
                              max={50}
                              step={1}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}