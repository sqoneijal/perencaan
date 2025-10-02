import { getValue } from "@/helpers/init";
import { useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists, Option } from "@/types/init";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

export function useRabActions() {
   const { id_usulan_kegiatan } = useParams();
   const { pagination } = useTablePagination();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   // Convert id_usulan_kegiatan to number for consistent query keys
   const idUsulanKegiatanNum = id_usulan_kegiatan ? Number(id_usulan_kegiatan) : 0;

   const { data, isLoading, error } = useApiQuery<{ daftarUnitSatuan: Array<Option> }>({
      queryKey: ["usulan-kegiatan", idUsulanKegiatanNum, "rab", "actions"],
      url: `/usulan-kegiatan/${idUsulanKegiatanNum}/rab/actions`,
   });

   const limit = pagination.pageSize;
   const offset = pagination.pageIndex * pagination.pageSize;

   const submit = usePostMutation<{ errors: Lists }>(`/usulan-kegiatan/${idUsulanKegiatanNum}/rab/actions`);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      submit.mutate(
         {
            ...formData,
            harga_satuan: getValue(formData, "harga_satuan").toString().replace(/\./g, ""),
         },
         {
            onSuccess: (data) => {
               setErrors(data?.errors ?? {});
               if (data?.status) {
                  setFormData({});
                  queryClient.refetchQueries({ queryKey: ["usulan-kegiatan", idUsulanKegiatanNum, "rab", limit, offset] });
                  queryClient.refetchQueries({ queryKey: ["usulan-kegiatan", idUsulanKegiatanNum, "anggaran"] });
                  queryClient.refetchQueries({ queryKey: ["usulan-kegiatan", limit, offset] });
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

   return {
      idUsulanKegiatanNum,
      formData,
      setFormData,
      errors,
      setErrors,
      data,
      isLoading,
      error,
      limit,
      offset,
      submit,
      handleSubmit,
   };
}
