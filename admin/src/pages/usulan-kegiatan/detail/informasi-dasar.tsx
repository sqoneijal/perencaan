import { getValue, loadingSpinner } from "@/helpers/init";
import { usePegawai, useUnitKerja } from "@/helpers/simpeg";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import moment from "moment";
import { useParams } from "react-router";
import { toast } from "sonner";

const loadingElement = (
   <div className="bg-gray-50 p-4 rounded-md">
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 min-h-[500px]">
         <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Memuat data...</p>
         </div>
      </div>
   </div>
);

export default function InformasiDasar() {
   const formatDate = (dateStr: string) => {
      if (!dateStr) return "-";
      return moment(dateStr).format("DD-MM-YYYY");
   };

   const { id_usulan_kegiatan } = useParams();

   const { data, isLoading, error } = useApiQuery<Lists>({
      queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "informasi-dasar"],
      url: `/usulan-kegiatan/${id_usulan_kegiatan}/informasi-dasar`,
   });

   const { data: operator, isLoading: isLoadingOperator } = usePegawai(data?.data ? getValue(data.data, "operator_input") : undefined);
   const { data: unitKerja, isLoading: isLoadingUnitKerja } = useUnitKerja(data?.data ? getValue(data.data, "id_unit_pengusul") : undefined);

   if (isLoading) return loadingElement;

   if (error) {
      toast.error(error?.message);
      return null;
   }

   if (!data?.status) return <div className="p-6 text-center">Data tidak ditemukan</div>;

   const dataArray = data?.data ?? {};

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
            <div className="block text-sm font-medium text-gray-600">Kode</div>
            <p className="mt-1 text-gray-900">{getValue(dataArray, "kode")}</p>
         </div>
         <div>
            <div className="block text-sm font-medium text-gray-600">Nama</div>
            <p className="mt-1 text-gray-900">{getValue(dataArray, "nama")}</p>
         </div>
         <div>
            <div className="block text-sm font-medium text-gray-600">Tanggal Mulai</div>
            <p className="mt-1 text-gray-900">{formatDate(getValue(dataArray, "tanggal_mulai"))}</p>
         </div>
         <div>
            <div className="block text-sm font-medium text-gray-600">Tanggal Selesai</div>
            <p className="mt-1 text-gray-900">{formatDate(getValue(dataArray, "tanggal_selesai"))}</p>
         </div>
         <div>
            <div className="block text-sm font-medium text-gray-600">Tempat Pelaksanaan</div>
            <p className="mt-1 text-gray-900">{getValue(dataArray, "tempat_pelaksanaan")}</p>
         </div>
         <div>
            <div className="block text-sm font-medium text-gray-600">Status Usulan</div>
            <p className="mt-1 text-gray-900">{getValue(dataArray, "status_usulan")}</p>
         </div>
         <div>
            <div className="block text-sm font-medium text-gray-600">Tanggal Pengajuan</div>
            <p className="mt-1 text-gray-900">{formatDate(getValue(dataArray, "tanggal_pengajuan"))}</p>
         </div>
         <div>
            <div className="block text-sm font-medium text-gray-600">Unit Pengusul</div>
            {isLoadingUnitKerja && loadingSpinner()}
            {!isLoadingUnitKerja && <p className="mt-1 text-gray-900">{unitKerja}</p>}
         </div>
         <div>
            <div className="block text-sm font-medium text-gray-600">Operator Input</div>
            {isLoadingOperator && loadingSpinner()}
            {!isLoadingOperator && (
               <p className="mt-1 text-gray-900">
                  {getValue(dataArray, "operator_input")} - {getValue(operator, "nama")}
               </p>
            )}
         </div>
      </div>
   );
}
