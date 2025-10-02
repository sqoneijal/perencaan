import { FormSelect, FormText, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { btn_loading, formatRupiah, getValue, toNumber, toRupiah } from "@/helpers/init";
import { useDialog, useHeaderButton } from "@/hooks/store";
import type { Lists } from "@/types/init";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import DialogHargaSBM from "./DialogHargaSBM";
import LoadingElement from "./LoadingElement";
import { useRabActions } from "./useRabActions";

export default function Page() {
   const { setButton } = useHeaderButton();
   const { setOpen } = useDialog();

   const navigate = useNavigate();

   const { idUsulanKegiatanNum, formData, setFormData, errors, data, isLoading, error, submit, handleSubmit } = useRabActions();

   const handleRowClick = (row: Lists) => {
      setFormData((prev) => ({
         ...prev,
         total_biaya: (1 * toNumber(getValue(row, "harga_satuan").toString().replace(/\./g, ""))).toString(),
         harga_satuan: formatRupiah(getValue(row, "harga_satuan")),
         id_satuan: getValue(row, "id_satuan"),
      }));
      setOpen(false);
   };

   useEffect(() => {
      setButton(
         <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
               Referensi Harga SBM
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate(`/usulan-kegiatan/${idUsulanKegiatanNum}#rab`)}>
               Batal
            </Button>
         </>
      );

      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate, idUsulanKegiatanNum, setOpen]);

   if (isLoading) return <LoadingElement />;

   if (error) return toast.error(error?.message);

   return (
      <>
         <DialogHargaSBM onRowClick={handleRowClick} />
         <div className="p-0">
            <div className="border rounded-lg p-6 shadow-sm bg-white">
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="row">
                     <div className="col-12 col-md-2 mb-3 sm:mb-0">
                        <FormText
                           type="number"
                           label="Qty"
                           name="qty"
                           value={getValue(formData, "qty")}
                           onChange={(value) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 qty: value,
                                 total_biaya: (
                                    toNumber(value) * toNumber(getValue(formData, "harga_satuan").toString().replace(/\./g, ""))
                                 ).toString(),
                              }))
                           }
                           errors={errors}
                        />
                     </div>
                     <div className="col-12 col-md-2 mb-3 sm:mb-0">
                        <FormSelect
                           label="Satuan"
                           name="id_satuan"
                           value={getValue(formData, "id_satuan")}
                           onValueChange={(value) => setFormData((prev) => ({ ...prev, id_satuan: value }))}
                           errors={errors}
                           options={(data?.data?.daftarUnitSatuan as Array<Lists>).map((item) => ({
                              value: item.id,
                              label: item.nama,
                              tooltip: item.deskripsi,
                           }))}
                        />
                     </div>
                     <div className="col-12 col-md-2 mb-3 sm:mb-0">
                        <FormText
                           label="Harga Satuan"
                           name="harga_satuan"
                           value={getValue(formData, "harga_satuan")}
                           onChange={(value) => {
                              const formatted = formatRupiah(value);
                              setFormData((prev) => ({
                                 ...prev,
                                 harga_satuan: formatted,
                                 total_biaya: (toNumber(getValue(formData, "qty")) * toNumber(value.toString().replace(/\./g, ""))).toString(),
                              }));
                           }}
                           errors={errors}
                        />
                     </div>
                     <div className="col-12 col-md-2 mb-3 sm:mb-0">
                        <FormText
                           label="Total Biaya"
                           name="total_biaya"
                           value={toRupiah(getValue(formData, "total_biaya"))}
                           errors={errors}
                           disabled={true}
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
      </>
   );
}
