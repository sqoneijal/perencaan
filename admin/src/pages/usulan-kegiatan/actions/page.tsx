import { FormDatePicker, FormText, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, formatRupiah, getValue } from "@/helpers/init";
import { useCariUnitPegawai } from "@/helpers/simpeg";
import { UseAuth } from "@/hooks/auth-context";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { queryClient } from "@/lib/queryClient";
import { usePostMutation } from "@/lib/useApi";
import type { ApiResponse, Lists } from "@/types/init";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type UsulanKegiatanResponse = ApiResponse<{ errors: Lists }> & { id_usulan_kegiatan?: number };

export default function Page() {
   const { setButton } = useHeaderButton();
   const { pagination } = useTablePagination();
   const { user } = UseAuth();

   const navigate = useNavigate();

   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState<Lists>({});

   const submit = usePostMutation<{ errors: Lists }>("/usulan-kegiatan/actions");

   const { data: pegawaiData, isLoading } = useCariUnitPegawai(user?.preferred_username);

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

      submit.mutate(
         {
            ...formData,
            rencanca_total_anggaran: formData.rencanca_total_anggaran?.toString().replace(/\./g, "") || "",
            id_unit_pengusul: pegawaiData?.bagian?.id,
         },
         {
            onSuccess: (data) => {
               setErrors(data?.errors ?? {});
               if (data?.status) {
                  queryClient.refetchQueries({
                     queryKey: ["usulan-kegiatan", pagination.pageSize, pagination.pageIndex * pagination.pageSize],
                  });
                  toast.success(data?.message);
                  const response = data as UsulanKegiatanResponse;
                  navigate(`/usulan-kegiatan/${response.id_usulan_kegiatan}`);
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
                        onChange={(value) => setFormData((prev) => ({ ...prev, waktu_mulai: moment(value).format("YYYY-MM-DD") || null }))}
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-3">
                     <FormDatePicker
                        label="Tanggal Selesai"
                        name="waktu_selesai"
                        value={getValue(formData, "waktu_selesai")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, waktu_selesai: moment(value).format("YYYY-MM-DD") || null }))}
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
                        label="Unit Pengusul"
                        name="id_unit_pengusul"
                        value={isLoading ? "Loading..." : pegawaiData?.bagian?.nama}
                        errors={errors}
                        disabled={true}
                     />
                  </div>
                  <div className="col-12 col-md-4 mb-3 sm:mb-0">
                     <FormText
                        label="Rencana Total Anggaran"
                        name="rencanca_total_anggaran"
                        value={getValue(formData, "rencanca_total_anggaran")}
                        onChange={(value) => {
                           const formatted = formatRupiah(value);
                           setFormData((prev) => ({ ...prev, rencanca_total_anggaran: formatted }));
                        }}
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
