import ConfirmDialog from "@/components/confirm-delete";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { getValue } from "@/helpers/init";
import { useHeaderButton, useTablePagination } from "@/hooks/store";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/table-core";
import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router";

export default function Rab() {
   const { pagination } = useTablePagination();
   const { setButton } = useHeaderButton();
   const { id_usulan_kegiatan } = useParams();

   const navigate = useNavigate();

   const limit = pagination.pageSize;
   const offset = pagination.pageIndex * pagination.pageSize;

   useEffect(() => {
      setButton(
         <Button variant="outline" size="sm" onClick={() => navigate(`/usulan-kegiatan/${id_usulan_kegiatan}/rab/actions`)}>
            Tambah RAB
         </Button>
      );

      return () => {
         setButton(<div />);
      };
   }, [setButton, navigate, id_usulan_kegiatan]);

   return <Table columns={getColumns({ navigate, limit, offset })} data={[]} total={0} />;
}

type ColumnDeps = { navigate: NavigateFunction; limit: number; offset: number };

const getColumns = ({ navigate, limit, offset }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" size="sm" onClick={() => navigate(`/referensi/detail-harga-sbm/actions/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog
                  url={`/referensi/detail-harga-sbm/${getValue(original, "id")}`}
                  refetchKey={["referensi", "detail-harga-sbm", limit, offset]}
               />
               <Button variant="ghost" size="sm" onClick={() => navigate(`/referensi/detail-harga-sbm/${getValue(original, "id")}`)}>
                  <Eye />
               </Button>
            </>
         );
      },
      meta: { className: "text-start w-[150px]" },
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
   },
   {
      accessorKey: "harga_satuan",
      header: "harga",
      enableSorting: true,
   },
   {
      accessorKey: "total_biaya",
      header: "total biaya",
      enableSorting: true,
   },
   {
      accessorKey: "catatan",
      header: "catatan",
      enableSorting: true,
   },
];
