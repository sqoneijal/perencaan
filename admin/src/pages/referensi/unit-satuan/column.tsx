import ConfirmDialog from "@/components/confirm-delete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getValue } from "@/helpers/init";
import type { Lists } from "@/types/init";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import type { NavigateFunction } from "react-router";

type ColumnDeps = { navigate: NavigateFunction };

const getColumns = ({ navigate }: ColumnDeps): Array<ColumnDef<Lists>> => [
   {
      accessorKey: "aksi",
      header: "",
      cell: ({ row: { original } }) => {
         return (
            <>
               <Button variant="ghost" size="sm" onClick={() => navigate(`/referensi/unit-satuan/actions/${getValue(original, "id")}`)}>
                  <Pencil />
               </Button>
               <ConfirmDialog url={`/referensi/unit-satuan/${getValue(original, "id")}`} refetchKey={["referensi", "unit-satuan"]} />
            </>
         );
      },
      meta: { className: "text-start w-[50px]" },
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
      cell: ({ row: { original } }) => <Badge variant="outline">{getValue(original, "akti") === "t" ? "Aktif" : "Tidak Aktif"}</Badge>,
   },
];
export { getColumns };
