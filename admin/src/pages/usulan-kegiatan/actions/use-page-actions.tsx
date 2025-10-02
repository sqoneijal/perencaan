import { Button } from "@/components/ui/button";
import { useCariUnitPegawai } from "@/helpers/simpeg";
import { UseAuth } from "@/hooks/auth-context";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { usePostMutation } from "@/lib/useApi";
import type { ApiResponse, Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type UsulanKegiatanResponse = ApiResponse<{ errors: Lists }> & { id_usulan_kegiatan?: number };

export function usePageActions() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();
   const { user } = UseAuth();

   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   const submit = usePostMutation<{ errors: Lists }>("/usulan-kegiatan/actions");

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
                  queryClient.refetchQueries({
                     queryKey: ["usulan-kegiatan", pagination.pageSize, pagination.pageIndex * pagination.pageSize],
                  });
                  toast.success(data?.message);
                  const response = data as UsulanKegiatanResponse;
                  navigate(`/usulan-kegiatan/${response.id_usulan_kegiatan}#informasi-dasar`);
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

   return { formData, setFormData, errors, setErrors, handleSubmit, pegawaiData, isLoading, submit };
}
