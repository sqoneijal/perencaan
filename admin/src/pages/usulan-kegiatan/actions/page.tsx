import { Button } from "@/components/ui/button";
import { useHeaderButton } from "@/hooks/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { FormDatePicker, FormText, FormTextarea } from "@/components/forms";
import { btn_loading, getValue } from "@/helpers/init";
import { usePostMutation } from "@/lib/useApi";
import type { Lists } from "@/types/init";

export default function Page() {
   const { setButton } = useHeaderButton();
   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   const submit = usePostMutation<{ errors: Lists }>("/referensi/unit-satuan/actions");

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate("/usulan-kegiatan")}>
            Batal
         </Button>
      );
      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation example
      const newErrors: Record<string, string> = {};
      if (!formData.kode) newErrors.kode = "Kode is required";
      if (!formData.nama) newErrors.nama = "Nama is required";
      if (!formData.waktu_mulai) newErrors.waktu_mulai = "Waktu Mulai is required";
      if (!formData.waktu_selesai) newErrors.waktu_selesai = "Waktu Selesai is required";
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
         console.log("Form submitted:", formData);
         // Here you can handle the form submission, e.g., send to API
      }
   };

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="row">
                  <div className="col-12 col-md-3 mb-3 sm:mb-0">
                     <FormText
                        label="Kode"
                        name="kode"
                        value={getValue(formData, "kode")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, kode: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-3 mb-3 sm:mb-0">
                     <FormText
                        label="Nama"
                        name="nama"
                        value={getValue(formData, "nama")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, nama: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-3 mb-3 sm:mb-0">
                     <FormDatePicker
                        label="Tanggal Mulai"
                        name="waktu_mulai"
                        value={getValue(formData, "waktu_mulai")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, waktu_mulai: value?.toString() || null }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-3">
                     <FormDatePicker
                        label="Tanggal Selesai"
                        name="waktu_selesai"
                        value={getValue(formData, "waktu_selesai")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, waktu_selesai: value?.toString() || null }))}
                        errors={errors}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="col-12 col-md-4 mb-3 sm:mb-0">
                     <FormText
                        label="Tempat Pelaksanaan"
                        name="tempat_pelaksanaan"
                        value={getValue(formData, "tempat_pelaksanaan")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, tempat_pelaksanaan: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-4 mb-3 sm:mb-0">
                     <FormText
                        label="ID Unit Pengusul"
                        name="id_unit_pengusul"
                        value={getValue(formData, "id_unit_pengusul")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, id_unit_pengusul: value }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-4 mb-3 sm:mb-0">
                     <FormText
                        label="Rencana Total Anggaran"
                        name="rencanca_total_anggaran"
                        value={getValue(formData, "rencanca_total_anggaran")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, rencanca_total_anggaran: value }))}
                        errors={errors}
                     />
                  </div>
               </div>
               <div className="row">
                  <div className="col-12 col-md-4 mb-3 sm:mb-0">
                     <FormTextarea
                        label="Latar Belakang"
                        name="latar_belakang"
                        value={getValue(formData, "latar_belakang")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, latar_belakang: value }))}
                        errors={errors}
                        className="h-50"
                     />
                  </div>
                  <div className="col-12 col-md-4 mb-3 sm:mb-0">
                     <FormTextarea
                        label="Tujuan"
                        name="tujuan"
                        value={getValue(formData, "tujuan")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, tujuan: value }))}
                        errors={errors}
                        className="h-50"
                     />
                  </div>
                  <div className="col-12 col-md-4 mb-3 sm:mb-0">
                     <FormTextarea
                        label="Sasaran"
                        name="sasaran"
                        value={getValue(formData, "sasaran")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, sasaran: value }))}
                        errors={errors}
                        className="h-50"
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
