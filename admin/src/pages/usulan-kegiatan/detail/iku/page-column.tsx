import ConfirmDialog from "@/components/confirm-delete";
import { getValue } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { jenis_iku } from "./helpers";

type ColumnDeps = { limit: number; offset: number };

export const getColumns = ({ limit, offset }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <ConfirmDialog
               url={`/usulan-kegiatan/${getValue(original, "id_usulan")}/iku/${getValue(original, "id")}`}
               refetchKey={[["usulan-kegiatan", getValue(original, "id_usulan"), "iku", limit, offset]]}
            />
         );
      },
      meta: { className: "text-start w-[20px]" },
   },
   {
      accessorKey: "jenis_iku",
      header: "jenis",
      enableSorting: true,
      cell: ({ row: { original } }) => jenis_iku?.[getValue(original, "jenis_iku")],
   },
   {
      accessorKey: "kode_iku",
      header: "kode",
      enableSorting: true,
   },
   {
      accessorKey: "deskripsi_iku",
      header: "deskripsi",
      enableSorting: true,
   },
   {
      accessorKey: "tahun_berlaku_iku",
      header: "tahun",
      enableSorting: true,
   },
];
