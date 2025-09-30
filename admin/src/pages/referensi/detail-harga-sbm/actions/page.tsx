import { FormCommand, FormDatePicker, FormSelect, FormText } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, formatRupiah, getValue } from "@/helpers/init";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

function findIDUnitSatuan(arr: Array<Lists>, id: string) {
   const item = arr.find((row) => row.id === id);
   return item ? item.id_unit_satuan : null;
}

const getTahunAnggaranOptions = () => {
   const currentYear = new Date().getFullYear();
   const options = [];
   for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      options.push({ value: year.toString(), label: year.toString() });
   }
   return options;
};

const getStatusValidasiOptions = () => {
   return [
      { value: "draft", label: "Draft" },
      { value: "valid", label: "Valid" },
      { value: "kadaluarsa", label: "Kadaluarsa" },
   ];
};

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

export default function Page() {
   const {
      formData,
      setFormData,
      errors,
      setCariStandarBiaya,
      standarBiaya,
      isLoadingStandarBiaya,
      isLoading,
      submit,
      handleSubmit,
      options,
      id_detail_harga,
   } = useDetailHargaForm();

   if (id_detail_harga && isLoading)
      return (
         <div className="min-h-screen flex items-center justify-center from-slate-50 to-slate-100">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
               <p className="text-gray-600 font-medium">Memuat data...</p>
            </div>
         </div>
      );

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormCommand
                     label="Standar Biaya"
                     value={getValue(formData, "id_sbm")}
                     onChange={(value) =>
                        setFormData((prev) => ({
                           ...prev,
                           id_sbm: value,
                           id_satuan: findIDUnitSatuan(Array.isArray(standarBiaya) ? standarBiaya : [], value),
                        }))
                     }
                     name="id_sbm"
                     errors={errors}
                     onSearch={(value) => setCariStandarBiaya(value)}
                     isLoading={isLoadingStandarBiaya}
                     options={options}
                     disabled={!!getValue(formData, "id")}
                  />
                  <FormSelect
                     label="Tahun Anggaran"
                     value={getValue(formData, "tahun_anggaran")}
                     onValueChange={(value) => setFormData((prev) => ({ ...prev, tahun_anggaran: value }))}
                     name="tahun_anggaran"
                     errors={errors}
                     options={getTahunAnggaranOptions()}
                     disabled={!!getValue(formData, "tahun_anggaran")}
                  />
                  <FormText
                     label="Harga Satuan"
                     value={formatRupiah(getValue(formData, "harga_satuan"))}
                     onChange={({ target: { value } }) => {
                        const formatted = formatRupiah(value);
                        setFormData((prev) => ({ ...prev, harga_satuan: formatted }));
                     }}
                     name="harga_satuan"
                     errors={errors}
                  />
                  <FormDatePicker
                     label="Tanggal Mulai Efektif"
                     name="tanggal_mulai_efektif"
                     errors={errors}
                     onChange={(value) => setFormData((prev) => ({ ...prev, tanggal_mulai_efektif: moment(value).format("YYYY-MM-DD") }))}
                     value={getValue(formData, "tanggal_mulai_efektif")}
                  />
                  <FormDatePicker
                     label="Tanggal Akhir Efektif"
                     name="tanggal_akhir_efektif"
                     errors={errors}
                     onChange={(value) => setFormData((prev) => ({ ...prev, tanggal_akhir_efektif: moment(value).format("YYYY-MM-DD") }))}
                     value={getValue(formData, "tanggal_akhir_efektif")}
                  />
                  <FormSelect
                     label="Status Validasi"
                     value={getValue(formData, "status_validasi")}
                     onValueChange={(value) => setFormData((prev) => ({ ...prev, status_validasi: value }))}
                     name="status_validasi"
                     errors={errors}
                     options={getStatusValidasiOptions()}
                  />
               </div>
               <Button type="submit" size="sm" disabled={submit.isPending}>
                  {submit.isPending ? btn_loading() : "Simpan"}
               </Button>
            </form>
         </div>
      </div>
   );
}
