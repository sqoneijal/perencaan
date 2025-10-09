import { FormSelect, FormText } from "@/components/forms";
import { LoadingSkeletonEditContent } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { btn_loading, getValue } from "@/helpers/init";
import { useEffect } from "react";
import { useButton, useEditData, useOptions, useSubmit } from "./init";

export default function Page() {
   const { formData, setFormData, errors, handleSubmit, submit } = useSubmit();
   const { dataEdit, isLoading } = useEditData();
   const { daftarBiro, isLoading: isLoadingBiro } = useOptions();

   useButton();

   useEffect(() => {
      if (!isLoading && Object.keys(dataEdit).length > 0) {
         setFormData(dataEdit);
      }
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dataEdit, isLoading]);

   if (isLoading || isLoadingBiro) return <LoadingSkeletonEditContent />;

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="row">
                  <div className="col-12 col-md-6">
                     <FormSelect
                        label="Biro"
                        options={daftarBiro.map((row) => ({ value: row.id, label: row.nama }))}
                        value={getValue(formData, "id_biro")}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, id_biro: value }))}
                        name="id_biro"
                        errors={errors}
                     />
                  </div>
                  <div className="col-12 col-md-6">
                     <FormText
                        label="Nama Fakultas"
                        value={getValue(formData, "nama")}
                        onChange={(value) => setFormData((prev) => ({ ...prev, nama: value }))}
                        name="nama"
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
