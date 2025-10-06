import ConfirmDialog from "@/components/confirm-delete";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getStatusUsulanKegiatan, getValue, toRupiah } from "@/helpers/init";
import type { ApiResponse } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { Lists } from "@/types/init";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, PlaneTakeoff } from "lucide-react";
import moment from "moment";
import type { NavigateFunction } from "react-router";
import { toast } from "sonner";

type ColumnDeps = {
   navigate: NavigateFunction;
   limit: number;
   offset: number;
   submitUsulan: UseMutationResult<ApiResponse<{ errors: Lists }>, Error, Record<string, unknown> | FormData, unknown>;
};

const getColumns = ({ navigate, limit, offset, submitUsulan }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" size="sm" onClick={() => navigate(`/usulan-kegiatan/actions/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog url={`/usulan-kegiatan/${getValue(original, "id")}`} refetchKey={["usulan-kegiatan", limit, offset]} />
               <Button variant="ghost" size="sm" onClick={() => navigate(`/usulan-kegiatan/${getValue(original, "id")}#informasi-dasar`)}>
                  <Eye />
               </Button>
               {getValue(original, "status_usulan") === "draft" && (
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => {
                              submitUsulan.mutate(
                                 {
                                    id_usulan: getValue(original, "id"),
                                 },
                                 {
                                    onSuccess: (data: ApiResponse<{ errors: Lists }>) => {
                                       if (data?.status) {
                                          toast.success(data?.message);

                                          queryClient.refetchQueries({
                                             queryKey: ["usulan-kegiatan", limit, offset],
                                          });
                                       } else {
                                          toast.error(data?.message);
                                       }
                                    },
                                    onError: (error: Error) => {
                                       toast.error(error.message);
                                    },
                                 }
                              );
                           }}>
                           <PlaneTakeoff />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Klik untuk pengajuan usulan kegiatan {getValue(original, "nama")}</TooltipContent>
                  </Tooltip>
               )}
            </>
         );
      },
      meta: { className: "text-start w-[170px]" },
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
      cell: ({ row: { original } }) => getStatusUsulanKegiatan(getValue(original, "status_usulan")),
   },
];
export { getColumns };
