import { FormCommand, FormText, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, getValue } from "@/helpers/init";
import { useHeaderButton } from "@/hooks/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useStandarBiayaForm } from "./useStandarBiayaForm";

export default function Page() {
   const { setButton } = useHeaderButton();
   const navigate = useNavigate();

   const {
      formData,
      setFormData,
      errors,
      setCariKategoriSBM,
      setCariUnitSatuan,
      isLoading,
      error,
      isLoadingKategoriSBM,
      isLoadingUnitSatuan,
      submit,
      handleSubmit,
      kategoriOptions,
      unitSatuanOptions,
      id_standar_biaya,
   } = useStandarBiayaForm();

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
                     onChange={(value) => setFormData((prev) => ({ ...prev, kode: value }))}
                     name="kode"
                     errors={errors}
                  />
                  <FormText
                     label="Nama Biaya"
                     value={getValue(formData, "nama")}
                     onChange={(value) => setFormData((prev) => ({ ...prev, nama: value }))}
                     name="nama"
                     errors={errors}
                  />
                  <FormCommand
                     name="id_kategori"
                     label="Kategori SBM"
                     onSearch={(value) => setCariKategoriSBM(value)}
                     isLoading={isLoadingKategoriSBM}
                     options={kategoriOptions}
                     errors={errors}
                     onChange={(value) => setFormData((prev) => ({ ...prev, id_kategori: value }))}
                     value={getValue(formData, "id_kategori")}
                  />
                  <FormCommand
                     name="id_unit_satuan"
                     label="Unit Satuan"
                     onSearch={(value) => setCariUnitSatuan(value)}
                     isLoading={isLoadingUnitSatuan}
                     options={unitSatuanOptions}
                     errors={errors}
                     onChange={(value) => setFormData((prev) => ({ ...prev, id_unit_satuan: value }))}
                     value={getValue(formData, "id_unit_satuan")}
                  />
                  <div className="md:col-span-2">
                     <FormTextarea
                        label="Deskripsi"
                        value={getValue(formData, "deskripsi")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, deskripsi: value }))}
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
