import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Eye, Edit, Trash2, Search, Download, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SavedQuotation {
  id: number;
  quotationNumber: string;
  customerName: string;
  customerPhone: string;
  customerIdNumber?: string;
  carMaker: string;
  carModel: string;
  carYear: string;
  basePrice: string;
  totalPrice: string;
  vatRate: string;
  platePrice: string;
  quantity: number;
  validityPeriod: number;
  status: string;
  issueDate: string;
  deadlineDate: string;
  includesPlatesAndTax: boolean;
  isWarrantied: boolean;
  isRiyadhDelivery: boolean;
  salesRepName: string;
  salesRepPhone: string;
  salesRepEmail: string;
  vehicleSpecifications: string;
  detailedSpecs: string;
  vinNumber: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    name: string;
    phone: string;
    email: string;
    title: string;
  };
  vehicle?: {
    maker: string;
    model: string;
    year: string;
    exteriorColor: string;
    interiorColor: string;
    vinNumber: string;
    specifications: string;
    detailedSpecs: string;
  };
  company?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    logo: string;
    stamp: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
  };
}

export default function SavedQuotations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Fetch saved quotations
  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ['/api/quotations'],
    queryFn: async () => {
      const response = await fetch('/api/quotations');
      return await response.json() as SavedQuotation[];
    },
  });

  // Delete quotation mutation
  const deleteQuotationMutation = useMutation({
    mutationFn: async (id: number) => {
      return fetch(`/api/quotations/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف عرض السعر بنجاح',
      });
    },
    onError: () => {
      toast({
        title: 'فشل في الحذف',
        description: 'حدث خطأ أثناء حذف عرض السعر',
        variant: 'destructive',
      });
    },
  });

  // Filter quotations based on search and status
  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch = 
      quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.carMaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.carModel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف عرض السعر هذا؟')) {
      deleteQuotationMutation.mutate(id);
    }
  };

  const handleView = (quotation: SavedQuotation) => {
    // TODO: Navigate to view page or open modal with quotation details
    console.log('View quotation:', quotation);
    toast({
      title: 'عرض التفاصيل',
      description: `عرض تفاصيل ${quotation.quotationNumber}`,
    });
  };

  const handleEdit = (quotation: SavedQuotation) => {
    // Store quotation data in localStorage for editing
    localStorage.setItem('editingQuotation', JSON.stringify(quotation));
    
    // Navigate to main page with edit parameter
    setLocation(`/?edit=${quotation.id}`);
    
    toast({
      title: 'تحرير العرض',
      description: `تم التوجيه لتحرير ${quotation.quotationNumber}`,
    });
  };

  const handleDownload = async (quotation: SavedQuotation) => {
    try {
      // Import PDF generator
      const { generateCustomizedQuotationPDF } = await import('@/lib/pdf-generator');
      
      // Prepare complete PDF data with all quotation information
      const pdfData = {
        customerTitle: quotation.customer?.title || 'السادة/ ',
        customerName: quotation.customer?.name || quotation.customerName || 'غير محدد',
        customerPhone: quotation.customer?.phone || quotation.customerPhone || 'غير محدد',
        customerEmail: quotation.customer?.email || 'غير محدد',
        customerIdNumber: quotation.customerIdNumber || 'غير محدد',
        
        carMaker: quotation.vehicle?.maker || quotation.carMaker || 'غير محدد',
        carModel: quotation.vehicle?.model || quotation.carModel || 'غير محدد',
        carYear: quotation.vehicle?.year || quotation.carYear || new Date().getFullYear().toString(),
        exteriorColor: quotation.vehicle?.exteriorColor || 'غير محدد',
        interiorColor: quotation.vehicle?.interiorColor || 'غير محدد',
        vinNumber: quotation.vehicle?.vinNumber || quotation.vinNumber || 'غير محدد',
        
        basePrice: parseFloat(quotation.basePrice) || 0,
        quantity: quotation.quantity || 1,
        vatRate: parseFloat(quotation.vatRate) || 15,
        platePrice: parseFloat(quotation.platePrice) || 0,
        totalPrice: parseFloat(quotation.totalPrice) || 0,
        
        quotationNumber: quotation.quotationNumber,
        issueDate: quotation.issueDate ? new Date(quotation.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        deadlineDate: quotation.deadlineDate ? new Date(quotation.deadlineDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        
        companyName: quotation.company?.name || 'شركة البريمي للسيارات',
        companyPhone: quotation.company?.phone || '0112345678',
        companyEmail: quotation.company?.email || 'info@albarimi.com',
        companyAddress: quotation.company?.address || 'عنوان الشركة',
        companyLogo: quotation.company?.logo || null,
        companyStamp: quotation.company?.stamp || null,
        companyPrimaryColor: quotation.company?.primaryColor || '#3b82f6',
        companySecondaryColor: quotation.company?.secondaryColor || '#1e40af',
        companyTextColor: quotation.company?.textColor || '#1f2937',
        
        salesRepName: quotation.salesRepName || 'غير محدد',
        salesRepPhone: quotation.salesRepPhone || 'غير محدد',
        salesRepEmail: quotation.salesRepEmail || 'غير محدد',
        
        vehicleSpecifications: quotation.vehicleSpecifications || quotation.vehicle?.specifications || 'غير محدد',
        detailedSpecs: quotation.detailedSpecs || quotation.vehicle?.detailedSpecs || 'غير محدد',
        
        documentType: 'quotation',
        validityPeriod: quotation.validityPeriod || 30,
        
        includesPlatesAndTax: quotation.includesPlatesAndTax || false,
        isWarrantied: quotation.isWarrantied || false,
        isRiyadhDelivery: quotation.isRiyadhDelivery || false,
      };
      
      console.log('Download quotation:', pdfData);
      
      // Generate PDF with complete data
      const pdf = await generateCustomizedQuotationPDF(pdfData);
      
      // Save PDF with proper filename
      const fileName = `عرض-سعر-${quotation.quotationNumber}-${pdfData.customerName}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: 'تم تحميل PDF بنجاح',
        description: `تم تحميل ${quotation.quotationNumber} بصيغة A4 مع كامل المعلومات`,
      });
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: 'فشل في التحميل',
        description: 'حدث خطأ أثناء تحميل الملف',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'sent': return 'مرسل';
      case 'accepted': return 'مقبول';
      case 'rejected': return 'مرفوض';
      default: return 'غير محدد';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل عروض السعر...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  العودة للرئيسية
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">عروض السعر المحفوظة</h1>
            </div>
            <Link href="/">
              <Button>
                إنشاء عرض سعر جديد
              </Button>
            </Link>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في عروض السعر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="sent">مرسل</option>
              <option value="accepted">مقبول</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>



        {/* Quotations Table */}
        {filteredQuotations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">لا توجد عروض سعر محفوظة</p>
              <Link href="/">
                <Button className="mt-4">
                  إنشاء أول عرض سعر
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>قائمة عروض السعر ({filteredQuotations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4">رقم العرض</th>
                      <th className="text-right py-3 px-4">العميل</th>
                      <th className="text-right py-3 px-4">المركبة</th>
                      <th className="text-right py-3 px-4">السعر الإجمالي</th>
                      <th className="text-right py-3 px-4">الحالة</th>
                      <th className="text-right py-3 px-4">تاريخ الإنشاء</th>
                      <th className="text-right py-3 px-4">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotations.map((quotation) => (
                      <tr key={quotation.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{quotation.quotationNumber}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{quotation.customer?.name || quotation.customerName}</div>
                            <div className="text-sm text-gray-500">{quotation.customer?.phone || quotation.customerPhone}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {quotation.vehicle?.maker || quotation.carMaker} {quotation.vehicle?.model || quotation.carModel} {quotation.vehicle?.year || quotation.carYear}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {parseFloat(quotation.totalPrice).toLocaleString()} ريال
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(quotation.status)}>
                            {getStatusText(quotation.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {format(new Date(quotation.createdAt), 'dd/MM/yyyy')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleView(quotation)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(quotation)}
                              title="تحرير"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(quotation)}
                              title="تحميل PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(quotation.id)}
                              disabled={deleteQuotationMutation.isPending}
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}