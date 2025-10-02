import { FormText, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, getValue } from "@/helpers/init";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Page() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();

   const navigate = useNavigate();

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/master-iku")}>
            Batal
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   const submit = usePostMutation<{ errors: Lists }>("/master-iku/actions");

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
                  queryClient.refetchQueries({
                     queryKey: ["master-iku", pagination.pageSize, pagination.pageIndex * pagination.pageSize],
                  });
                  toast.success(data?.message);
                  navigate("/master-iku");
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
                  <div className="col-12 col-md-4 mb-3 sm:mb-0">
                     <FormText
                        label="Jenis"
                        name="jenis"
                        value={getValue(formData, "jenis")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, jenis: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-4 mb-3 sm:mb-0">
                     <FormText
                        label="Kode"
                        name="kode"
                        value={getValue(formData, "kode")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, kode: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-4">
                     <FormText
                        label="Tahun Berlaku"
                        name="tahun_berlaku"
                        value={getValue(formData, "tahun_berlaku")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, tahun_berlaku: value }))}
                        errors={errors}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="col-12">
                     <FormTextarea
                        label="Deskripsi"
                        name="deskripsi"
                        value={getValue(formData, "deskripsi")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, deskripsi: value }))}
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
