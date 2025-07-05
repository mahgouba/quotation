import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Eye, Edit, Trash2, Search, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
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
  carMaker: string;
  carModel: string;
  carYear: string;
  basePrice: string;
  totalPrice: string;
  status: string;
  issueDate: string;
  deadlineDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function SavedQuotations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي العروض</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العروض المرسلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations.filter(q => q.status === 'sent').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العروض المقبولة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {quotations.filter(q => q.status === 'accepted').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي القيمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations.reduce((sum, q) => sum + parseFloat(q.totalPrice || '0'), 0).toLocaleString()} ريال
              </div>
            </CardContent>
          </Card>
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
                            <div className="font-medium">{quotation.customerName}</div>
                            <div className="text-sm text-gray-500">{quotation.customerPhone}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {quotation.carMaker} {quotation.carModel} {quotation.carYear}
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
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(quotation.id)}
                              disabled={deleteQuotationMutation.isPending}
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