import { cleanRupiah, getValue, toNumber } from "@/helpers/init";
import { useOptions, useTahunAnggaran } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePutMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useInit(
   paguBiro: Array<Lists>,
   paguFakultas: Array<Lists>,
   paguLembaga: Array<Lists>,
   paguUPT: Array<Lists>,
   paguProdi: Array<Lists>
) {
   const { setOptions } = useOptions();
   const { setTahunAnggaran, tahunAnggaran } = useTahunAnggaran();

   const [sisaPaguUniversitas, setSisaPaguUniversitas] = useState("");

   const { data, isLoading } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["pagu-anggaran", "tahun-anggaran"],
      url: "/pagu-anggaran/tahun-anggaran",
   });

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

   useEffect(() => {
      if (dataArrayPaguUniversitas?.results) {
         const paguUniversitas = dataArrayPaguUniversitas?.results || {};

         let biro = 0;
         paguBiro.forEach((row) => {
            biro += toNumber(row.total_pagu);
         });

         let fakultas = 0;
         paguFakultas.forEach((row) => {
            fakultas += toNumber(row.total_pagu);
         });

         let lembaga = 0;
         paguLembaga.forEach((row) => {
            lembaga += toNumber(row.total_pagu);
         });

         let upt = 0;
         paguUPT.forEach((row) => {
            upt += toNumber(row.total_pagu);
         });

         let prodi = 0;
         paguProdi.forEach((row) => {
            prodi += toNumber(row.total_pagu);
         });

         setSisaPaguUniversitas((toNumber(paguUniversitas.total_pagu) - (biro + fakultas + lembaga + upt + prodi)).toString());
      }
      return () => {};
   }, [paguBiro, dataArrayPaguUniversitas, paguFakultas, paguLembaga, paguUPT, paguProdi]);

   useEffect(() => {
      if (!isLoading && data?.results) {
         const dataArray = Array.isArray(data?.results) ? data?.results : [];
         setOptions({ daftarTahunAnggaran: dataArray });
         setTahunAnggaran(dataArray.find((e) => e.is_aktif === "t").tahun_anggaran);
      }
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isLoading, data, setOptions]);

   useEffect(() => {
      if (!isLoading && dataArrayPaguUniversitas?.results) {
         const paguUniversitas = dataArrayPaguUniversitas?.results || {};
         setSisaPaguUniversitas(paguUniversitas.total_pagu);
      }
      return () => {};
   }, [dataArrayPaguUniversitas, isLoading]);

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["pagu-anggaran", "universitas", tahunAnggaran] });
   }

   const paguUniversitas = dataArrayPaguUniversitas?.results || {};

   return { paguUniversitas, isLoadingPaguUniversitas, sisaPaguUniversitas };
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

export function useInitPaguProgramStudi(paguFakultas: Array<Lists>) {
   const { tahunAnggaran } = useTahunAnggaran();

   const { data, isLoading, error } = useApiQuery<{
      results: Lists;
      status: boolean;
   }>({
      queryKey: ["pagu-anggaran", "program-studi", tahunAnggaran],
      url: `/pagu-anggaran/${tahunAnggaran}/program-studi`,
      options: { enabled: !!tahunAnggaran && paguFakultas.length > 0 },
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["pagu-anggaran", "program-studi", tahunAnggaran] });
   }

   const paguProdi = Array.isArray(data?.results) ? data?.results : [];

   return { paguProdi, isLoading, error };
}

export function useInitPaguLembaga(paguBiro: Array<Lists>) {
   const { tahunAnggaran } = useTahunAnggaran();

   const { data, isLoading, error } = useApiQuery<{
      results: Lists;
      status: boolean;
   }>({
      queryKey: ["pagu-anggaran", "lembaga", tahunAnggaran],
      url: `/pagu-anggaran/${tahunAnggaran}/lembaga`,
      options: { enabled: !!tahunAnggaran && paguBiro.length > 0 },
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["pagu-anggaran", "lembaga", tahunAnggaran] });
   }

   const paguLembaga = Array.isArray(data?.results) ? data?.results : [];

   return { paguLembaga, isLoading, error };
}

export function useInitPaguUPT(paguBiro: Array<Lists>) {
   const { tahunAnggaran } = useTahunAnggaran();

   const { data, isLoading, error } = useApiQuery<{
      results: Lists;
      status: boolean;
   }>({
      queryKey: ["pagu-anggaran", "upt", tahunAnggaran],
      url: `/pagu-anggaran/${tahunAnggaran}/upt`,
      options: { enabled: !!tahunAnggaran && paguBiro.length > 0 },
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["pagu-anggaran", "upt", tahunAnggaran] });
   }

   const paguUPT = Array.isArray(data?.results) ? data?.results : [];

   return { paguUPT, isLoading, error };
}

export function usePaguUpdate() {
   const { tahunAnggaran } = useTahunAnggaran();

   const [editFormBiro, setEditFormBiro] = useState("");
   const [formData, setFormData] = useState({});

   const submit = usePutMutation<{ errors: Lists }>(`/pagu-anggaran/${tahunAnggaran}`);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      submit.mutate(
         {
            ...formData,
            total_pagu: cleanRupiah(getValue(formData, "total_pagu")),
         },
         {
            onSuccess: (data) => {
               if (data?.status) {
                  setEditFormBiro("");
                  setFormData({});

                  if (getValue(formData, "pagu") === "biro") {
                     queryClient.refetchQueries({ queryKey: ["pagu-anggaran", "biro", tahunAnggaran] });
                  } else if (getValue(formData, "pagu") === "lembaga") {
                     queryClient.refetchQueries({ queryKey: ["pagu-anggaran", "lembaga", tahunAnggaran] });
                  } else if (getValue(formData, "pagu") === "upt") {
                     queryClient.refetchQueries({ queryKey: ["pagu-anggaran", "upt", tahunAnggaran] });
                  } else if (getValue(formData, "pagu") === "fakultas") {
                     queryClient.refetchQueries({ queryKey: ["pagu-anggaran", "fakultas", tahunAnggaran] });
                  } else if (getValue(formData, "pagu") === "prodi") {
                     queryClient.refetchQueries({ queryKey: ["pagu-anggaran", "program-studi", tahunAnggaran] });
                  }
                  toast.success(data?.message);
                  return;
               }

               toast.error(data?.message);
            },
            onError: (error: Error) => {
               toast.error(error.message);
            },
         }
      );
   };

   return { editFormBiro, setEditFormBiro, formData, setFormData, handleSubmit };
}
