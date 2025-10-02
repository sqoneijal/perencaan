import { FormText, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, formatRupiah, getValue } from "@/helpers/init";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function Page() {
   const { id_usulan_kegiatan } = useParams();
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();

   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   const limit = pagination.pageSize;
   const offset = pagination.pageIndex * pagination.pageSize;

   const submit = usePostMutation<{ errors: Lists }>(`/usulan-kegiatan/${id_usulan_kegiatan}/rab/actions`);

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate(`/usulan-kegiatan/${id_usulan_kegiatan}#rab`)}>
            Batal
         </Button>
      );

      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate, id_usulan_kegiatan]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      submit.mutate(
         { formData },
         {
            onSuccess: (data) => {
               setErrors(data?.errors ?? {});
               if (data?.status) {
                  queryClient.refetchQueries({
                     queryKey: ["usulan-kegiatan", id_usulan_kegiatan, "rab", limit, offset],
                  });
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
                        label="ID Usulan"
                        name="id_usulan"
                        value={getValue(formData, "id_usulan")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, id_usulan: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-2 mb-3 sm:mb-0">
                     <FormText
                        label="Qty"
                        name="qty"
                        value={getValue(formData, "qty")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, qty: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-2 mb-3 sm:mb-0">
                     <FormText
                        label="ID Satuan"
                        name="id_satuan"
                        value={getValue(formData, "id_satuan")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, id_satuan: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-2 mb-3 sm:mb-0">
                     <FormText
                        label="Harga Satuan"
                        name="harga_satuan"
                        value={getValue(formData, "harga_satuan")}
                        onChange={(value) => {
                           const formatted = formatRupiah(value);
                           setFormData((prev) => ({ ...prev, harga_satuan: formatted }));
                        }}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-2 mb-3 sm:mb-0">
                     <FormText
                        label="Total Biaya"
                        name="total_biaya"
                        value={getValue(formData, "total_biaya")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, total_biaya: value }))}
                        errors={errors}
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
