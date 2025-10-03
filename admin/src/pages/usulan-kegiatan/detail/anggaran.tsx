import { getValue, toRupiah } from "@/helpers/init";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useParams } from "react-router";
import { toast } from "sonner";
import { loadingElement } from "./helper";

export default function Anggaran() {
   const { id_usulan_kegiatan } = useParams();

   const { data, isLoading, error } = useApiQuery<Lists>({
      queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "anggaran"],
      url: `/usulan-kegiatan/${id_usulan_kegiatan}/anggaran`,
   });

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
            <div className="block text-sm font-medium text-gray-600">Total Anggaran</div>
            <p className="mt-1 text-gray-900">{toRupiah(getValue(dataArray, "total_anggaran"))}</p>
         </div>
         <div>
            <div className="block text-sm font-medium text-gray-600">Rencana Total Anggaran</div>
            <p className="mt-1 text-gray-900">{toRupiah(getValue(dataArray, "rencanca_total_anggaran"))}</p>
         </div>
      </div>
   );
}
