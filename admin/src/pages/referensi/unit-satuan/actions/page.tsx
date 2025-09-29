import { FormSelect, FormText, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { getValue } from "@/helpers/init";
import type { Lists } from "@/types/init";
import { useState } from "react";

export default function Page() {
   const [formData, setFormData] = useState<Lists>({});
   const [errors, setErrors] = useState({
      nama: "",
      deskripsi: "",
   });

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof typeof errors]) {
         setErrors((prev) => ({ ...prev, [name]: "" }));
      }
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors = { nama: "", deskripsi: "" };
      if (!formData?.nama?.trim()) newErrors.nama = "Nama wajib diisi";
      if (!formData?.deskripsi?.trim()) newErrors.deskripsi = "Deskripsi wajib diisi";
      setErrors(newErrors);
      if (!newErrors.nama && !newErrors.deskripsi) {
         // Submit logic here
         console.log("Form submitted", formData);
      }
   };

   return (
      <div className="p-0">
         <div className="border rounded-lg p-6 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                  <div className="flex-1">
                     <FormText label="Nama Unit Satuan" value={getValue(formData, "nama")} onChange={handleInputChange} name="nama" errors={errors} />
                  </div>
                  <div className="w-full md:w-[300px]">
                     <FormSelect
                        name="status"
                        label="Status"
                        options={[
                           { value: "t", label: "Aktif" },
                           { value: "f", label: "Nonaktif" },
                        ]}
                        value={getValue(formData, "status")}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                        errors={errors}
                     />
                  </div>
               </div>
               <div>
                  <FormTextarea
                     label="Deskripsi"
                     value={getValue(formData, "deskripsi")}
                     onChange={handleInputChange}
                     name="deskripsi"
                     errors={errors}
                  />
               </div>
               <Button type="submit" size="sm">
                  Simpan
               </Button>
            </form>
         </div>
      </div>
   );
}
