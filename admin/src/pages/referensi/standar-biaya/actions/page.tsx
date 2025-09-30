import { FormCommand, FormText, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, getValue } from "@/helpers/init";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function Page() {
   const { setButton } = useHeaderButton();
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
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/referensi/standar-biaya")}>
            Batal
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

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

   if (id_standar_biaya && isLoading)
      return (
         <div className="min-h-screen flex items-center justify-center from-slate-50 to-slate-100">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
               <p className="text-gray-600 font-medium">Memuat data...</p>
            </div>
         </div>
      );

   if (id_standar_biaya && error) return toast.error(error?.message);

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormText
                     label="Kode Biaya"
                     value={getValue(formData, "kode")}
                     onChange={({ target: { value } }) => setFormData((prev) => ({ ...prev, kode: value }))}
                     name="kode"
                     errors={errors}
                  />
                  <FormText
                     label="Nama Biaya"
                     value={getValue(formData, "nama")}
                     onChange={({ target: { value } }) => setFormData((prev) => ({ ...prev, nama: value }))}
                     name="nama"
                     errors={errors}
                  />
                  <FormCommand
                     name="id_kategori"
                     label="Kategori SBM"
                     onSearch={(value) => setCariKategoriSBM(value)}
                     isLoading={isLoadingKategoriSBM}
                     options={Array.isArray(kategoriSBM) ? kategoriSBM.map((row) => ({ value: row.id, label: `${row.kode} - ${row.nama}` })) : []}
                     errors={errors}
                     onChange={(value) => setFormData((prev) => ({ ...prev, id_kategori: value }))}
                     value={getValue(formData, "id_kategori")}
                  />
                  <FormCommand
                     name="id_unit_satuan"
                     label="Unit Satuan"
                     onSearch={(value) => setCariUnitSatuan(value)}
                     isLoading={isLoadingUnitSatuan}
                     options={Array.isArray(unitSatuan) ? unitSatuan.map((row) => ({ value: row.id, label: row.nama })) : []}
                     errors={errors}
                     onChange={(value) => setFormData((prev) => ({ ...prev, id_unit_satuan: value }))}
                     value={getValue(formData, "id_unit_satuan")}
                  />
                  <div className="md:col-span-2">
                     <FormTextarea
                        label="Deskripsi"
                        value={getValue(formData, "deskripsi")}
                        onChange={({ target: { value } }) => setFormData((prev) => ({ ...prev, deskripsi: value }))}
                        name="deskripsi"
                        errors={errors}
                     />
                  </div>
               </div>
               <Button type="submit" size="sm" disabled={submit.isPending}>
                  {submit.isPending ? btn_loading() : "Simpan"}
               </Button>
            </form>
         </div>
      </div>
   );
}
