import Table from "@/components/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDialog, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import { toast } from "sonner";
import { getColumnsDialog } from "./dialog-action-column";

export default function DialogIKUMaster({ onRowClick }: Readonly<{ onRowClick: (row: Lists) => void }>) {
   const { open, setOpen } = useDialog();
   const { pagination } = useTablePagination();

   const limit = pagination.pageSize;
   const offset = pagination.pageSize * pagination.pageIndex;

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["master-iku", limit, offset],
      url: "/master-iku",
      params: { limit, offset },
   });

   if (error) toast.error(error?.message);

   return (
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
         <DialogContent className="w-auto min-h-0 sm:max-w-none">
            <DialogHeader>
               <DialogTitle>Daftar IKU Master</DialogTitle>
               <DialogDescription>
                  IKU (Indikator Kinerja Utama) adalah standar ukuran yang digunakan untuk menilai kinerja perguruan tinggi maupun rektor. Silakan
                  pilih atau masukkan data IKU sesuai ketentuan.
               </DialogDescription>
            </DialogHeader>
            <ScrollArea className="w-full max-h-[calc(100vh-200px)] min-h-0">
               <Table
                  columns={getColumnsDialog()}
                  data={Array.isArray(data?.results) ? data?.results : []}
                  total={data?.total ?? 0}
                  isLoading={isLoading}
                  trCursor={true}
                  onRowClick={onRowClick}
               />
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
}
