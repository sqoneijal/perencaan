import { Button } from "@/components/ui/button";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function useInit() {
   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   const { pagination } = useTablePagination();

   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;

   const navigate = useNavigate();

   const submit = usePostMutation<{ errors: Record<string, string> }>("/unit-kerja/biro/actions");

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      submit.mutate(formData, {
         onSuccess: (data) => {
            setErrors(data?.errors ?? {});
            if (data?.status) {
               queryClient.refetchQueries({
                  queryKey: ["unit-kerja", "biro", limit, offset],
               });
               toast.success(data.message);
               navigate("/unit-kerja/biro");
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
         <Button variant="outline" size="sm" onClick={() => navigate("/unit-kerja/biro")}>
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
      queryKey: ["unit-kerja", "biro", "actions", id],
      url: `/unit-kerja/biro/actions/${id}`,
      options: { enabled: !!id },
   });

   if (error) {
      toast.error(error?.message);
      queryClient.removeQueries({ queryKey: ["unit-kerja", "biro", "actions", id] });
   }

   const dataEdit = data?.results ?? {};

   return { dataEdit, isLoading };
}
