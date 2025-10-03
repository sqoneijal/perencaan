import ConfirmDialog from "@/components/confirm-delete";
import { Button } from "@/components/ui/button";
import { getValue } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { type NavigateFunction } from "react-router";

type ColumnDeps = { navigate: NavigateFunction; limit: number; offset: number; id_usulan_kegiatan: number };

const getColumns = ({ navigate, limit, offset, id_usulan_kegiatan: idUsulanKegiatanNum }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" size="sm" onClick={() => navigate(`/usulan-kegiatan/delete/rab/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog
                  url={`/usulan-kegiatan/actions/dokumen/${getValue(original, "id")}`}
                  refetchKey={[["usulan-kegiatan", idUsulanKegiatanNum, "dokumen", limit, offset]]}
               />
               <Button variant="ghost" size="sm" onClick={() => window.open(getValue(original, "path_file"), "_blank")}>
                  <Eye />
               </Button>
            </>
         );
      },
      meta: { className: "text-start w-[150px]" },
   },
   {
      accessorKey: "nama_dokumen",
      header: "nama dokumen",
      enableSorting: true,
   },
   {
      accessorKey: "tipe_dokumen",
      header: "tipe dokumen",
      enableSorting: true,
   },
   {
      accessorKey: "file_dokumen",
      header: "file dokumen",
      enableSorting: true,
   },
];

export { getColumns };
export type { ColumnDeps };
