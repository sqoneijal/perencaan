import ConfirmDialog from "@/components/confirm-delete";
import { Button } from "@/components/ui/button";
import { getValue, toRupiah } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import moment from "moment";
import type { NavigateFunction } from "react-router";

type ColumnDeps = { navigate: NavigateFunction; limit: number; offset: number };

const getColumns = ({ navigate, limit, offset }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" size="sm" onClick={() => navigate(`/referensi/unit-satuan/actions/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog url={`/usulan-kegiatan/${getValue(original, "id")}`} refetchKey={["usulan-kegiatan", limit, offset]} />
               <Button variant="ghost" size="sm" onClick={() => navigate(`/usulan-kegiatan/${getValue(original, "id")}#informasi-dasar`)}>
                  <Eye />
               </Button>
            </>
         );
      },
      meta: { className: "text-start w-[140px]" },
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
      accessorKey: "waktu",
      header: "waktu",
      enableSorting: true,
      cell: ({ row: { original } }) =>
         `${moment(getValue(original, "waktu_mulai")).format("DD-MM-YYYY")} s.d ${moment(getValue(original, "waktu_selesai")).format("DD-MM-YYYY")}`,
   },
   {
      accessorKey: "rencanca_total_anggaran",
      header: "rencanca total anggaran",
      enableSorting: true,
      cell: ({ row: { original } }) => toRupiah(getValue(original, "rencanca_total_anggaran")),
   },
   {
      accessorKey: "total_anggaran",
      header: "total anggaran",
      enableSorting: true,
      cell: ({ row: { original } }) => toRupiah(getValue(original, "total_anggaran")),
   },
   {
      accessorKey: "status_usulan",
      header: "status",
      enableSorting: true,
   },
];
export { getColumns };
