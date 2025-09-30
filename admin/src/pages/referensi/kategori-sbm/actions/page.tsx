import { FormText, FormTextarea } from "@/components/forms";
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
   const { id_kategori_sbm } = useParams();
   const { pagination } = useTablePagination();

   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   const { data, isLoading, error } = useApiQuery<Lists>({
      queryKey: ["referensi", "kategori-sbm", "actions", id_kategori_sbm || "new"],
      url: id_kategori_sbm ? `/referensi/kategori-sbm/actions/${id_kategori_sbm}` : "",
      options: { enabled: !!id_kategori_sbm },
   });

   const submit = usePostMutation<{ errors: Record<string, string> }>("/referensi/kategori-sbm/actions");

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/referensi/kategori-sbm")}>
            Batal
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   useEffect(() => {
      if (id_kategori_sbm && data?.data) {
         if (data?.status) {
            setFormData((prev) => (Object.keys(prev).length === 0 ? data.data! : prev));
         } else {
            toast.error("Data tidak ditemukan.");
            navigate("/referensi/kategori-sbm");
         }
      }
   }, [data, id_kategori_sbm, navigate]);

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
                  queryClient.refetchQueries({ queryKey: ["referensi", "kategori-sbm", limit, offset] });
                  toast.success(data?.message);
                  navigate("/referensi/kategori-sbm");
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

   if (id_kategori_sbm && isLoading)
      return (
         <div className="min-h-screen flex items-center justify-center from-slate-50 to-slate-100">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
               <p className="text-gray-600 font-medium">Memuat data...</p>
            </div>
         </div>
      );

   if (id_kategori_sbm && error) return toast.error(error?.message);

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                  <div className="w-full md:w-[300px]">
                     <FormText
                        label="Kode Kategori SBM"
                        value={getValue(formData, "kode")}
                        onChange={({ target: { value } }) => setFormData((prev) => ({ ...prev, kode: value }))}
                        name="kode"
                        errors={errors}
                     />
                  </div>
                  <div className="flex-1">
                     <FormText
                        label="Nama Kategori SBM"
                        value={getValue(formData, "nama")}
                        onChange={({ target: { value } }) => setFormData((prev) => ({ ...prev, nama: value }))}
                        name="nama"
                        errors={errors}
                     />
                  </div>
               </div>
               <div className="w-full">
                  <FormTextarea
                     label="Deskripsi"
                     value={getValue(formData, "deskripsi")}
                     onChange={({ target: { value } }) => setFormData((prev) => ({ ...prev, deskripsi: value }))}
                     name="deskripsi"
                     errors={errors}
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
