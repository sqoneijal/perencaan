import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getValue, toRupiah } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";

export const getColumns = (): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "uraian_biaya",
      header: "uraian",
      enableSorting: true,
   },
   {
      accessorKey: "qty",
      header: "qty",
      enableSorting: true,
   },
   {
      accessorKey: "id_satuan",
      header: "satuan",
      enableSorting: true,
      cell: ({ row: { original } }: { row: { original: Lists } }) => (
         <Tooltip>
            <TooltipTrigger>{getValue(original, "nama_satuan")}</TooltipTrigger>
            <TooltipContent>{getValue(original, "deskripsi_satuan")}</TooltipContent>
         </Tooltip>
      ),
   },
   {
      accessorKey: "harga_satuan",
      header: "harga",
      enableSorting: true,
      cell: ({ row: { original } }: { row: { original: Lists } }) => toRupiah(getValue(original, "harga_satuan")),
   },
   {
      accessorKey: "total_biaya",
      header: "total biaya",
      enableSorting: true,
      cell: ({ row: { original } }: { row: { original: Lists } }) => toRupiah(getValue(original, "total_biaya")),
   },
   {
      accessorKey: "catatan",
      header: "catatan",
      enableSorting: true,
   },
];
