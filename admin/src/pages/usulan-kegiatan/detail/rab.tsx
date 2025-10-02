import ConfirmDialog from "@/components/confirm-delete";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getValue, toRupiah } from "@/helpers/init";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import { useApiQuery } from "@/lib/useApi";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/table-core";
import { Pencil } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router";
import { toast } from "sonner";

export default function Rab() {
   const { pagination } = useTablePagination();
   const { setButton } = useHeaderButton();
   const { id_usulan_kegiatan } = useParams();

   const navigate = useNavigate();

   const limit = pagination.pageSize;
   const offset = pagination.pageIndex * pagination.pageSize;

   // Convert id_usulan_kegiatan to number or fallback to 0
   const idUsulanKegiatanNum = id_usulan_kegiatan ? Number(id_usulan_kegiatan) : 0;

   const { data, isLoading, error } = useApiQuery<{
      results: Array<Lists>;
      total: number;
   }>({
      queryKey: ["usulan-kegiatan", idUsulanKegiatanNum, "rab", limit, offset],
      url: `/usulan-kegiatan/${idUsulanKegiatanNum}/rab`,
      params: { limit, offset },
   });

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate(`/usulan-kegiatan/${idUsulanKegiatanNum}/rab/actions`)}>
            Tambah RAB
         </Button>
      );

      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate, idUsulanKegiatanNum]);

   if (error) return toast.error(error?.message);

   return (
      <Table
         columns={getColumns({ navigate, limit, offset, id_usulan_kegiatan: idUsulanKegiatanNum })}
         data={Array.isArray(data?.results) ? data?.results : []}
         total={data?.total ?? 0}
         isLoading={isLoading}
      />
   );
}

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
                  url={`/usulan-kegiatan/actions/rab/${getValue(original, "id")}`}
                  refetchKey={[
                     ["usulan-kegiatan", idUsulanKegiatanNum, "rab", limit, offset],
                     ["usulan-kegiatan", idUsulanKegiatanNum, "anggaran"],
                  ]}
               />
            </>
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
