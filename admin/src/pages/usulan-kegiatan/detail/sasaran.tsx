import { getValue } from "@/helpers/init";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
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

export default function Sasaran() {
   const { id_usulan_kegiatan } = useParams();

   const { data, isLoading, error } = useApiQuery<Lists>({
      queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "sasaran"],
      url: `/usulan-kegiatan/${id_usulan_kegiatan}/sasaran`,
   });

   if (isLoading) return loadingElement;

   if (error) {
      toast.error(error?.message);
      return null;
   }

   if (!data?.status) return <div className="p-6 text-center">Data tidak ditemukan</div>;

   const dataArray = data?.data ?? {};

   return (
      <div className="bg-gray-50 p-4 rounded-md">
         <p className="text-gray-900 whitespace-pre-wrap">{getValue(dataArray, "sasaran")}</p>
      </div>
   );
}
