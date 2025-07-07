import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Palette, Type, Settings, Move, Image, Stamp } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function PdfCustomizationSimple() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Font sizes - جميع أحجام الخط
  const [headerFontSize, setHeaderFontSize] = useState(108);
  const [companyNameFontSize, setCompanyNameFontSize] = useState(162);
  const [dateFontSize, setDateFontSize] = useState(66);
  const [greetingFontSize, setGreetingFontSize] = useState(72);
  const [sectionTitleFontSize, setSectionTitleFontSize] = useState(66);
  const [contentFontSize, setContentFontSize] = useState(54);
  const [specificationsTitleFontSize, setSpecificationsTitleFontSize] = useState(72);
  const [specificationsContentFontSize, setSpecificationsContentFontSize] = useState(57);
  const [pricingTitleFontSize, setPricingTitleFontSize] = useState(72);
  const [pricingContentFontSize, setPricingContentFontSize] = useState(57);
  const [amountWordsFontSize, setAmountWordsFontSize] = useState(66);
  const [signatureFontSize, setSignatureFontSize] = useState(60);
  const [footerFontSize, setFooterFontSize] = useState(42);
  
  // Font families - أنواع الخطوط
  const [headerFontFamily, setHeaderFontFamily] = useState('Arial');
  const [contentFontFamily, setContentFontFamily] = useState('Arial');
  const [arabicFontFamily, setArabicFontFamily] = useState('Arial');
  
  // Colors - جميع الألوان
  const [headerBgColor, setHeaderBgColor] = useState('#00627F');
  const [headerTextColor, setHeaderTextColor] = useState('#FFFFFF');
  const [companyNameColor, setCompanyNameColor] = useState('#C79C45');
  const [contentTextColor, setContentTextColor] = useState('#000000');
  const [sectionTitleColor, setSectionTitleColor] = useState('#00627F');
  const [amountWordsColor, setAmountWordsColor] = useState('#C79C45');
  const [footerBgColor, setFooterBgColor] = useState('#C79C45');
  const [footerTextColor, setFooterTextColor] = useState('#000000');
  
  // Logo settings - إعدادات الشعار
  const [logoWidth, setLogoWidth] = useState(600);
  const [logoHeight, setLogoHeight] = useState(408);
  const [logoPositionX, setLogoPositionX] = useState(-300);
  const [logoPositionY, setLogoPositionY] = useState(3);
  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkOpacity, setWatermarkOpacity] = useState('0.08');
  
  // Stamp settings - إعدادات الختم
  const [stampWidth, setStampWidth] = useState(113);
  const [stampHeight, setStampHeight] = useState(71);
  const [stampPositionX, setStampPositionX] = useState(-125);
  const [stampPositionY, setStampPositionY] = useState(15);
  
  // Layout settings - إعدادات التخطيط
  const [headerHeight, setHeaderHeight] = useState(200);
  const [sectionSpacing, setSectionSpacing] = useState(20);
  const [marginTop, setMarginTop] = useState(5);
  const [marginLeft, setMarginLeft] = useState(5);
  const [marginRight, setMarginRight] = useState(5);
  const [marginBottom, setMarginBottom] = useState(5);
  
  // Element positions - مواضع العناصر
  const [datePositionX, setDatePositionX] = useState(-8);
  const [datePositionY, setDatePositionY] = useState(175);
  const [quotationNumberPositionX, setQuotationNumberPositionX] = useState(8);
  const [quotationNumberPositionY, setQuotationNumberPositionY] = useState(175);
  const [greetingPositionY, setGreetingPositionY] = useState(14);
  
  // Save customization
  const saveCustomizationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/pdf-customizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'تخصيص مخصص',
          // Font sizes
          headerFontSize,
          companyNameFontSize,
          dateFontSize,
          greetingFontSize,
          sectionTitleFontSize,
          contentFontSize,
          specificationsTitleFontSize,
          specificationsContentFontSize,
          pricingTitleFontSize,
          pricingContentFontSize,
          amountWordsFontSize,
          signatureFontSize,
          footerFontSize,
          // Font families
          headerFontFamily,
          contentFontFamily,
          arabicFontFamily,
          // Colors
          headerBackgroundColor: headerBgColor,
          headerTextColor,
          companyNameColor,
          contentTextColor,
          sectionTitleColor,
          amountWordsColor,
          footerBackgroundColor: footerBgColor,
          footerTextColor,
          // Logo settings
          logoWidth,
          logoHeight,
          logoPositionX,
          logoPositionY,
          showWatermark,
          watermarkOpacity,
          // Stamp settings
          stampWidth,
          stampHeight,
          stampPositionX,
          stampPositionY,
          // Layout settings
          headerHeight,
          sectionSpacing,
          marginTop,
          marginLeft,
          marginRight,
          marginBottom,
          // Element positions
          datePositionX,
          datePositionY,
          quotationNumberPositionX,
          quotationNumberPositionY,
          greetingPositionY,
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="fonts" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              الخطوط
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              الألوان
            </TabsTrigger>
            <TabsTrigger value="logo" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              الشعار
            </TabsTrigger>
            <TabsTrigger value="stamp" className="flex items-center gap-2">
              <Stamp className="h-4 w-4" />
              الختم
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              التخطيط
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <Move className="h-4 w-4" />
              المواضع
            </TabsTrigger>
          </TabsList>

          {/* Fonts Tab */}
          <TabsContent value="fonts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">أنواع الخطوط</CardTitle>
                  <CardDescription>اختر نوع الخط المناسب لكل عنصر</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">خط العناوين والرأس</Label>
                    <Select value={headerFontFamily} onValueChange={setHeaderFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times">Times New Roman</SelectItem>
                        <SelectItem value="Courier">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Tahoma">Tahoma</SelectItem>
                        <SelectItem value="Calibri">Calibri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">خط المحتوى والنصوص</Label>
                    <Select value={contentFontFamily} onValueChange={setContentFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times">Times New Roman</SelectItem>
                        <SelectItem value="Courier">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Tahoma">Tahoma</SelectItem>
                        <SelectItem value="Calibri">Calibri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">خط النصوص العربية</Label>
                    <Select value={arabicFontFamily} onValueChange={setArabicFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times">Times New Roman</SelectItem>
                        <SelectItem value="Tahoma">Tahoma</SelectItem>
                        <SelectItem value="Calibri">Calibri</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Traditional Arabic">Traditional Arabic</SelectItem>
                        <SelectItem value="Simplified Arabic">Simplified Arabic</SelectItem>
                      </SelectContent>
                    </Select>
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
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">لون عناوين الأقسام</Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        value={sectionTitleColor}
                        onChange={(e) => setSectionTitleColor(e.target.value)}
                        className="w-16 h-10 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={sectionTitleColor}
                        onChange={(e) => setSectionTitleColor(e.target.value)}
                        className="flex-1"
                        placeholder="#00627F"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">لون المبلغ بالكلمات</Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        value={amountWordsColor}
                        onChange={(e) => setAmountWordsColor(e.target.value)}
                        className="w-16 h-10 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={amountWordsColor}
                        onChange={(e) => setAmountWordsColor(e.target.value)}
                        className="flex-1"
                        placeholder="#C79C45"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">لون خلفية التذييل</Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        value={footerBgColor}
                        onChange={(e) => setFooterBgColor(e.target.value)}
                        className="w-16 h-10 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={footerBgColor}
                        onChange={(e) => setFooterBgColor(e.target.value)}
                        className="flex-1"
                        placeholder="#C79C45"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">لون نص التذييل</Label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        value={footerTextColor}
                        onChange={(e) => setFooterTextColor(e.target.value)}
                        className="w-16 h-10 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={footerTextColor}
                        onChange={(e) => setFooterTextColor(e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Logo Tab */}
          <TabsContent value="logo" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">أبعاد الشعار</CardTitle>
                  <CardDescription>تحكم في حجم شعار الشركة</CardDescription>
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
                  <CardTitle className="text-lg">موضع الشعار</CardTitle>
                  <CardDescription>تحكم في موضع الشعار في الصفحة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      موضع أفقي: {logoPositionX}px
                    </Label>
                    <Slider
                      value={[logoPositionX]}
                      onValueChange={(value) => setLogoPositionX(value[0])}
                      min={-400}
                      max={-100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      موضع عمودي: {logoPositionY}px
                    </Label>
                    <Slider
                      value={[logoPositionY]}
                      onValueChange={(value) => setLogoPositionY(value[0])}
                      min={0}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="watermark"
                        checked={showWatermark}
                        onCheckedChange={setShowWatermark}
                      />
                      <Label htmlFor="watermark">إظهار العلامة المائية</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      شفافية العلامة المائية: {(parseFloat(watermarkOpacity) * 100).toFixed(0)}%
                    </Label>
                    <Slider
                      value={[parseFloat(watermarkOpacity) * 100]}
                      onValueChange={(value) => setWatermarkOpacity((value[0] / 100).toFixed(2))}
                      min={1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stamp Tab */}
          <TabsContent value="stamp" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">أبعاد الختم</CardTitle>
                  <CardDescription>تحكم في حجم ختم الشركة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      عرض الختم: {stampWidth}px
                    </Label>
                    <Slider
                      value={[stampWidth]}
                      onValueChange={(value) => setStampWidth(value[0])}
                      min={50}
                      max={200}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      ارتفاع الختم: {stampHeight}px
                    </Label>
                    <Slider
                      value={[stampHeight]}
                      onValueChange={(value) => setStampHeight(value[0])}
                      min={30}
                      max={150}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">موضع الختم</CardTitle>
                  <CardDescription>تحكم في موضع الختم في منطقة التوقيع</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      موضع أفقي: {stampPositionX}px
                    </Label>
                    <Slider
                      value={[stampPositionX]}
                      onValueChange={(value) => setStampPositionX(value[0])}
                      min={-200}
                      max={-50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      موضع عمودي: {stampPositionY}px
                    </Label>
                    <Slider
                      value={[stampPositionY]}
                      onValueChange={(value) => setStampPositionY(value[0])}
                      min={5}
                      max={50}
                      step={1}
                      className="w-full"
                    />
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
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      المسافة بين الأقسام: {sectionSpacing}px
                    </Label>
                    <Slider
                      value={[sectionSpacing]}
                      onValueChange={(value) => setSectionSpacing(value[0])}
                      min={10}
                      max={40}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">هوامش الصفحة</CardTitle>
                  <CardDescription>تحكم في هوامش الصفحة من جميع الجهات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      الهامش العلوي: {marginTop}mm
                    </Label>
                    <Slider
                      value={[marginTop]}
                      onValueChange={(value) => setMarginTop(value[0])}
                      min={0}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      الهامش الأيسر: {marginLeft}mm
                    </Label>
                    <Slider
                      value={[marginLeft]}
                      onValueChange={(value) => setMarginLeft(value[0])}
                      min={0}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      الهامش الأيمن: {marginRight}mm
                    </Label>
                    <Slider
                      value={[marginRight]}
                      onValueChange={(value) => setMarginRight(value[0])}
                      min={0}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      الهامش السفلي: {marginBottom}mm
                    </Label>
                    <Slider
                      value={[marginBottom]}
                      onValueChange={(value) => setMarginBottom(value[0])}
                      min={0}
                      max={20}
                      step={1}
                      className="w-full"
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
                  <CardTitle className="text-lg">مواضع عناصر الرأس</CardTitle>
                  <CardDescription>تحكم في مواضع التاريخ ورقم العرض</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      موضع التاريخ أفقياً: {datePositionX}px
                    </Label>
                    <Slider
                      value={[datePositionX]}
                      onValueChange={(value) => setDatePositionX(value[0])}
                      min={-50}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      موضع التاريخ عمودياً: {datePositionY}px
                    </Label>
                    <Slider
                      value={[datePositionY]}
                      onValueChange={(value) => setDatePositionY(value[0])}
                      min={150}
                      max={200}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      موضع رقم العرض أفقياً: {quotationNumberPositionX}px
                    </Label>
                    <Slider
                      value={[quotationNumberPositionX]}
                      onValueChange={(value) => setQuotationNumberPositionX(value[0])}
                      min={0}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      موضع رقم العرض عمودياً: {quotationNumberPositionY}px
                    </Label>
                    <Slider
                      value={[quotationNumberPositionY]}
                      onValueChange={(value) => setQuotationNumberPositionY(value[0])}
                      min={150}
                      max={200}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">مواضع عناصر أخرى</CardTitle>
                  <CardDescription>تحكم في مواضع التحية والعناصر الأخرى</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      موضع التحية عمودياً: {greetingPositionY}px
                    </Label>
                    <Slider
                      value={[greetingPositionY]}
                      onValueChange={(value) => setGreetingPositionY(value[0])}
                      min={5}
                      max={30}
                      step={1}
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