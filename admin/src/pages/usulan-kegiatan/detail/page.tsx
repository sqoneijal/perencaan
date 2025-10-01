import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getValue } from "@/helpers/init";
import { useApiQuery } from "@/lib/useApi";
import type { ApiResponse, Lists } from "@/types/init";
import { useParams } from "react-router";
import { toast } from "sonner";

export default function Page() {
   const { id_usulan_kegiatan } = useParams();

   const { data, isLoading, error } = useApiQuery<ApiResponse<Lists>>({
      queryKey: ["usulan-kegiatan", id_usulan_kegiatan],
      url: `/usulan-kegiatan/${id_usulan_kegiatan}`,
   });

   if (isLoading)
      return (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
               <p className="text-gray-600 font-medium">Memuat data...</p>
            </div>
         </div>
      );

   if (error) {
      toast.error(error?.message);
      return null;
   }

   const item = data as unknown as Lists;
   if (!item) return <div className="p-6 text-center">Data tidak ditemukan</div>;

   const formatCurrency = (value: string) => {
      const num = parseFloat(value);
      return isNaN(num) ? value : num.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
   };

   const formatDate = (dateStr: string) => {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID");
   };

   return (
      <div className="overflow-hidden rounded-lg border shadow-sm p-4">
         <Tabs defaultValue="informasi-dasar" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
               <TabsTrigger value="informasi-dasar">Informasi Dasar</TabsTrigger>
               <TabsTrigger value="anggaran">Anggaran</TabsTrigger>
               <TabsTrigger value="latar-belakang">Latar Belakang</TabsTrigger>
               <TabsTrigger value="tujuan">Tujuan</TabsTrigger>
               <TabsTrigger value="sasaran">Sasaran</TabsTrigger>
               <TabsTrigger value="rab">RAB</TabsTrigger>
               <TabsTrigger value="iku">IKU</TabsTrigger>
               <TabsTrigger value="dokumen">Dokumen</TabsTrigger>
            </TabsList>

            <TabsContent value="informasi-dasar" className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Kode</label>
                     <p className="mt-1 text-gray-900">{getValue(item as unknown as Lists, "kode")}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Nama</label>
                     <p className="mt-1 text-gray-900">{getValue(item as unknown as Lists, "nama") || "-"}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Tanggal Mulai</label>
                     <p className="mt-1 text-gray-900">{formatDate(getValue(item as unknown as Lists, "tanggal_mulai"))}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Tanggal Selesai</label>
                     <p className="mt-1 text-gray-900">{formatDate(getValue(item as unknown as Lists, "tanggal_selesai"))}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Tempat Pelaksanaan</label>
                     <p className="mt-1 text-gray-900">{getValue(item as unknown as Lists, "tempat_pelaksanaan") || "-"}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Status Usulan</label>
                     <p className="mt-1 text-gray-900">{getValue(item as unknown as Lists, "status_usulan") || "-"}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Tanggal Pengajuan</label>
                     <p className="mt-1 text-gray-900">{formatDate(getValue(item as unknown as Lists, "tanggal_pengajuan"))}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600">ID Unit Pengusul</label>
                     <p className="mt-1 text-gray-900">{getValue(item as unknown as Lists, "id_unit_pengusul") || "-"}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Operator Input</label>
                     <p className="mt-1 text-gray-900">{getValue(item as unknown as Lists, "operator_input") || "-"}</p>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="anggaran" className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Total Anggaran</label>
                     <p className="mt-1 text-gray-900">{formatCurrency(getValue(item as unknown as Lists, "total_anggaran"))}</p>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-600">Rencana Total Anggaran</label>
                     <p className="mt-1 text-gray-900">{formatCurrency(getValue(item as unknown as Lists, "rencanca_total_anggaran"))}</p>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="latar-belakang" className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-900 whitespace-pre-wrap">{getValue(item as unknown as Lists, "latar_belakang") || "-"}</p>
               </div>
            </TabsContent>

            <TabsContent value="tujuan" className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-900 whitespace-pre-wrap">{getValue(item as unknown as Lists, "tujuan") || "-"}</p>
               </div>
            </TabsContent>

            <TabsContent value="sasaran" className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-900 whitespace-pre-wrap">{getValue(item as unknown as Lists, "sasaran") || "-"}</p>
               </div>
            </TabsContent>

            <TabsContent value="rab" className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-900">RAB content goes here (to be implemented)</p>
               </div>
            </TabsContent>

            <TabsContent value="iku" className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-900">Keterkaitan IKU content goes here (to be implemented)</p>
               </div>
            </TabsContent>

            <TabsContent value="dokumen" className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-900">Dokumen Pendukung content goes here (to be implemented)</p>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
