import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";

export function useOptions() {
   const {
      data: dataDaftarFakultas,
      isLoading: isLoadingDaftarFakultas,
      error: errorDaftarFakultas,
   } = useApiQuery<Array<Lists>>({
      queryKey: ["options", "fakultas"],
      url: "/options/fakultas",
   });

   const {
      data: dataDaftarProdi,
      isLoading: isLoadingDaftarProdi,
      error: errorDaftarProdi,
   } = useApiQuery<Array<Lists>>({
      queryKey: ["options", "program-studi"],
      url: "/options/program-studi",
   });

   return {
      daftarFakultas: dataDaftarFakultas?.data || [],
      isLoadingDaftarFakultas,
      errorDaftarFakultas,
      dataDaftarProdi: dataDaftarProdi?.data || [],
      isLoadingDaftarProdi,
      errorDaftarProdi,
   };
}
