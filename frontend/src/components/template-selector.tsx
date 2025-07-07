import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Palette, FileText, Eye, Settings } from 'lucide-react';
import { defaultTemplates, type PDFTemplate } from '@/lib/pdf-templates';

interface TemplateSelectorProps {
  selectedTemplate: PDFTemplate;
  onTemplateChange: (template: PDFTemplate) => void;
  onPreview: () => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange, onPreview }: TemplateSelectorProps) {
  const [customTemplate, setCustomTemplate] = useState<PDFTemplate>(selectedTemplate);
  const [activeTab, setActiveTab] = useState('predefined');

  const handleTemplateSelect = (template: PDFTemplate) => {
    setCustomTemplate(template);
    onTemplateChange(template);
  };

  const handleCustomTemplateChange = (field: string, value: any) => {
    const updated = { ...customTemplate };
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      (updated as any)[parent] = { ...(updated as any)[parent], [child]: value };
    } else {
      (updated as any)[field] = value;
    }
    
    setCustomTemplate(updated);
    onTemplateChange(updated);
  };

  const getTemplatePreview = (template: PDFTemplate) => {
    const gradientStyle = {
      background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`
    };

    return (
      <div className="w-full h-32 border rounded-lg overflow-hidden relative">
        {/* Header simulation */}
        <div 
          className="h-12 flex items-center px-3"
          style={template.elements.headerStyle === 'full' ? gradientStyle : { backgroundColor: template.colors.background }}
        >
          <div className="flex items-center gap-2">
            {template.elements.showLogo && (
              <div className="w-6 h-6 bg-white rounded opacity-80"></div>
            )}
            <div className="text-xs font-semibold" style={{ 
              color: template.elements.headerStyle === 'full' ? 'white' : template.colors.text 
            }}>
              اسم الشركة
            </div>
          </div>
        </div>
        
        {/* Content simulation */}
        <div className="p-3 space-y-2">
          <div className="text-center">
            <div className="text-sm font-bold" style={{ color: template.colors.primary }}>
              عرض سعر
            </div>
          </div>
          
          {/* Table simulation */}
          <div className="space-y-1">
            {template.elements.tableStyle === 'bordered' && (
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i}
                    className="h-2 rounded-sm"
                    style={{ 
                      backgroundColor: i < 4 ? template.colors.primary : '#f3f4f6',
                      opacity: i < 4 ? 1 : 0.5
                    }}
                  ></div>
                ))}
              </div>
            )}
            {template.elements.tableStyle === 'striped' && (
              <div className="space-y-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={i}
                    className="h-2 rounded-sm"
                    style={{ 
                      backgroundColor: i % 2 === 0 ? '#f9fafb' : 'white',
                      borderLeft: `2px solid ${template.colors.primary}`
                    }}
                  ></div>
                ))}
              </div>
            )}
            {template.elements.tableStyle === 'minimal' && (
              <div className="space-y-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={i}
                    className="h-1.5 rounded-sm"
                    style={{ backgroundColor: i === 0 ? template.colors.primary : '#e5e7eb' }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer elements */}
        <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
          {template.elements.showQRCode && (
            <div className="w-4 h-4 border rounded-sm" style={{ borderColor: template.colors.primary }}></div>
          )}
          <div className="text-xs opacity-50">التوقيع</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          قوالب PDF
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="predefined">قوالب جاهزة</TabsTrigger>
            <TabsTrigger value="custom">تخصيص</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predefined" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate.id === template.id 
                      ? 'ring-2 ring-primary shadow-md' 
                      : 'hover:shadow-sm'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant="outline">{template.layout}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    {getTemplatePreview(template)}
                    <div className="flex gap-2 mt-3">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: template.colors.primary }}
                        title="اللون الأساسي"
                      ></div>
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: template.colors.secondary }}
                        title="اللون الثانوي"
                      ></div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        حجم الخط: {template.fonts.body.size}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center pt-4">
              <Button onClick={onPreview} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                معاينة PDF
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colors Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    الألوان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primaryColor">اللون الأساسي</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={customTemplate.colors.primary}
                        onChange={(e) => handleCustomTemplateChange('colors.primary', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={customTemplate.colors.primary}
                        onChange={(e) => handleCustomTemplateChange('colors.primary', e.target.value)}
                        placeholder="#3b82f6"
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor">اللون الثانوي</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={customTemplate.colors.secondary}
                        onChange={(e) => handleCustomTemplateChange('colors.secondary', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={customTemplate.colors.secondary}
                        onChange={(e) => handleCustomTemplateChange('colors.secondary', e.target.value)}
                        placeholder="#1e40af"
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="textColor">لون النص</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <Input
                        id="textColor"
                        type="color"
                        value={customTemplate.colors.text}
                        onChange={(e) => handleCustomTemplateChange('colors.text', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={customTemplate.colors.text}
                        onChange={(e) => handleCustomTemplateChange('colors.text', e.target.value)}
                        placeholder="#1f2937"
                        className="font-mono"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Layout Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    التخطيط
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="headerStyle">نمط الرأس</Label>
                    <Select 
                      value={customTemplate.elements.headerStyle}
                      onValueChange={(value) => handleCustomTemplateChange('elements.headerStyle', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">كامل</SelectItem>
                        <SelectItem value="compact">مضغوط</SelectItem>
                        <SelectItem value="banner">شريط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tableStyle">نمط الجدول</Label>
                    <Select 
                      value={customTemplate.elements.tableStyle}
                      onValueChange={(value) => handleCustomTemplateChange('elements.tableStyle', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bordered">بحدود</SelectItem>
                        <SelectItem value="striped">مخطط</SelectItem>
                        <SelectItem value="minimal">بسيط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="showLogo"
                        checked={customTemplate.elements.showLogo}
                        onCheckedChange={(checked) => handleCustomTemplateChange('elements.showLogo', checked)}
                      />
                      <Label htmlFor="showLogo">إظهار الشعار</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="showQRCode"
                        checked={customTemplate.elements.showQRCode}
                        onCheckedChange={(checked) => handleCustomTemplateChange('elements.showQRCode', checked)}
                      />
                      <Label htmlFor="showQRCode">إظهار رمز QR</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="showWatermark"
                        checked={customTemplate.elements.showWatermark}
                        onCheckedChange={(checked) => handleCustomTemplateChange('elements.showWatermark', checked)}
                      />
                      <Label htmlFor="showWatermark">إظهار العلامة المائية</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Typography Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">الخطوط والمسافات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="headerFontSize">حجم خط العناوين</Label>
                    <Input
                      id="headerFontSize"
                      type="number"
                      min="12"
                      max="24"
                      value={customTemplate.fonts.header.size}
                      onChange={(e) => handleCustomTemplateChange('fonts.header.size', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bodyFontSize">حجم خط المحتوى</Label>
                    <Input
                      id="bodyFontSize"
                      type="number"
                      min="8"
                      max="16"
                      value={customTemplate.fonts.body.size}
                      onChange={(e) => handleCustomTemplateChange('fonts.body.size', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="margin">الهوامش</Label>
                    <Input
                      id="margin"
                      type="number"
                      min="10"
                      max="40"
                      value={customTemplate.spacing.margin}
                      onChange={(e) => handleCustomTemplateChange('spacing.margin', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sectionGap">المسافة بين الأقسام</Label>
                    <Input
                      id="sectionGap"
                      type="number"
                      min="5"
                      max="25"
                      value={customTemplate.spacing.sectionGap}
                      onChange={(e) => handleCustomTemplateChange('spacing.sectionGap', parseInt(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Preview Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">معاينة</CardTitle>
                </CardHeader>
                <CardContent>
                  {getTemplatePreview(customTemplate)}
                  <Button onClick={onPreview} className="w-full mt-4 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    معاينة PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}