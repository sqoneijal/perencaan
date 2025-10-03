import { FormFile, FormText } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { btn_loading, getValue } from "@/helpers/init";
import { UseAuth } from "@/hooks/auth-context";
import { useDialog, useHeaderButton, useTablePagination } from "@/hooks/store";
import { post } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { Lists } from "@/types/init";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import LoadingElement from "./loading-element";

interface DokumenFormData {
   nama_dokumen?: string | null;
   file_dokumen?: FileList | null;
   [key: string]: string | FileList | null | undefined;
}

function ActionDialog() {
   const { open, setOpen } = useDialog();
   const { pagination } = useTablePagination();
   const { id_usulan_kegiatan } = useParams();

   const [formData, setFormData] = useState<DokumenFormData>({});
   const [errors, setErrors] = useState<Lists>({});
   const [isPending, setIsPending] = useState(false);

   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;
   const idUsulanKegiatanNum = id_usulan_kegiatan ? Number(id_usulan_kegiatan) : 0;

   const { user } = UseAuth();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsPending(true);

      try {
         const data = new FormData();
         Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof FileList) {
               if (value.length > 0) {
                  data.append(key, value[0]);
               }
            } else if (value !== undefined && value !== null) {
               data.append(key, value.toString());
            }
         });
         data.append("user_modified", user?.preferred_username || "");
         const res = await post(`/usulan-kegiatan/${idUsulanKegiatanNum}/dokumen/actions`, data);
         const responseData = JSON.parse(res.data as unknown as string);

         setErrors(responseData?.errors ?? {});
         if (responseData?.status) {
            queryClient.refetchQueries({
               queryKey: ["usulan-kegiatan", idUsulanKegiatanNum, "dokumen", limit, offset],
            });
            toast.success(responseData?.message);
            return;
         }

         toast.error(responseData?.message);
      } catch (error) {
         toast.error((error as Error).message);
      } finally {
         setIsPending(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Upload Dokumen Pendukung</DialogTitle>
               <DialogDescription>Silakan upload dokumen pendukung untuk melengkapi data Anda.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="w-full max-h-[calc(100vh-200px)] min-h-0">
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="row">
                     <div className="col-12 mb-3">
                        <FormText
                           label="Nama Dokumen"
                           name="nama_dokumen"
                           value={getValue(formData as Lists, "nama_dokumen")}
                           onChange={(value) => setFormData((prev) => ({ ...prev, nama_dokumen: value }))}
                           errors={errors}
                        />
                     </div>
                     <div className="col-12">
                        <FormFile
                           label="File Dokumen"
                           name="file_dokumen"
                           onChange={(value) => setFormData((prev) => ({ ...prev, file_dokumen: value }))}
                           errors={errors}
                        />
                     </div>
                  </div>
                  <Button type="submit" size="sm" disabled={isPending}>
                     {isPending ? btn_loading() : "Simpan"}
                  </Button>
               </form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
}

export default function Page() {
   const { setButton } = useHeaderButton();
   const { setOpen } = useDialog();

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Tambah Dokumen
         </Button>
      );

      return () => {
         setButton(<div />);
      };
   }, [setButton, setOpen]);

   return (
      <div className="p-6 text-center">
         <Suspense fallback={<LoadingElement />}>
            <ActionDialog />
         </Suspense>
      </div>
   );
}
