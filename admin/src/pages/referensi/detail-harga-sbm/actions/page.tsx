import { FormCommand, FormDatePicker, FormSelect, FormText } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, formatRupiah, getValue, getYearOptions } from "@/helpers/init";
import moment from "moment";
import { useDetailHargaForm } from "./useDetailHargaForm";
import { findIDUnitSatuan, getStatusValidasiOptions } from "./utils";

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
               <div className="row">
                  <div className="col-12 col-md-4">
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
                  </div>
                  <div className="col-12 col-md-2">
                     <FormSelect
                        label="Tahun Anggaran"
                        value={getValue(formData, "tahun_anggaran")}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, tahun_anggaran: value }))}
                        name="tahun_anggaran"
                        errors={errors}
                        options={getYearOptions()}
                        disabled={!!getValue(formData, "id")}
                     />
                  </div>
                  <div className="col-12 col-md-2">
                     <FormText
                        label="Harga Satuan"
                        value={formatRupiah(getValue(formData, "harga_satuan"))}
                        onChange={(value) => {
                           const formatted = formatRupiah(value);
                           setFormData((prev) => ({ ...prev, harga_satuan: formatted }));
                        }}
                        name="harga_satuan"
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-2">
                     <FormDatePicker
                        label="Tanggal Mulai Efektif"
                        name="tanggal_mulai_efektif"
                        errors={errors}
                        onChange={(value) => setFormData((prev) => ({ ...prev, tanggal_mulai_efektif: moment(value).format("YYYY-MM-DD") }))}
                        value={getValue(formData, "tanggal_mulai_efektif")}
                     />
                  </div>
                  <div className="col-12 col-md-2">
                     <FormDatePicker
                        label="Tanggal Akhir Efektif"
                        name="tanggal_akhir_efektif"
                        errors={errors}
                        onChange={(value) => setFormData((prev) => ({ ...prev, tanggal_akhir_efektif: moment(value).format("YYYY-MM-DD") }))}
                        value={getValue(formData, "tanggal_akhir_efektif")}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="col-12 col-md-2">
                     <FormSelect
                        label="Status Validasi"
                        value={getValue(formData, "status_validasi")}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, status_validasi: value }))}
                        name="status_validasi"
                        errors={errors}
                        options={getStatusValidasiOptions()}
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
