import { formatRupiah, getValue, toNumber, toRupiah } from "@/helpers/init";
import { useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useActions() {
   const { pagination } = useTablePagination();

   const [formData, setFormData] = useState<Lists>({
      untuk_semua_prodi: "t",
   });
   const [errors, setErrors] = useState<Lists>({});

   const limit = pagination?.pageSize;
   const offset = pagination?.pageIndex * pagination.pageSize;
   const navigate = useNavigate();

   const submit = usePostMutation<{ errors: Record<string, string> }>("/pagu-anggaran/program-studi/actions");

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const cleanedFormData = {
         ...formData,
         pagu_unit: formData.pagu_unit?.toString().replace(/\./g, "") || "",
      };

      submit.mutate(cleanedFormData, {
         onSuccess: (data) => {
            setErrors(data?.errors ?? {});
            if (data?.status) {
               queryClient.refetchQueries({ queryKey: ["pagu-anggaran", "program-studi", limit, offset] });
               queryClient.removeQueries({ queryKey: ["pagu-anggaran", "fakultas"] });
               toast.success(data?.message);
               navigate("/pagu-anggaran/program-studi");
               return;
            }

            toast.error(data?.message);
         },
         onError: (error: Error) => {
            toast.error(error.message);
         },
      });
   };

   const { data: paguFakultas, isLoading: isLoadingPaguFakultas } = useApiQuery<Lists>({
      queryKey: ["pagu-anggaran", "program-studi", "actions", "sisa-pagu", getValue(formData, "id_fakultas"), getValue(formData, "tahun")],
      url: `/pagu-anggaran/program-studi/actions/sisa-pagu`,
      params: { id_fakultas: getValue(formData, "id_fakultas"), tahun: getValue(formData, "tahun") },
      options: { enabled: !!getValue(formData, "tahun") && !!getValue(formData, "id_fakultas") },
   });

   useEffect(() => {
      if (!isLoadingPaguFakultas && paguFakultas?.data) {
         const belum_ada_pagu = paguFakultas?.data?.daftarProdiBelumAdaPagu?.length ?? 0;
         const sisa_pagu = toNumber(paguFakultas?.data?.sisa) ?? 0;
         const pagu_unit = sisa_pagu > 0 ? (sisa_pagu / belum_ada_pagu).toFixed(0) : 0;

         setFormData((prev) => ({
            ...prev,
            pagu_fakultas: sisa_pagu.toString(),
            sisa_pagu_fakultas: `${toRupiah(sisa_pagu.toString())} / ${belum_ada_pagu} program studi`,
            pagu_unit: formatRupiah(pagu_unit.toString()),
         }));
      }
      return () => {};
   }, [paguFakultas, isLoadingPaguFakultas]);

   return { handleSubmit, formData, setFormData, errors, submit, paguFakultas };
}
