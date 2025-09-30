import { useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function useUnitSatuanForm() {
   const { id_unit_satuan } = useParams();
   const { pagination } = useTablePagination();
   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   const { data, isLoading, error } = useApiQuery<Lists>({
      queryKey: ["referensi", "unit-satuan", "actions", id_unit_satuan || "new"],
      url: id_unit_satuan ? `/referensi/unit-satuan/actions/${id_unit_satuan}` : "",
      options: { enabled: !!id_unit_satuan },
   });

   const submit = usePostMutation<{ errors: Record<string, string> }>("/referensi/unit-satuan/actions");

   useEffect(() => {
      if (id_unit_satuan && data?.data) {
         if (data?.status) {
            setFormData((prev) => (Object.keys(prev).length === 0 ? data.data! : prev));
         } else {
            toast.error("Data tidak ditemukan.");
            navigate("/referensi/unit-satuan");
         }
      }
   }, [data, id_unit_satuan, navigate]);

   const limit = pagination?.pageSize;
   const offset = pagination?.pageIndex * pagination.pageSize;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      submit.mutate(
         {
            ...formData,
         },
         {
            onSuccess: (data) => {
               setErrors(data?.errors ?? {});
               if (data?.status) {
                  queryClient.refetchQueries({ queryKey: ["referensi", "unit-satuan", limit, offset] });
                  toast.success(data?.message);
                  navigate("/referensi/unit-satuan");
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

   return {
      id_unit_satuan,
      formData,
      setFormData,
      errors,
      isLoading,
      error,
      handleSubmit,
      submit,
      navigate,
   };
}
