import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/helpers/init";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function useAction() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();
   const { id_pagu } = useParams();

   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/pagu-anggaran/fakultas")}>
            Batal
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   const submit = usePostMutation<{ errors: Record<string, string> }>("/pagu-anggaran/fakultas/actions");

   const limit = pagination?.pageSize;
   const offset = pagination?.pageIndex * pagination.pageSize;

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
               queryClient.refetchQueries({ queryKey: ["pagu-anggaran", "fakultas", limit, offset] });
               toast.success(data?.message);
               navigate("/pagu-anggaran/fakultas");
               return;
            }

            toast.error(data?.message);
         },
         onError: (error: Error) => {
            toast.error(error.message);
         },
      });
   };

   const {
      data: daftarFakultas,
      isLoading,
      error,
   } = useApiQuery<Array<Lists>>({
      queryKey: ["options", "fakultas"],
      url: "/options/fakultas",
   });

   const {
      data: dataEdit,
      isLoading: isLoadingEdit,
      error: errorEdit,
   } = useApiQuery<Lists>({
      queryKey: ["pagu-anggaran", "fakultas", "actions", id_pagu || "new"],
      url: `/pagu-anggaran/fakultas/actions/${id_pagu}`,
      options: { enabled: !!id_pagu },
   });

   useEffect(() => {
      if (!isLoadingEdit && dataEdit?.data) {
         setFormData({ ...dataEdit?.data, pagu_unit: dataEdit?.data?.pagu_unit ? formatRupiah(dataEdit?.data?.pagu_unit) : "" });
      }
      return () => {};
   }, [dataEdit, isLoadingEdit]);

   return { daftarFakultas, isLoading, error, errorEdit, isLoadingEdit, handleSubmit, submit, formData, setFormData, errors };
}
