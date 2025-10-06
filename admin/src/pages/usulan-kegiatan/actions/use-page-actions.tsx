import { Button } from "@/components/ui/button";
import { useCariUnitPegawai } from "@/helpers/simpeg";
import { UseAuth } from "@/hooks/auth-context";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function usePageActions() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();
   const { user } = UseAuth();
   const { id_usulan_kegiatan } = useParams();

   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   interface SubmitResponse {
      status: boolean;
      message: string;
      errors?: Lists;
      id_usulan_kegiatan?: string | number;
   }

   const submit = usePostMutation<SubmitResponse>("/usulan-kegiatan/actions");

   const { data: pegawaiData, isLoading } = useCariUnitPegawai(user?.preferred_username);

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/usulan-kegiatan")}>
            Batal
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      submit.mutate(
         {
            ...formData,
            rencanca_total_anggaran: formData.rencanca_total_anggaran?.toString().replace(/\./g, "") || "",
            id_unit_pengusul: pegawaiData?.bagian?.id,
         },
         {
            onSuccess: (data) => {
               setErrors(data?.errors ?? {});
               if (data?.status) {
                  toast.success(data?.message);

                  queryClient.refetchQueries({
                     queryKey: ["usulan-kegiatan", pagination.pageSize, pagination.pageIndex * pagination.pageSize],
                  });

                  if (id_usulan_kegiatan) {
                     queryClient.refetchQueries({ queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "informasi-dasar"] });
                     queryClient.refetchQueries({ queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "anggaran"] });
                     queryClient.refetchQueries({ queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "latar-belakang"] });

                     navigate("/usulan-kegiatan");
                  } else {
                     // @ts-expect-error API returns flat response
                     navigate(`/usulan-kegiatan/${data.id_usulan_kegiatan}#informasi-dasar`);
                  }
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

   const { data, isLoading: isLoadingEdit } = useApiQuery<Lists>({
      queryKey: ["usulan-kegiatan", "actions", id_usulan_kegiatan],
      url: `/usulan-kegiatan/actions/${id_usulan_kegiatan}`,
      options: { enabled: !!id_usulan_kegiatan },
   });

   useEffect(() => {
      if (!isLoadingEdit && data?.data && id_usulan_kegiatan) {
         setFormData(data?.data);
      }
      return () => {};
   }, [isLoadingEdit, data, id_usulan_kegiatan]);

   return { formData, setFormData, errors, setErrors, handleSubmit, pegawaiData, isLoading, submit, isLoadingEdit };
}
