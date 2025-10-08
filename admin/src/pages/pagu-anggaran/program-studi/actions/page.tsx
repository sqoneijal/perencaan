import { FormSelect, FormText } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { btn_loading, formatRupiah, getValue, getYearOptions } from "@/helpers/init";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { useActions } from "./init";
import { useOptions } from "./options";

export default function Page() {
   const { handleSubmit, formData, setFormData, errors, submit } = useActions();
   const { daftarFakultas, isLoadingDaftarFakultas, errorDaftarFakultas, dataDaftarProdi, isLoadingDaftarProdi, errorDaftarProdi } = useOptions();

   if (isLoadingDaftarFakultas || isLoadingDaftarProdi)
      return (
         <div className="min-h-screen flex items-center justify-center from-slate-50 to-slate-100">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
               <p className="text-gray-600 font-medium">Memuat data...</p>
            </div>
         </div>
      );

   if (errorDaftarFakultas || errorDaftarProdi) {
      toast.error(errorDaftarFakultas?.message || errorDaftarProdi?.message);
      queryClient.removeQueries({ queryKey: ["options", "fakultas"] });
      queryClient.removeQueries({ queryKey: ["options", "program-studi"] });
   }

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="row">
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
                     <FormSelect
                        label="Fakultas"
                        value={getValue(formData, "id_fakultas")}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, id_fakultas: value }))}
                        name="id_fakultas"
                        errors={errors}
                        options={daftarFakultas}
                        disabled={!!getValue(formData, "id")}
                     />
                  </div>
                  <div className="col-12 col-md-3">
                     <FormText
                        label="Sisa Pagu Fakultas"
                        value={getValue(formData, "sisa_pagu_fakultas")}
                        name="sisa_pagu_fakultas"
                        disabled={true}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="col-12 col-md-3">
                     <FormText
                        label="Jumlah Pagu"
                        value={getValue(formData, "pagu_unit")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, pagu_unit: formatRupiah(value) }))}
                        name="pagu_unit"
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-2">
                     <div className="flex items-center gap-3 mt-7">
                        <Checkbox
                           id="untuk_semua_prodi"
                           checked={getValue(formData, "untuk_semua_prodi") === "t"}
                           onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, untuk_semua_prodi: checked ? "t" : "f" }))}
                        />
                        <Label htmlFor="untuk_semua_prodi">Gunakan untuk semua prodi?</Label>
                     </div>
                  </div>
                  {getValue(formData, "untuk_semua_prodi") === "f" && (
                     <div className="col-12 col-md-3">
                        <FormSelect
                           label="Program Studi"
                           value={getValue(formData, "id_prodi")}
                           onValueChange={(value) => setFormData((prev) => ({ ...prev, id_prodi: value }))}
                           name="id_prodi"
                           errors={errors}
                           options={dataDaftarProdi.filter((e) => e.id_fakultas === getValue(formData, "id_fakultas"))}
                           disabled={!!getValue(formData, "id") || !getValue(formData, "id_fakultas")}
                        />
                     </div>
                  )}
               </div>
               <Button type="submit" size="sm" disabled={submit.isPending}>
                  {submit.isPending ? btn_loading() : "Simpan"}
               </Button>
            </form>
         </div>
      </div>
   );
}
