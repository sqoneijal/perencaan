import ConfirmDialog from "@/components/confirm-delete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
               <Button variant="ghost" onClick={() => navigate(`/referensi/unit-satuan/actions/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog url={`/referensi/unit-satuan/${getValue(original, "id")}`} refetchKey={["referensi", "unit-satuan", limit, offset]} />
            </>
         );
      },
      meta: { className: "text-start w-[100px]" },
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
      accessorKey: "aktif",
      header: "status",
      enableSorting: true,
      cell: ({ row: { original } }) => <Badge variant="outline">{getValue(original, "aktif") === "t" ? "Aktif" : "Tidak Aktif"}</Badge>,
      meta: { className: "text-center" },
   },
];
export { getColumns };
