import { FormSelect, FormText, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, formatRupiah, getValue, toNumber, toRupiah } from "@/helpers/init";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { useApiQuery, usePostMutation } from "@/lib/useApi";
import type { Lists, Option } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const loadingElement = (
   <div className="bg-gray-50 p-4 rounded-md">
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 min-h-[200px]">
         <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Memuat data...</p>
         </div>
      </div>
   </div>
);

export default function Page() {
   const { id_usulan_kegiatan } = useParams();
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();

   const navigate = useNavigate();

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

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate(`/usulan-kegiatan/${idUsulanKegiatanNum}#rab`)}>
            Batal
         </Button>
      );

      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate, idUsulanKegiatanNum]);

   if (isLoading) return loadingElement;

   if (error) return toast.error(error?.message);

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

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="row">
                  <div className="col-12 col-md-2 mb-3 sm:mb-0">
                     <FormText
                        type="number"
                        label="Qty"
                        name="qty"
                        value={getValue(formData, "qty")}
                        onChange={(value) =>
                           setFormData((prev) => ({
                              ...prev,
                              qty: value,
                              total_biaya: (toNumber(value) * toNumber(getValue(formData, "harga_satuan").toString().replace(/\./g, ""))).toString(),
                           }))
                        }
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-2 mb-3 sm:mb-0">
                     <FormSelect
                        label="Satuan"
                        name="id_satuan"
                        value={getValue(formData, "id_satuan")}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, id_satuan: value }))}
                        errors={errors}
                        options={(data?.data?.daftarUnitSatuan as Array<Lists>).map((item) => ({
                           value: item.id,
                           label: item.nama,
                           tooltip: item.deskripsi,
                        }))}
                     />
                  </div>
                  <div className="col-12 col-md-2 mb-3 sm:mb-0">
                     <FormText
                        label="Harga Satuan"
                        name="harga_satuan"
                        value={getValue(formData, "harga_satuan")}
                        onChange={(value) => {
                           const formatted = formatRupiah(value);
                           setFormData((prev) => ({
                              ...prev,
                              harga_satuan: formatted,
                              total_biaya: (toNumber(getValue(formData, "qty")) * toNumber(value.toString().replace(/\./g, ""))).toString(),
                           }));
                        }}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-2 mb-3 sm:mb-0">
                     <FormText
                        label="Total Biaya"
                        name="total_biaya"
                        value={toRupiah(getValue(formData, "total_biaya"))}
                        errors={errors}
                        disabled={true}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                     <FormTextarea
                        label="Uraian Biaya"
                        name="uraian_biaya"
                        value={getValue(formData, "uraian_biaya")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, uraian_biaya: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                     <FormTextarea
                        label="Catatan"
                        name="catatan"
                        value={getValue(formData, "catatan")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, catatan: value }))}
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
