import { getValue } from "@/helpers/init";
import { useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function useStandarBiayaForm() {
   const { id_standar_biaya } = useParams();
   const { pagination } = useTablePagination();

   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});
   const [cariKategoriSBM, setCariKategoriSBM] = useState("");
   const [cariUnitSatuan, setCariUnitSatuan] = useState("");

   const { data, isLoading, error } = useApiQuery<Lists>({
      queryKey: ["referensi", "standar-biaya", "actions", id_standar_biaya || "new"],
      url: id_standar_biaya ? `/referensi/standar-biaya/actions/${id_standar_biaya}` : "",
      options: { enabled: !!id_standar_biaya },
   });

   const { data: kategoriSBM, isLoading: isLoadingKategoriSBM } = useApiQuery({
      queryKey: ["referensi", "standar-biaya", "actions", cariKategoriSBM],
      url: "/referensi/standar-biaya/actions/cari-kategori-sbm",
      params: { search: cariKategoriSBM },
      options: { enabled: !!cariKategoriSBM },
   });

   const { data: unitSatuan, isLoading: isLoadingUnitSatuan } = useApiQuery({
      queryKey: ["referensi", "standar-biaya", "actions", cariUnitSatuan],
      url: "/referensi/standar-biaya/actions/cari-unit-satuan",
      params: { search: cariUnitSatuan },
      options: { enabled: !!cariUnitSatuan },
   });

   const submit = usePostMutation<{ errors: Record<string, string> }>("/referensi/standar-biaya/actions");

   useEffect(() => {
      if (id_standar_biaya && data?.data) {
         if (data?.status) {
            setFormData((prev) => (Object.keys(prev).length === 0 ? data.data! : prev));
         } else {
            toast.error("Data tidak ditemukan.");
            navigate("/referensi/standar-biaya");
         }
      }
   }, [data, id_standar_biaya, navigate]);

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
                  queryClient.refetchQueries({ queryKey: ["referensi", "standar-biaya", limit, offset] });
                  toast.success(data?.message);
                  navigate("/referensi/standar-biaya");
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

   const fallbackKategoriOption = getValue(formData, "id")
      ? [
           {
              value: getValue(formData, "id_kategori"),
              label: `${getValue(formData, "kode_kategori")} - ${getValue(formData, "nama_kategori")}`,
           },
        ]
      : [];

   const kategoriOptions = Array.isArray(kategoriSBM)
      ? kategoriSBM.map((row) => ({ value: row.id, label: `${row.kode} - ${row.nama}` }))
      : fallbackKategoriOption;

   const fallbackUnitSatuanOption = getValue(formData, "id")
      ? [{ value: getValue(formData, "id_unit_satuan"), label: getValue(formData, "unit_satuan") }]
      : [];

   const unitSatuanOptions = Array.isArray(unitSatuan) ? unitSatuan.map((row) => ({ value: row.id, label: row.nama })) : fallbackUnitSatuanOption;

   return {
      formData,
      setFormData,
      errors,
      setErrors,
      setCariKategoriSBM,
      setCariUnitSatuan,
      data,
      isLoading,
      error,
      kategoriSBM,
      isLoadingKategoriSBM,
      unitSatuan,
      isLoadingUnitSatuan,
      submit,
      handleSubmit,
      kategoriOptions,
      unitSatuanOptions,
      id_standar_biaya,
   };
}
