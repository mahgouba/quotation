import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, QrCode, Eye, Edit, Trash2, Calendar, User, Car, DollarSign, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface QuotationWithDetails {
  id: number;
  customerId: number;
  vehicleId: number;
  companyId: number;
  quantity: number;
  basePrice: string;
  totalPrice: string;
  status: string;
  issueDate: string;
  deadlineDate: string;
  customer: {
    name: string;
    phone: string | null;
    email: string | null;
  };
  vehicle: {
    maker: string;
    model: string;
    exteriorColor: string | null;
    interiorColor: string | null;
  };
  company: {
    name: string;
  };
}

export default function SearchQuotations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [showQrScanner, setShowQrScanner] = useState(false);

  // Fetch all quotations
  const { data: quotations, isLoading, refetch } = useQuery<QuotationWithDetails[]>({
    queryKey: ["/api/quotations"],
    queryFn: async () => {
      const response = await fetch("/api/quotations");
      if (!response.ok) {
        throw new Error("Failed to fetch quotations");
      }
      return response.json();
    },
  });

  // Filter quotations based on search term
  const filteredQuotations = quotations?.filter(quotation => 
    quotation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.vehicle.maker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.id.toString().includes(searchTerm)
  ) || [];

  // Handle QR code scanning
  const handleQrCodeScan = async () => {
    if (!qrCodeData) return;
    
    try {
      // Extract quotation ID from QR code data
      const quotationId = qrCodeData.match(/quotation\/(\d+)/)?.[1];
      if (quotationId) {
        setSearchTerm(quotationId);
        setQrCodeData("");
        setShowQrScanner(false);
      }
    } catch (error) {
      console.error("Error parsing QR code:", error);
    }
  };

  // Handle viewing quotation
  const handleViewQuotation = (quotationId: number) => {
    // Navigate to quotation view/edit page
    window.location.href = `/quotation/${quotationId}`;
  };

  // Handle deleting quotation
  const handleDeleteQuotation = async (quotationId: number) => {
    if (confirm("هل أنت متأكد من حذف عرض السعر؟")) {
      try {
        const response = await fetch(`/api/quotations/${quotationId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          refetch();
        }
      } catch (error) {
        console.error("Error deleting quotation:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                العودة للقائمة الرئيسية
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            البحث في عروض الأسعار
          </h1>
          <p className="text-gray-600">
            ابحث عن عروض الأسعار السابقة أو استخدم الكيو آر كود للوصول المباشر
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              البحث والفلترة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="البحث بالاسم، نوع السيارة، الموديل، أو رقم العرض..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-right"
                />
              </div>
              <Button
                onClick={() => setShowQrScanner(!showQrScanner)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                مسح الكيو آر كود
              </Button>
            </div>

            {/* QR Code Scanner */}
            {showQrScanner && (
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="الصق رابط الكيو آر كود هنا أو اكتب رقم العرض"
                    value={qrCodeData}
                    onChange={(e) => setQrCodeData(e.target.value)}
                    className="text-right"
                  />
                  <Button onClick={handleQrCodeScan} disabled={!qrCodeData}>
                    بحث
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              نتائج البحث ({filteredQuotations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري التحميل...</p>
              </div>
            ) : filteredQuotations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">لا توجد عروض أسعار مطابقة للبحث</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم العرض</TableHead>
                      <TableHead className="text-right">العميل</TableHead>
                      <TableHead className="text-right">المركبة</TableHead>
                      <TableHead className="text-right">الشركة</TableHead>
                      <TableHead className="text-right">السعر الإجمالي</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">تاريخ الإصدار</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotations.map((quotation) => (
                      <TableRow key={quotation.id}>
                        <TableCell className="font-medium">
                          #{quotation.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quotation.customer.name}</div>
                            {quotation.customer.phone && (
                              <div className="text-sm text-gray-600">
                                {quotation.customer.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {quotation.vehicle.maker} {quotation.vehicle.model}
                            </div>
                            {quotation.vehicle.exteriorColor && (
                              <div className="text-sm text-gray-600">
                                {quotation.vehicle.exteriorColor}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{quotation.company.name}</TableCell>
                        <TableCell className="font-medium">
                          {parseFloat(quotation.totalPrice).toLocaleString()} ريال
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={quotation.status === 'approved' ? 'default' : 
                                   quotation.status === 'draft' ? 'secondary' : 'destructive'}
                          >
                            {quotation.status === 'approved' ? 'موافق عليه' :
                             quotation.status === 'draft' ? 'مسودة' : 'مرفوض'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(quotation.issueDate), 'dd/MM/yyyy', { locale: ar })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewQuotation(quotation.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteQuotation(quotation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}