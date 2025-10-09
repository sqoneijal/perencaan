import { Button } from "@/components/ui/button";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function useOptions() {
   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["options", "fakultas"],
      url: "/options/fakultas",
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["options", "fakultas"] });
   }

   const daftarFakultas = Array.isArray(data?.data) ? data?.data : [];

   return { daftarFakultas, isLoading };
}

export function useSubmit() {
   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   const { pagination } = useTablePagination();

   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;

   const navigate = useNavigate();

   const submit = usePostMutation<{ errors: Record<string, string> }>("/unit-kerja/program-studi/actions");

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      submit.mutate(formData, {
         onSuccess: (data) => {
            setErrors(data?.errors ?? {});
            if (data?.status) {
               queryClient.refetchQueries({
                  queryKey: ["unit-kerja", "program-studi", limit, offset],
               });
               toast.success(data.message);
               navigate("/unit-kerja/program-studi");
               return;
            }
            toast.error(data?.message);
         },
         onError: (error: Error) => {
            toast.error(error.message);
            setErrors({ general: error.message });
         },
      });
   };

   return { formData, setFormData, errors, handleSubmit, submit };
}

export function useButton() {
   const navigate = useNavigate();

   const { setButton } = useHeaderButton();

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/unit-kerja/program-studi")}>
            Batal
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   return <></>;
}

export function useEditData() {
   const { id } = useParams();

   const { data, isLoading, error } = useApiQuery<{
      results: Lists;
   }>({
      queryKey: ["unit-kerja", "program-studi", "actions", id],
      url: `/unit-kerja/program-studi/actions/${id}`,
      options: { enabled: !!id },
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["unit-kerja", "program-studi", "actions", id] });
   }

   const dataEdit = data?.results ?? {};

   return { dataEdit, isLoading };
}
