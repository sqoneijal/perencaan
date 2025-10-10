import ConfirmDialog from "@/components/confirm-delete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getValue, toRupiah } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import moment from "moment";
import React from "react";
import type { NavigateFunction } from "react-router";

type ColumnDeps = { navigate: NavigateFunction; limit: number; offset: number };

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

const getColumns = ({ navigate, limit, offset }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" onClick={() => navigate(`/referensi/detail-harga-sbm/actions/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog
                  url={`/referensi/detail-harga-sbm/${getValue(original, "id")}`}
                  refetchKey={["referensi", "detail-harga-sbm", limit, offset]}
               />
            </>
         );
      },
      meta: { className: "text-start w-[100px]" },
   },
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
export { getColumns };
