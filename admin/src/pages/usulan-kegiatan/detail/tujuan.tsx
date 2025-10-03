import { getValue } from "@/helpers/init";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useParams } from "react-router";
import { toast } from "sonner";
import { loadingElement } from "./helper";

export default function Tujuan() {
   const { id_usulan_kegiatan } = useParams();

   const { data, isLoading, error } = useApiQuery<Lists>({
      queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "tujuan"],
      url: `/usulan-kegiatan/${id_usulan_kegiatan}/tujuan`,
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
         <p className="text-gray-900 whitespace-pre-wrap">{getValue(dataArray, "tujuan")}</p>
      </div>
   );
}
