import ConfirmDialog from "@/components/confirm-delete";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getValue } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import type { NavigateFunction } from "react-router";

type ColumnDeps = { navigate: NavigateFunction; limit: number; offset: number };

const getColumns = ({ navigate, limit, offset }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" size="sm" onClick={() => navigate(`/referensi/standar-biaya/actions/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog
                  url={`/referensi/standar-biaya/${getValue(original, "id")}`}
                  refetchKey={["referensi", "standar-biaya", limit, offset]}
               />
            </>
         );
      },
      meta: { className: "text-start w-[100px]" },
   },
   {
      accessorKey: "kode",
      header: "kode",
      enableSorting: true,
   },
   {
      accessorKey: "nama",
      header: "nama",
      enableSorting: true,
   },
   {
      accessorKey: "deskripsi",
      header: "deskripsi",
      enableSorting: true,
   },
   {
      accessorKey: "kategori",
      header: "kategori sbm",
      enableSorting: true,
      cell: ({ row: { original } }) => (
         <Tooltip>
            <TooltipTrigger>{getValue(original, "nama_kategori")}</TooltipTrigger>
            <TooltipContent>{getValue(original, "kode_kategori")}</TooltipContent>
         </Tooltip>
      ),
   },
   {
      accessorKey: "unit_satuan",
      header: "unit satuan",
      enableSorting: true,
      cell: ({ row: { original } }) => (
         <Tooltip>
            <TooltipTrigger>{getValue(original, "nama_unit_satuan")}</TooltipTrigger>
            <TooltipContent>{getValue(original, "deskripsi_unit_satuan")}</TooltipContent>
         </Tooltip>
      ),
   },
];
export { getColumns };
