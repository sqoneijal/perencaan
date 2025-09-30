import { FormSelect, FormText, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, getValue } from "@/helpers/init";
import { useHeaderButton } from "@/hooks/store";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUnitSatuanForm } from "./useForms";

export default function Page() {
   const { setButton } = useHeaderButton();

   const { id_unit_satuan, formData, setFormData, errors, isLoading, error, handleSubmit, submit, navigate } = useUnitSatuanForm();

   // Keep the header button effect
   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/referensi/unit-satuan")}>
            Batal
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   if (id_unit_satuan && isLoading)
      return (
         <div className="min-h-screen flex items-center justify-center from-slate-50 to-slate-100">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
               <p className="text-gray-600 font-medium">Memuat data...</p>
            </div>
         </div>
      );

   if (id_unit_satuan && error) {
      toast.error(error?.message);
      return null;
   }

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                  <div className="flex-1">
                     <FormText
                        label="Nama Unit Satuan"
                        value={getValue(formData, "nama")}
                        onChange={({ target: { value } }) => setFormData((prev) => ({ ...prev, nama: value }))}
                        name="nama"
                        errors={errors}
                     />
                  </div>
                  <div className="w-full md:w-[300px]">
                     <FormSelect
                        name="aktif"
                        label="Status"
                        options={[
                           { value: "t", label: "Aktif" },
                           { value: "f", label: "Nonaktif" },
                        ]}
                        value={getValue(formData, "aktif")}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, aktif: value }))}
                        errors={errors}
                     />
                  </div>
               </div>
               <div>
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
