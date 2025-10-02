import Table from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getValue, toRupiah } from "@/helpers/init";
import { useDialog, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { toast } from "sonner";

const renderTanggalEfektif = (tanggal_mulai: string, tanggal_akhir: string) => {
   const content: React.ReactNode = moment(tanggal_mulai).format("DD-MM-YYYY");

   if (tanggal_akhir) {
      return (
         <>
            {content} s.d {moment(tanggal_akhir).format("DD-MM-YYYY")}
         </>
      );
   }
   return content;
};

const getColumnsDialog = (): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "kode_standar_biaya",
      header: "kode",
      enableSorting: true,
   },
   {
      accessorKey: "nama_standar_biaya",
      header: "nama",
      enableSorting: true,
   },
   {
      accessorKey: "tahun_anggaran",
      header: "tahun",
      enableSorting: true,
   },
   {
      accessorKey: "harga_satuan",
      header: "harga",
      enableSorting: true,
      cell: ({ row: { original } }) => toRupiah(getValue(original, "harga_satuan")),
   },
   {
      accessorKey: "nama_satuan",
      header: "satuan",
      enableSorting: true,
      cell: ({ row: { original } }) => (
         <Tooltip>
            <TooltipTrigger>{getValue(original, "nama_satuan")}</TooltipTrigger>
            <TooltipContent>{getValue(original, "status_satuan") === "t" ? "Aktif" : "Tidak Aktif"}</TooltipContent>
         </Tooltip>
      ),
   },
   {
      accessorKey: "efektif",
      header: "efektif",
      enableSorting: true,
      cell: ({ row: { original } }) => renderTanggalEfektif(getValue(original, "tanggal_mulai_efektif"), getValue(original, "tanggal_akhir_efektif")),
   },
   {
      accessorKey: "status_validasi",
      header: "status",
      enableSorting: true,
      cell: ({ row: { original } }) => (
         <Badge variant="outline">{getValue(original, "status_validasi").replace(/\b\w/g, (l) => l.toUpperCase())}</Badge>
      ),
   },
];

function DialogHargaSBM({ onRowClick }: Readonly<{ onRowClick: (row: Lists) => void }>) {
   const { open, setOpen } = useDialog();
   const { pagination } = useTablePagination();

   const limit = pagination.pageSize;
   const offset = pagination.pageIndex * pagination.pageSize;

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["referensi", "detail-harga-sbm", limit, offset],
      url: "/referensi/detail-harga-sbm",
      params: { limit, offset },
   });

   if (error) return toast.error(error?.message);

   return (
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
         <DialogContent className="w-auto min-h-0 sm:max-w-none">
            <DialogHeader>
               <DialogTitle>Daftar Harga SBM</DialogTitle>
               <DialogDescription>
                  Daftar Harga SBM berisi standar biaya yang sudah ditetapkan pemerintah, silakan pilih sesuai kebutuhan dari daftar yang tersedia.
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

export default DialogHargaSBM;
