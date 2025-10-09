import { useOptions, useTahunAnggaran } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect } from "react";
import { toast } from "sonner";

export function useInit() {
   const { setOptions } = useOptions();
   const { setTahunAnggaran, tahunAnggaran } = useTahunAnggaran();

   const { data, isLoading } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["pagu-anggaran", "tahun-anggaran"],
      url: "/pagu-anggaran/tahun-anggaran",
   });

   useEffect(() => {
      if (!isLoading && data?.results) {
         const dataArray = Array.isArray(data?.results) ? data?.results : [];
         setOptions({ daftarTahunAnggaran: dataArray });
         setTahunAnggaran(dataArray.find((e) => e.is_aktif === "t").tahun_anggaran);
      }
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isLoading, data, setOptions]);

   const {
      data: dataArrayPaguUniversitas,
      isLoading: isLoadingPaguUniversitas,
      error,
   } = useApiQuery<{
      results: Lists;
      status: boolean;
   }>({
      queryKey: ["pagu-anggaran", "universitas", tahunAnggaran],
      url: `/pagu-anggaran/${tahunAnggaran}/universitas`,
      options: { enabled: !!tahunAnggaran },
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["pagu-anggaran", "universitas", tahunAnggaran] });
   }

   const paguUniversitas = dataArrayPaguUniversitas?.results || {};

   return { paguUniversitas, isLoadingPaguUniversitas };
}

export function useInitPaguBiro() {
   const { tahunAnggaran } = useTahunAnggaran();

   const { data, isLoading, error } = useApiQuery<{
      results: Lists;
      status: boolean;
   }>({
      queryKey: ["pagu-anggaran", "biro", tahunAnggaran],
      url: `/pagu-anggaran/${tahunAnggaran}/biro`,
      options: { enabled: !!tahunAnggaran },
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["pagu-anggaran", "biro", tahunAnggaran] });
   }

   const paguBiro = Array.isArray(data?.results) ? data?.results : [];

   return { paguBiro, isLoading, error };
}

export function useInitPaguFakultas(paguBiro: Array<Lists>) {
   const { tahunAnggaran } = useTahunAnggaran();

   const { data, isLoading, error } = useApiQuery<{
      results: Lists;
      status: boolean;
   }>({
      queryKey: ["pagu-anggaran", "fakultas", tahunAnggaran],
      url: `/pagu-anggaran/${tahunAnggaran}/fakultas`,
      options: { enabled: !!tahunAnggaran && paguBiro.length > 0 },
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["pagu-anggaran", "fakultas", tahunAnggaran] });
   }

   const paguFakultas = Array.isArray(data?.results) ? data?.results : [];

   return { paguFakultas, isLoading, error };
}
