import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save, Palette, Type, Settings } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function PdfCustomizationSimple() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Font sizes
  const [headerFontSize, setHeaderFontSize] = useState(108);
  const [companyNameFontSize, setCompanyNameFontSize] = useState(162);
  const [dateFontSize, setDateFontSize] = useState(66);
  const [contentFontSize, setContentFontSize] = useState(54);
  const [sectionTitleFontSize, setSectionTitleFontSize] = useState(66);
  
  // Colors
  const [headerBgColor, setHeaderBgColor] = useState('#00627F');
  const [headerTextColor, setHeaderTextColor] = useState('#FFFFFF');
  const [companyNameColor, setCompanyNameColor] = useState('#C79C45');
  const [contentTextColor, setContentTextColor] = useState('#000000');
  
  // Logo and layout
  const [logoWidth, setLogoWidth] = useState(600);
  const [logoHeight, setLogoHeight] = useState(408);
  const [headerHeight, setHeaderHeight] = useState(200);
  
  // Save customization
  const saveCustomizationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/pdf-customizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'تخصيص مخصص',
          headerFontSize,
          companyNameFontSize,
          dateFontSize,
          contentFontSize,
          sectionTitleFontSize,
          headerBackgroundColor: headerBgColor,
          headerTextColor,
          companyNameColor,
          contentTextColor,
          logoWidth,
          logoHeight,
          headerHeight,
          isDefault: true,
        }),
      });
      if (!response.ok) throw new Error('Failed to save');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'تم حفظ التخصيص',
        description: 'تم حفظ إعدادات PDF بنجاح',
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل في حفظ التخصيص',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">تخصيص عرض السعر PDF</h1>
              <p className="text-muted-foreground">تحكم في ألوان وخطوط وتخطيط عرض السعر</p>
            </div>
          </div>
          <Button 
            onClick={() => saveCustomizationMutation.mutate()} 
            disabled={saveCustomizationMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            حفظ التخصيص
          </Button>
        </div>

        <Tabs defaultValue="fonts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fonts" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              الخطوط
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              الألوان
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              التخطيط
            </TabsTrigger>
          </TabsList>

          {/* Fonts Tab */}
          <TabsContent value="fonts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">خطوط الرأس</CardTitle>
                  <CardDescription>تحكم في أحجام خطوط الرأس والعناوين</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      حجم عنوان المستند: {headerFontSize}pt
                    </Label>
                    <Slider
                      value={[headerFontSize]}
                      onValueChange={(value) => setHeaderFontSize(value[0])}
                      min={50}
                      max={200}
                      step={2}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      حجم اسم الشركة: {companyNameFontSize}pt
                    </Label>
                    <Slider
                      value={[companyNameFontSize]}
                      onValueChange={(value) => setCompanyNameFontSize(value[0])}
                      min={80}
                      max={250}
                      step={2}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      حجم التاريخ ورقم العرض: {dateFontSize}pt
                    </Label>
                    <Slider
                      value={[dateFontSize]}
                      onValueChange={(value) => setDateFontSize(value[0])}
                      min={30}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">خطوط المحتوى</CardTitle>
                  <CardDescription>تحكم في أحجام خطوط النصوص والمحتوى</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      حجم عناوين الأقسام: {sectionTitleFontSize}pt
                    </Label>
                    <Slider
                      value={[sectionTitleFontSize]}
                      onValueChange={(value) => setSectionTitleFontSize(value[0])}
                      min={30}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      حجم نص المحتوى: {contentFontSize}pt
                    </Label>
                    <Slider
                      value={[contentFontSize]}
                      onValueChange={(value) => setContentFontSize(value[0])}
                      min={20}
                      max={80}
                      step={1}
                      className="w-full"
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
                  <CardTitle className="text-lg">ألوان الرأس</CardTitle>
                  <CardDescription>تخصيص ألوان رأس المستند</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">لون خلفية الرأس</Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        value={headerBgColor}
                        onChange={(e) => setHeaderBgColor(e.target.value)}
                        className="w-16 h-10 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={headerBgColor}
                        onChange={(e) => setHeaderBgColor(e.target.value)}
                        className="flex-1"
                        placeholder="#00627F"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">لون نص الرأس</Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        value={headerTextColor}
                        onChange={(e) => setHeaderTextColor(e.target.value)}
                        className="w-16 h-10 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={headerTextColor}
                        onChange={(e) => setHeaderTextColor(e.target.value)}
                        className="flex-1"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">لون اسم الشركة</Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        value={companyNameColor}
                        onChange={(e) => setCompanyNameColor(e.target.value)}
                        className="w-16 h-10 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={companyNameColor}
                        onChange={(e) => setCompanyNameColor(e.target.value)}
                        className="flex-1"
                        placeholder="#C79C45"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ألوان المحتوى</CardTitle>
                  <CardDescription>تخصيص ألوان النصوص والمحتوى</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">لون النص الأساسي</Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        value={contentTextColor}
                        onChange={(e) => setContentTextColor(e.target.value)}
                        className="w-16 h-10 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={contentTextColor}
                        onChange={(e) => setContentTextColor(e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">أبعاد الشعار</CardTitle>
                  <CardDescription>تحكم في حجم وموضع شعار الشركة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      عرض الشعار: {logoWidth}px
                    </Label>
                    <Slider
                      value={[logoWidth]}
                      onValueChange={(value) => setLogoWidth(value[0])}
                      min={200}
                      max={800}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      ارتفاع الشعار: {logoHeight}px
                    </Label>
                    <Slider
                      value={[logoHeight]}
                      onValueChange={(value) => setLogoHeight(value[0])}
                      min={150}
                      max={600}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">تخطيط الصفحة</CardTitle>
                  <CardDescription>تحكم في أبعاد وتخطيط عناصر الصفحة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      ارتفاع الرأس: {headerHeight}px
                    </Label>
                    <Slider
                      value={[headerHeight]}
                      onValueChange={(value) => setHeaderHeight(value[0])}
                      min={150}
                      max={350}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>معاينة التخصيص</CardTitle>
            <CardDescription>هذه معاينة تقريبية لكيف ستبدو إعدادات الخط والألوان</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 rounded-lg border-2"
              style={{ 
                backgroundColor: headerBgColor,
                color: headerTextColor,
                minHeight: `${headerHeight}px`,
                position: 'relative'
              }}
            >
              <div 
                style={{ 
                  fontSize: `${Math.min(headerFontSize / 4, 24)}px`,
                  color: headerTextColor,
                  marginBottom: '10px'
                }}
              >
                عرض سعر
              </div>
              <div 
                style={{ 
                  fontSize: `${Math.min(companyNameFontSize / 6, 32)}px`,
                  color: companyNameColor,
                  textAlign: 'center',
                  marginBottom: '10px'
                }}
              >
                شركة البريمي
              </div>
              <div 
                style={{ 
                  fontSize: `${Math.min(dateFontSize / 3, 18)}px`,
                  color: headerTextColor
                }}
              >
                تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div 
                style={{ 
                  fontSize: `${Math.min(sectionTitleFontSize / 3, 20)}px`,
                  color: headerBgColor,
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}
              >
                بيانات العميل
              </div>
              <div 
                style={{ 
                  fontSize: `${Math.min(contentFontSize / 3, 16)}px`,
                  color: contentTextColor
                }}
              >
                الاسم: عميل تجريبي<br/>
                رقم الهاتف: 05xxxxxxxx
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}