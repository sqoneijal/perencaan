import { FormSelect, FormText } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, formatRupiah, getValue, getYearOptions } from "@/helpers/init";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { useAction } from "./init";

export default function Page() {
   const { daftarFakultas, isLoading, error, errorEdit, isLoadingEdit, handleSubmit, submit, formData, setFormData, errors, id_pagu } = useAction();

   if (isLoading || isLoadingEdit) {
      return (
         <div className="min-h-screen flex items-center justify-center from-slate-50 to-slate-100">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
               <p className="text-gray-600 font-medium">Memuat data...</p>
            </div>
         </div>
      );
   }

   if (error || errorEdit) {
      toast.error(error?.message || errorEdit?.message);
      queryClient.removeQueries({ queryKey: ["options", "fakultas"] });
      queryClient.removeQueries({ queryKey: ["pagu-anggaran", "fakultas", "actions", id_pagu || "new"] });
   }

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="row">
                  <div className="col-12 col-md-3">
                     <FormSelect
                        label="Fakultas"
                        value={getValue(formData, "id_fakultas")}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, id_fakultas: value }))}
                        name="id_fakultas"
                        errors={errors}
                        options={daftarFakultas?.data || []}
                        disabled={!!getValue(formData, "id")}
                     />
                  </div>
                  <div className="col-12 col-md-2">
                     <FormSelect
                        label="Tahun"
                        value={getValue(formData, "tahun")}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, tahun: value }))}
                        name="tahun"
                        errors={errors}
                        options={getYearOptions()}
                        disabled={!!getValue(formData, "id")}
                     />
                  </div>
                  <div className="col-12 col-md-3">
                     <FormText
                        label="Jumlah Pagu"
                        value={getValue(formData, "pagu_unit")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, pagu_unit: formatRupiah(value) }))}
                        name="pagu_unit"
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
