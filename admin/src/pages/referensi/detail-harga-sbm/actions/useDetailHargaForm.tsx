import { Button } from "@/components/ui/button";
import { getValue } from "@/helpers/init";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

function useDetailHargaForm() {
   const { setButton } = useHeaderButton();
   const { id_detail_harga } = useParams();
   const { pagination } = useTablePagination();
   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});
   const [cariStandarBiaya, setCariStandarBiaya] = useState("");

   const { data: standarBiaya, isLoading: isLoadingStandarBiaya } = useApiQuery({
      queryKey: ["referensi", "detail-harga-sbm", "actions", cariStandarBiaya],
      url: "/referensi/detail-harga-sbm/actions/cari-standar-biaya",
      params: { search: cariStandarBiaya },
      options: { enabled: cariStandarBiaya.length > 0 },
   });

   const { data, isLoading, error } = useApiQuery<Lists>({
      queryKey: ["referensi", "detail-harga-sbm", "actions", id_detail_harga || "new"],
      url: id_detail_harga ? `/referensi/detail-harga-sbm/actions/${id_detail_harga}` : "",
      options: { enabled: !!id_detail_harga },
   });

   const submit = usePostMutation<{ errors: Record<string, string> }>("/referensi/detail-harga-sbm/actions");

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/referensi/detail-harga-sbm")}>
            Batal
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   useEffect(() => {
      if (id_detail_harga && data?.data) {
         if (data?.status) {
            setFormData((prev) => (Object.keys(prev).length === 0 ? data.data! : prev));
         } else {
            toast.error("Data tidak ditemukan.");
            navigate("/referensi/detail-harga-sbm");
         }
      }
   }, [data, id_detail_harga, navigate]);

   useEffect(() => {
      if (error) {
         toast.error(error.message);
      }
   }, [error]);

   const limit = pagination?.pageSize;
   const offset = pagination?.pageIndex * pagination.pageSize;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const cleanedFormData = {
         ...formData,
         harga_satuan: formData.harga_satuan?.toString().replace(/\./g, "") || "",
      };

      submit.mutate(cleanedFormData, {
         onSuccess: (data) => {
            setErrors(data?.errors ?? {});
            if (data?.status) {
               queryClient.refetchQueries({ queryKey: ["referensi", "detail-harga-sbm", limit, offset] });
               toast.success(data?.message);
               navigate("/referensi/detail-harga-sbm");
               return;
            }

            toast.error(data?.message);
         },
         onError: (error: Error) => {
            toast.error(error.message);
         },
      });
   };

   const fallbackOptions = useMemo(() => {
      return getValue(formData, "id")
         ? [{ value: getValue(formData, "id_sbm"), label: `${getValue(formData, "kode_sbm")} - ${getValue(formData, "nama_sbm")}` }]
         : [];
   }, [formData]);

   const options = useMemo(() => {
      return Array.isArray(standarBiaya) ? standarBiaya?.map((row) => ({ value: row.id, label: `${row.kode} - ${row.nama}` })) : fallbackOptions;
   }, [standarBiaya, fallbackOptions]);

   return {
      formData,
      setFormData,
      errors,
      setErrors,
      setCariStandarBiaya,
      standarBiaya,
      isLoadingStandarBiaya,
      data,
      isLoading,
      error,
      submit,
      handleSubmit,
      options,
      id_detail_harga,
   };
}

export { useDetailHargaForm };
