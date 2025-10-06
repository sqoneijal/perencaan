import ConfirmDialog from "@/components/confirm-delete";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getValue, toRupiah } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import type { NavigateFunction } from "react-router";

export type ColumnDeps = { navigate: NavigateFunction; limit: number; offset: number; status_usulan?: string };

export const getColumns = ({ navigate, limit, offset, status_usulan }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            status_usulan === "draft" && (
               <>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`${getValue(original, "id")}`)}>
                     <Pencil />
                  </Button>
                  <ConfirmDialog
                     url={`/usulan-kegiatan/actions/rab/${getValue(original, "id")}`}
                     refetchKey={[
                        ["usulan-kegiatan", getValue(original, "id_usulan"), "rab", limit, offset],
                        ["usulan-kegiatan", getValue(original, "id_usulan"), "anggaran"],
                        ["usulan-kegiatan", limit, offset],
                     ]}
                  />
               </>
            )
         );
      },
      meta: { className: "text-start w-[100px]" },
   },
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
      cell: ({ row: { original } }) => (
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
      cell: ({ row: { original } }) => toRupiah(getValue(original, "harga_satuan")),
   },
   {
      accessorKey: "total_biaya",
      header: "total biaya",
      enableSorting: true,
      cell: ({ row: { original } }) => toRupiah(getValue(original, "total_biaya")),
   },
   {
      accessorKey: "catatan",
      header: "catatan",
      enableSorting: true,
   },
];
